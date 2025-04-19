using Microsoft.EntityFrameworkCore;
using RP_Training_Web_Application.Models;



using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Add your DbSet properties here — one for each table in your database.

    public DbSet<Participant> Participants { get; set; }

    // Example:
    // public DbSet<Staff> Staff { get; set; }
    // public DbSet<Position> Positions { get; set; }
    // public DbSet<Parish> Parishes { get; set; }
}
