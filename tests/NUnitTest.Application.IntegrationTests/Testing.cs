using API;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Moq;
using NUnit.Framework;
using Persistence;
using Respawn;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Application.Interfaces;
using Infrastructure.Security;
using Application.Core;
using Application.User;

namespace NUnitTest.Application.IntegrationTests
{
    [SetUpFixture]
    /// <summary>
    /// Global file for managing global test resources
    /// </summary>
    class Testing
    {
        private static IConfiguration _configuration;
        private static IServiceScopeFactory _scopeFactory;
        private static Checkpoint _checkpoint;
        private static string _currentUserId;
        private static string _currentUserName;

        [OneTimeSetUp]
        public void RunBeforeAnyTests() 
        {
            // Bring in configuration, DB and identity in memory
            var builder = new ConfigurationBuilder()
                .SetBasePath("C:\\Users\\bigboss\\BuggHunter\\tests\\NUnitTest.Application.IntegrationTests")
                .AddJsonFile("appsettings.json", true, true)
                .AddEnvironmentVariables();

            _configuration = builder.Build();

            var services = new ServiceCollection();

            var startup = new Startup(_configuration);

            // Need IWebHostEnv
            services.AddSingleton(Mock.Of<IWebHostEnvironment>(w => w.ApplicationName == "API" && w.EnvironmentName == "Development"));
            //services.AddScoped<IJwtGenerator, JwtGenerator>();
            startup.ConfigureDevelopmentServices(services);
            //startup.ConfigureServices(services);

            // Replace service registration for ICurrentUserService
            // Remove existing registration
            var currentUserServiceDescriptor = services.FirstOrDefault(d => d.ServiceType == typeof(IUserAccessor));
            services.Remove(currentUserServiceDescriptor);
            var mockUserAccessor = Mock.Of<IUserAccessor>();
            mockUserAccessor.username = "tom@test.com";
            Mock.Get(mockUserAccessor).Setup(s => s.GetCurrentUsername()).Returns(mockUserAccessor.username);
            //services.AddTransient(provider => Mock.Of<IUserAccessor>(s => s.GetCurrentUsername() == _currentUserName));
            services.AddTransient<IUserAccessor>(s => mockUserAccessor);
    
            _scopeFactory = services.BuildServiceProvider().GetService<IServiceScopeFactory>();

            //_checkpoint = new Checkpoint() { TablesToIgnore = new[] { "__EFMigrationsHistory" }, DbAdapter = DbAdapter.MySql};

            EnsureDatabase();
        }
        public static string GetCurrentUserId()
        {
            return _currentUserId;
        }
        public static async Task ResetState()
        {
            var strings = _configuration.GetConnectionString("DefaultConnection");
            //TestContext.Out.WriteLine(strings);
            //await _checkpoint.Reset(_configuration.GetConnectionString("DefaultConnection"));
            // Reset DB
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<DataContext>();
            context.Tickets.RemoveRange(context.Tickets.ToList());
            context.Groups.RemoveRange(context.Groups.ToList());
            foreach(var user in context.Users.ToList())
            {
                foreach(var refToken in user.RefreshTokens)
                {
                    user.RefreshTokens = null;
                }
            }
            context.Texts.RemoveRange(context.Texts.ToList());
            context.Photos.RemoveRange(context.Photos.ToList());
            context.Users.RemoveRange(context.Users.ToList());
            context.UserGroups.RemoveRange(context.UserGroups.ToList());

            await context.SaveChangesAsync();
            _currentUserId = null;
            _currentUserName = null;
            TestContext.Out.WriteLine("Db cleared");

        }



        public static async Task<string> RunAsDefaultUserAsync()
        {
            return await RunAsUserAsync("tom@test.com", "Pa$$w0rd");
        }
        public static async Task<AppUser> RunAsUserAsyncs(string userName, string password)
        {
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetService<UserManager<AppUser>>();
            //var userAccessor = scope.ServiceProvider.GetService<IUserAccessor>();
            var context = scope.ServiceProvider.GetService<DataContext>();
            var user = new AppUser { UserName = userName, Email = userName, DisplayName = userName };

            var result = await userManager.CreateAsync(user, password);
            var users = context.Users.ToList();
            TestContext.Out.WriteLine(users[0].UserName);
            return users[0];
        }

        public static async Task<Result<User>> MockRegisterUser(string userName, string password)
        {
            // Arrange
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetService<UserManager<AppUser>>();
            //var jwtManager = scope.ServiceProvider.GetService<JwtGenerator>();

            var jwtManager = new JwtGenerator(_configuration);
            if (jwtManager == null)
            {
                TestContext.Out.WriteLine("jwtManager is null!");
            }
            var user = new AppUser { UserName = userName, Email = userName, DisplayName = userName, DateJoined = DateTime.UtcNow };
            _currentUserId = user.Id;
            var refreshToken = jwtManager.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            var result = await userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                return Result<User>.Success(new User(user, jwtManager, refreshToken.Token));
            }
            return Result<User>.Failure("Problem creating user.");
 
        }
         public static async Task<string> RunAsUserAsync(string userName, string password)
            {
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetService<UserManager<AppUser>>();
            //var userAccessor = scope.ServiceProvider.GetService<IUserAccessor>();

            var user = new AppUser { UserName = userName, Email = userName, DisplayName = userName };

            var result = await userManager.CreateAsync(user, password);

            _currentUserId = user.Id;
            _currentUserName = user.UserName;
           // username = _currentUserName;
            return _currentUserId;
        }
        public static bool GenericUserExists()
        {
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetService<UserManager<AppUser>>();

            if (userManager.Users.Any())
                return true;
            return false;
        }

        public static async Task<string> ReturnUser()
        {
            var user = "";
            if (!GenericUserExists())
            {
                // Create generic user
                user = await RunAsDefaultUserAsync();
            }
            else
            {
                // Set user to currentUserId
                user = GetCurrentUserId();
            }
            return user;
        }

        public static void EnsureDatabase()
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<DataContext>();
            // Context is fine here, dont need to migrate?
            context.Database.Migrate();
        }

        public static async Task AddAsync<TEntity>(TEntity entity) where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<DataContext>();
   
            context.Add(entity);

            await context.SaveChangesAsync();
        }

        public static async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
        {
            using var scope = _scopeFactory.CreateScope();

            var mediator = scope.ServiceProvider.GetService<IMediator>();
            var res = await mediator.Send(request);
            TestContext.Out.WriteLine($"SendAsync response: {res}");
            return res;
        }

        public static async Task<TEntity> FindAsync<TEntity>(params object[] keyValues) where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<DataContext>();

            return await context.FindAsync<TEntity>(keyValues);
        }

        public static async Task<List<Ticket>> LoadRelatedPhotos(Guid id)
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<DataContext>();
            var ticks = await context.Tickets.Where(x => x.Id == id).Include(p => p.Photos).ToListAsync();

            return ticks;
        }

        public static async Task<List<Ticket>> LoadRelatedTexts(Guid id)
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<DataContext>();
            var ticks = await context.Tickets.Where(x => x.Id == id).Include(p => p.Texts).ToListAsync();

            return ticks;
        }
    }
}
