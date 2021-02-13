using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Text> Texts { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Announcement> Announcements { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {

            // Give appuser primary key of string
            base.OnModelCreating(builder);

            builder.Entity<Ticket>()
                .HasOne<Group>()
                .WithMany(t => t.Tickets)
                .HasForeignKey(t => t.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Ticket>()
                .HasOne<AppUser>()
                .WithMany(t => t.Tickets)
                .HasForeignKey(t => t.TicketOwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Added 2021-01-14

            builder.Entity<Comment>()
                .HasOne<Ticket>()
                .WithMany(t => t.Comments)
                .HasForeignKey(t => t.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            /*
                        builder.Entity<Comment>()
                            .HasOne<AppUser>()
                            .WithMany(t => t.Tickets)
                            .HasForeignKey(t => t.TicketId)
                            .OnDelete(DeleteBehavior.Cascade); */
            /*
                        builder.Entity<AppUser>()
                            .HasMany<RefreshToken>()
                            .WithOne(a => a.AppUser)
                            .HasForeignKey(r => r.AppUser)
                            .OnDelete(DeleteBehavior.Cascade); 
            
                            */
            /*
                        builder.Entity<RefreshToken>()
                            .HasOne(p => p.AppUser)
                            .WithMany(b => b.RefreshTokens)
                            .HasForeignKey(p => p.AppUser)
                            .OnDelete(DeleteBehavior.Cascade);
                        */



            builder.Entity<Ticket>()
                .HasIndex(t => t.Title)
                .IsUnique();

            builder.Entity<Group>()
                .HasIndex(g => g.GroupName)
                .IsUnique();

            // Many to many relationship Appuser -> userGroups -> Groups
            builder.Entity<UserGroup>(x => x.HasKey(ug => new { ug.AppUserId, ug.GroupId }));

            builder.Entity<UserGroup>()
                .HasOne(u => u.AppUser)
                .WithMany(g => g.UserGroups)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserGroup>()
                .HasOne(g => g.Group)
                .WithMany(u => u.UserGroups)
                .HasForeignKey(g => g.GroupId);

        }


    }
}
