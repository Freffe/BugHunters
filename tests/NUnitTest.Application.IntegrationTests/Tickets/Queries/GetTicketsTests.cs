using Application.Core;
using Application.Tickets;
using Domain;
using FluentAssertions;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using List = Application.Tickets.List;

namespace NUnitTest.Application.IntegrationTests.Tickets.Queries
{
    using static Testing;
    public class GetTicketsTests : TestBase
    {
        [Test]
        public async Task ShouldReturnAllTicketsAndAssociatedItems()
        {
            var user = ReturnUser();
            //var user = await FindAsync()
            var testThis = new Ticket
            {
                Title = "Shopping broke",
                Id = Guid.NewGuid(),
                Description = "The window screen is flickering mk",
                Date = DateTime.Now,
                Status = "Open",
                BugType = "Localization",
                Device = "Samsung galaxy S5",
                Version = "6.0.1",
                Priority = "High"
            };

            // Arrange
            await AddAsync(testThis);
            var query = new List.Query();

            // Act
            Result<List<TicketDto>> result = await SendAsync(query);

            // Assert
            result.Value.Should().NotBeNull();
            result.Value.Should().HaveCount(1);
            result.Value.First().Device.Should().Be(testThis.Device);
        }
    }
}