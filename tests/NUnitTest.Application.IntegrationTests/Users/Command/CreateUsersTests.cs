using Application.User;
using Domain;
using FluentAssertions;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTest.Application.IntegrationTests.Users.Command
{
    using static Testing;
    class CreateUsersTests : TestBase
    {
        [Test]
        public async Task ShouldCreateUser()
        {
            // Create generic user tom if he doesnt exist
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


            /*
             *     
             *     System.InvalidOperationException : 
             *     Error constructing handler for request of type MediatR.IRequestHandler`2[Application.User.Register+Command,Application.User.User]. 
             *     Register your handlers with the container. See the samples in GitHub for examples.
                   System.InvalidOperationException : Unable to resolve service for type 'Microsoft.Extensions.Configuration.IConfiguration' while attempting to activate 'Infrastructure.Security.JwtGenerator'.
            var command = new Register.Command
            {
                //Id = "f",
                DisplayName = "Flum",
                Username = "Flum",
                Email = "Flum@test.com",
                Password = "Pa$$w0rd"
            };
            */


            // Create user
            var newUser = await FindAsync<AppUser>(user);
            // Now get the user and check results returned match above.

            //var currentUser = await SendAsync(new CurrentUser.Query());

            newUser.DisplayName.Should().Be("tom@test.com");
            newUser.UserName.Should().Be("tom@test.com");
            newUser.Email.Should().Be("tom@test.com");
        }
    }
}
