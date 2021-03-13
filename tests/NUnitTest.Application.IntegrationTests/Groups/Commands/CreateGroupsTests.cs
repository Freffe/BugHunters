using Application.Errors;
using Application.Groups;
using Application.User;
using Domain;
using FluentAssertions;
using FluentValidation;
using FluentValidation.TestHelper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NUnitTest.Application.IntegrationTests.Groups.Commands
{
    using static Testing;
    class CreateGroupsTests : TestBase
    {
        private Create.CommandValidator _validator;

        [Test]
        public void ShouldRequireMinimumFields()
        {
            var user = ReturnUser();
            var command = new Create.Command();
            // Test FluentValidation fields
            _validator = new Create.CommandValidator();
            // Should_have_error_when_Field_is_Empty()
            var result = _validator.TestValidate(command);
          
            result.ShouldHaveValidationErrorFor(group => group.GroupName);
            result.ShouldHaveValidationErrorFor(group => group.Description);
           // result.ShouldHaveValidationErrorFor(group => group.IsPublic);
            result.ShouldHaveValidationErrorFor(group => group.CreatedAt);
            result.ShouldNotHaveValidationErrorFor(group => group.Id);


        }
        [Test]
        public async Task ShouldRequireUniqueTitle()
        {
            // Create generic user tom if he doesnt exist
            var user = ReturnUser();
            // HttpContext is Null for UserAccessor getting current username.
            await SendAsync(new Create.Command
            {
                GroupName = "Hammarby2",
                Description = "Welcome.",
                CreatedAt = DateTime.UtcNow,
                IsPublic = true
            });

            var command = new Create.Command { GroupName = "Hammarby2",
                Description = "Welcome.",
                CreatedAt = DateTime.UtcNow,
                IsPublic = true
            };
            // EF core throws DbUpdateException when failing to update db for Uniqueness. Deeper exception should be UniqueConstraintException
            FluentActions.Invoking(() => SendAsync(command)).Should().Throw<DbUpdateException>();
        }
        [Test]
        public async Task ShouldCreateGroup()
        {
            // Arrange
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");
            TestContext.Out.WriteLine($"User: {user.Value.Username}, {user.Value.RefreshToken}, {user.Value.DisplayName}, {GenericUserExists()}");

            var testId = Guid.NewGuid();
            var command = new Create.Command
            {
                GroupName = "Hammarby IF 3",
                Id = testId,
                Description = "Bajen bärs och brudar",
                IsPublic = false,
                CreatedAt = DateTime.Now,
            };

            //Act
            var response = await SendAsync(command);
            var list = await FindAsync<Group>(testId);

            var userDB = await FindAsync<AppUser>(GetCurrentUserId());
            var details = await SendAsync(new Details.Query { Id = testId });

            // Assert
            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);


            list.Should().NotBeNull();
            list.GroupName.Should().Be(command.GroupName);
            list.CreatedAt.Should().BeCloseTo(DateTime.Now, 25000);


            if (details.IsSuccess)
            {
                var usergrp = details.Value.UserGroups.Where(x => x.Username == userDB.UserName).ToList();
                TestContext.Out.WriteLine($"userGroup for user: {usergrp[0].Username}");
                usergrp.Should().NotBeNull();
                usergrp.Count().Should().Be(1);
                usergrp[0].Username.Should().Be(userDB.UserName);
                usergrp[0].DisplayName.Should().Be(userDB.DisplayName);
                usergrp[0].Image.Should().Be(null);

            }
            details.IsSuccess.Should().Be(true);

        }

        public void SetUpUserGroup()
        {
            // Create generic user tom if he doesnt exist
            var user = ReturnUser();


            //await context.Groups.AddRangeAsync(groups);
            //await context.SaveChangesAsync();
        }
    }
}


