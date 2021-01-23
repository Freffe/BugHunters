using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com",
                        EmailConfirmed = true
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }
            if (!context.Groups.Any())
            {
                var groups = new List<Group>
                {
                    new Group
                    {
                        GroupName = "Suckers",
                        Description = "Welcome to the Shitty Iphone Group where we look at eachothers iphones and sigh.",
                        CreatedAt = DateTime.UtcNow,
                        IsPublic = true,
                        UserGroups = new List<UserGroup>
                        {
                            new UserGroup
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2),
                                IsAdmin = true
                            },
                            new UserGroup
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-2),
                                IsAdmin = true
                            },
                                        new UserGroup
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-2),
                                IsAdmin = false
                            }
                        }
                    },
                    new Group
                    {
                        GroupName = "Badass",
                        Description = "Android rules dude",
                        CreatedAt = DateTime.UtcNow,
                        IsPublic = true,
                        UserGroups = new List<UserGroup>
                        {
                            new UserGroup
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2),
                                IsAdmin = false
                            },
                            new UserGroup
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-2),
                                IsAdmin = false
                            }
                        }
                    }
                };

                if (!context.Tickets.Any())
                {
                    var tickets = new List<Ticket>
                {
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggy cam",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Camera is taking photos instead of recording video",
                        Status = "Closed",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "a"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggys cam",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Activity 1 month ago",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "a"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggy zcam",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Activity 1 month in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "a"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggyq cam",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity 2 months in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "c"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggye cam",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Activity 3 months in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "b"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggytr cam",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Activity 4 months in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "b"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggyqwe cam",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Activity 5 months in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "b"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggyzzz cam",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Activity 6 months in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "b"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggyaa cam",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Activity 2 months ago",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S10",
                        Version = "v4",
                        Priority = "Low",
                        TicketOwnerId = "b"
                    },
                    new Ticket
                    {
                        Title = "[Swedish][Camera] Buggyweqwe cam",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Activity 8 months in future",
                        Status = "Open",
                        BugType = "Localization",
                        Device = "Samsung Galaxy S5",
                        Version = "v1",
                        Priority = "High",
                        TicketOwnerId = "b"
                    }
                };

                    context.Tickets.AddRange(tickets);
                }

                await context.Groups.AddRangeAsync(groups);
                await context.SaveChangesAsync();
            }
        }
    }
}