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
                        GroupName = "Test",
                        Description = "Welcome to the test group where you can test stuff.",
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
                        GroupName = "More then one",
                        Description = "Android wins",
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


                await context.Groups.AddRangeAsync(groups);
                await context.SaveChangesAsync();
            }
        }
    }
}