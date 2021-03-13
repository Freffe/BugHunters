using Domain;
using NUnit.Framework;
using Application.Groups;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using System.Linq;
using Application.Core;

namespace NUnitTest.Application.IntegrationTests.Groups.Commands
{
    using static Testing;
    using List = global::Application.Groups.List;

    class GetGroupsTests : TestBase
    {
        [Test]
        public async Task ShouldReturnAllGroupsAndAssociatedItems()
        {
            var user = ReturnUser();
            var testThis = new Group
            {
                GroupName = "Hammarby IF 2",
                Id = Guid.NewGuid(),
                Description = "Bajen bärs och brudar",
                IsPublic = false,
                CreatedAt = DateTime.Now,
            };

            // Arrange
            await AddAsync(testThis);



            var query = new List.Query();

            // Act
            Result<List<GroupDto>> result = await SendAsync(query);

            // Assert
            result.Value.Should().NotBeNull();
            result.Value.Should().HaveCount(1);
            result.Value.First().GroupName.Should().Be(testThis.GroupName);
        }
    }
}
