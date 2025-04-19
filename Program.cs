using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using FluentEmail.Core;
using FluentEmail.Smtp;
using System.Net;
using System.Net.Mail;
using WebApplication1.Models;

var builder = WebApplication.CreateBuilder(args);

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

    // CORS policy
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", builder =>
        {
            builder.WithOrigins("http://localhost:3000")
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

    // Swagger
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Staff API", Version = "v1" });
    });

    var app = builder.Build(); // Now this is after 'builder' is initialized

    // Enable CORS
    app.UseCors("AllowReactApp");

    // Middleware
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Staff API v1");
    });

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
    var logger = loggerFactory.CreateLogger<Program>();
    logger.LogError(ex, "An error occurred during application startup");
    throw;
}
