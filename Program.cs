using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using FluentEmail.Core;
using FluentEmail.Smtp;
using System.Net;
using System.Net.Mail;
using WebApplication1.Models;

var builder = WebApplication.CreateBuilder(args);

// --- IMPORTANT for Render: bind to the correct port ---
// Use Render's environment PORT variable or default to 8080
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
Console.WriteLine($"App running on port: {port}");  // Log the port to verify it's correct
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

try
{
    // Add services to the container
    builder.Services.AddControllers();

    // Read email settings from appsettings.json
    var emailSettings = builder.Configuration.GetSection("EmailSettings");
    var senderEmail = emailSettings["SenderEmail"];
    var senderPassword = emailSettings["SenderPassword"];

    // Validate email configuration
    if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
    {
        throw new InvalidOperationException("Email configuration is missing.");
    }

    // Configure FluentEmail with Gmail SMTP
    builder.Services.AddFluentEmail(senderEmail)
        .AddSmtpSender(new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(senderEmail, senderPassword),
            EnableSsl = true
        });

    // CORS policy (allow your frontend)
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", builder =>
        {
            builder.WithOrigins(
                "http://localhost:3000", // Local frontend for development
                "https://your-frontend-name.onrender.com" // Replace with your actual Render frontend URL
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
    });

    // Logging
    builder.Services.AddLogging();

    // Add SQL Server Configuration
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("RP_ParticipantAppConnection")));

    // Swagger Configuration
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Staff API", Version = "v1" });
    });

    var app = builder.Build();

    // Enable CORS
    app.UseCors("AllowReactApp");

    // Enable Swagger middleware
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Staff API v1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at the root path
    });

    // Disable HTTPS redirection (if needed on Render)
    // app.UseHttpsRedirection();

    // Enable Authorization
    app.UseAuthorization();

    // Health check endpoint for debugging
    app.MapGet("/health", () => Results.Ok("Application is running"));

    // Map controllers to routes
    app.MapControllers();

    // Run the application
    app.Run();
}
catch (Exception ex)
{
    var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
    var logger = loggerFactory.CreateLogger<Program>();
    logger.LogError(ex, "An error occurred during application startup");
    throw;
}
