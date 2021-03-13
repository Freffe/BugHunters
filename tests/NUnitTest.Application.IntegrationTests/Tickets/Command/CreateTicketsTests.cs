using Domain;
using FluentAssertions;
using FluentValidation.TestHelper;
using NUnit.Framework;

using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Drawing;
using System;
using System.Linq;
using Application.Errors;
using Application.Photos;
using Application.TextFiles;

namespace NUnitTest.Application.IntegrationTests.Tickets.Command
{
    using static System.Net.Mime.MediaTypeNames;
    using static Testing;
    using Create = global::Application.Tickets.Create;
    using CreateGroup = global::Application.Groups.Create;

    class CreateTicketsTests : TestBase
    {
        private Create.CommandValidator _validator;

        [Test]
        public void ShouldRequireMinimumFields()
        {
            var user = ReturnUser();
            var command = new Create.Command();
            // No groupId on command will throw RestException since group == null

            // Test FluentValidation fields
            _validator = new Create.CommandValidator();
            // Should_have_error_when_Field_is_Empty()
            var result = _validator.TestValidate(command);
            result.ShouldHaveValidationErrorFor(ticket => ticket.Title);
            result.ShouldHaveValidationErrorFor(ticket => ticket.Description);
            result.ShouldHaveValidationErrorFor(ticket => ticket.BugType);
            result.ShouldHaveValidationErrorFor(ticket => ticket.Priority);
            result.ShouldHaveValidationErrorFor(ticket => ticket.Device);


        }
        [Test]
        public async Task ShouldRequireUniqueTitle()
        {
            var user = ReturnUser();
            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();
            await SendAsync(new Create.Command
            {
                Title = "[Peru] Machu Pichu is bugged",
                Id = testId,
                Description = "e",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "High",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337"
            });
            // Create new Ticket with the same ticket. 
            testId = Guid.NewGuid();
            var command = new Create.Command
            {
                Title = "[Peru] Machu Pichu is bugged",
                Id = testId,
                Description = "Even though this is a perfectly valid Description, this title already exists.",
                BugType = "UI",
                Device = "Iphone 2",
                Priority = "High",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337"
            };

            FluentActions.Invoking(() => SendAsync(command)).Should().Throw<Microsoft.EntityFrameworkCore.DbUpdateException>();
        }

        [Test]
        public async Task ShouldThrowIfNoStatus()
        {
            var user = ReturnUser();

            var testId = Guid.NewGuid();
            // Need a group to attach this ticket to
            Guid groupId = await SetUpUserGroup();

            var command = new Create.Command
            {
                Title = "Buggy iphone",
                Id = testId,
                Description = "e",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "High",
                Date = DateTime.Now,
                GroupId = groupId,
                Version = "1337"
            };
            FluentActions.Invoking(() => SendAsync(command)).Should().Throw<System.NullReferenceException>();

        }

        [Test]
        public async Task ShouldCreateTicketNoFiles()
        {
            var user = ReturnUser();

            var testId = Guid.NewGuid();
            // Need a group to attach this ticket to
            Guid groupId = await SetUpUserGroup();
            var command = new Create.Command
            {
                Title = "Buggy iphone",
                Id = testId,
                Description = "e",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "High",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337"
            };
            
            command.Photos.Should().BeNull();

            var response = await SendAsync(command);

            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);

            var list = await FindAsync<Ticket>(testId);

            list.Should().NotBeNull();
            list.Title.Should().Be(command.Title);
            list.GroupId.Should().Be(groupId);
            list.Date.Should().BeCloseTo(DateTime.Now, 10000);
            list.Creator.Should().Equals("tom@test.com");

        }

        [Test]
        public async Task ShouldCreateTicketWithOnePhoto()
        {
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");

            var image = await Utils.GetTestFile("C:\\Users\\bigboss\\sMediaPlatform\\Course Assets\\Images\\Luffy.jpg");
            image.Position = 0;
            TestContext.Out.WriteLine($"Image response: {image}");
            var fileName = "Luffy.png";
            FormFile[] form = new FormFile[] { new FormFile(image, 0, image.Length, "File", fileName) { Headers = new HeaderDictionary(), ContentType = "image/png" } };


            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();
          
            var command = new Create.Command
            {
                Title = "Testing Photo",
                Id = testId,
                Description = "Can you add a photo as part of a file",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "Priority",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337",
                File = form
            };


            var userDB = await FindAsync<AppUser>(GetCurrentUserId());
            command.File.Should().NotBeNull();
            var response = await SendAsync(command);
            var list = await LoadRelatedPhotos(testId);
            var photos = list.Select(p => p.Photos);


            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);
            list.Should().NotBeNull();
            foreach (var item in list)
            {
                item.Title.Should().Be(command.Title);
                item.GroupId.Should().Be(groupId);
                item.Date.Should().BeCloseTo(DateTime.Now, 10000);
                item.Creator.Should().Equals(userDB.UserName);
            }
            photos.Should().NotBeEmpty();
            photos.Count().Should().Be(1);
            var photoId = "";
            foreach (var item in photos.First())
            {
                photoId = item.Id;
                item.Name.Should().Equals(fileName);
                item.Url.Should().NotBeNullOrEmpty();
            }

            // Remove files from API.
            var delFileCommand = new DeleteTicketPhoto.Command { TicketId = testId, Id = photoId };
            var res = await SendAsync(delFileCommand);
            res.IsSuccess.Should().BeTrue();
        }

        [Test]
        public async Task ShouldCreateTicketWithMultiplePhotos()
        {
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");

            var image1 = await Utils.GetTestFile("C:\\Users\\bigboss\\sMediaPlatform\\Course Assets\\Images\\Luffy.jpg");
            var image2 = await Utils.GetTestFile("C:\\Users\\bigboss\\sMediaPlatform\\Course Assets\\Images\\user.png");
            image1.Position = 0;
            image2.Position = 0;
            TestContext.Out.WriteLine($"Image response: {image1}, {image2}");
            var fileName1 = "Luffy.jpg";
            var fileName2 = "user.png";
            FormFile[] form = new FormFile[] { 
                new FormFile(image1, 0, image1.Length, "File", fileName1) 
                { Headers = new HeaderDictionary(), ContentType = "image/jpg" },
                new FormFile(image2, 0, image2.Length, "File", fileName2)
                { Headers = new HeaderDictionary(), ContentType = "image/png" }
            };


            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();

            var command = new Create.Command
            {
                Title = "Testing Photos",
                Id = testId,
                Description = "Can you add a photos as part of a file",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "Priority",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337",
                File = form
            };


            var userDB = await FindAsync<AppUser>(GetCurrentUserId());
            command.File.Should().NotBeNull();
            var response = await SendAsync(command);
            var list = await LoadRelatedPhotos(testId);
            var photos = list.SelectMany(p => p.Photos);


            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);
            list.Should().NotBeNull();
            foreach (var item in list)
            {
                item.Title.Should().Be(command.Title);
                item.GroupId.Should().Be(groupId);
                item.Date.Should().BeCloseTo(DateTime.Now, 10000);
                item.Creator.Should().Equals(userDB.UserName);
            }
            photos.Should().NotBeEmpty();
            photos.Count().Should().Be(2);
            int index = 0;
            var photoIds = new string[2];

            foreach (var item in photos)
            {
                photoIds[index] = item.Id;
                item.Name.Should().Equals(form[index].FileName);
                item.Url.Should().NotBeNullOrEmpty();
                index++;
            }

            // Remove files from API.
            for (var i = 0; i < photoIds.Length; i++)
            {
                var delFileCommand = new DeleteTicketPhoto.Command { TicketId = testId, Id = photoIds[i] };
                var resp = await SendAsync(delFileCommand);
                resp.IsSuccess.Should().BeTrue();
            }
        }

        [Test]
        public async Task ShouldCreateTicketWithTextFile()
        {
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");

            var file = await Utils.GetTestFile("C:\\Users\\bigboss\\Desktop\\tickets.txt");
            file.Position = 0;

            TestContext.Out.WriteLine($"File response: {file}");
            var fileName1 = "tickets.txt";
            FormFile[] form = new FormFile[] {
                new FormFile(file, 0, file.Length, "File", fileName1)
                { Headers = new HeaderDictionary(), ContentType = "text/plain" },
            };


            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();

            var command = new Create.Command
            {
                Title = "Testing Text File",
                Id = testId,
                Description = "Can you add a text file as part of the formdata",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "Priority",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337",
                File = form
            };


            var userDB = await FindAsync<AppUser>(GetCurrentUserId());
            command.File.Should().NotBeNull();
            var response = await SendAsync(command);
            var list = await LoadRelatedTexts(testId);
            var files = list.SelectMany(p => p.Texts);


            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);
            list.Should().NotBeNull();
            foreach (var item in list)
            {
                item.Title.Should().Be(command.Title);
                item.GroupId.Should().Be(groupId);
                item.Date.Should().BeCloseTo(DateTime.Now, 10000);
                item.Creator.Should().Equals(userDB.UserName);
            }
            files.Should().NotBeEmpty();
            files.Count().Should().Be(1);
            int index = 0;
            var fileId = "";
            foreach (var item in files)
            {
                fileId = item.Id;
                item.Name.Should().Equals(form[index].FileName);
                item.Url.Should().NotBeNullOrEmpty();
                index++;
            }

            // Remove files from API.
            var delFileCommand = new DelTicketTextFile.Command { TicketId = testId, Id = fileId };
            var resp = await SendAsync(delFileCommand);
            resp.IsSuccess.Should().BeTrue();

        }

        [Test]
        public async Task ShouldCreateTicketWithTextFiles()
        {
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");

            var file1 = await Utils.GetTestFile("C:\\Users\\bigboss\\Desktop\\tickets.txt");
            file1.Position = 0;
            var file2 = await Utils.GetTestFile("C:\\Users\\bigboss\\Desktop\\backbutton.txt");
            file2.Position = 0;
            TestContext.Out.WriteLine($"File response: {file1}, {file2}");
            var fileName1 = "tickets.txt";
            var fileName2 = "backbutton.txt";
            FormFile[] form = new FormFile[] {
                new FormFile(file1, 0, file1.Length, "File", fileName1)
                { Headers = new HeaderDictionary(), ContentType = "text/plain" },
                new FormFile(file2, 0, file2.Length, "File", fileName2)
                { Headers = new HeaderDictionary(), ContentType = "text/plain" },
            };


            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();

            var command = new Create.Command
            {
                Title = "Testing multiple Text Files",
                Id = testId,
                Description = "Can you add a text files as part of the formdata",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "Priority",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337",
                File = form
            };


            var userDB = await FindAsync<AppUser>(GetCurrentUserId());
            command.File.Should().NotBeNull();
            var response = await SendAsync(command);
            var list = await LoadRelatedTexts(testId);
            var files = list.SelectMany(p => p.Texts);


            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);
            list.Should().NotBeNull();
            foreach (var item in list)
            {
                item.Title.Should().Be(command.Title);
                item.GroupId.Should().Be(groupId);
                item.Date.Should().BeCloseTo(DateTime.Now, 10000);
                item.Creator.Should().Equals(userDB.UserName);
            }
            files.Should().NotBeEmpty();
            files.Count().Should().Be(2);
            int index = 0;
            var fileIds = new string[2];
            foreach (var item in files)
            {
                fileIds[index] = item.Id;
                item.Name.Should().Equals(form[index].FileName);
                item.Url.Should().NotBeNullOrEmpty();
                index++;
            }

            // Remove files from API.
            for (var i = 0; i < fileIds.Length; i++)
            {
                var delFileCommand = new DelTicketTextFile.Command { TicketId = testId, Id = fileIds[i] };
                var resp = await SendAsync(delFileCommand);
                resp.IsSuccess.Should().BeTrue();
            }
        }

        [Test]
        public async Task ShouldThrowWhenFilesExceedSizeLimit()
        {
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");

            var file = await Utils.GetTestFile("C:\\Users\\bigboss\\sMediaPlatform\\Course Assets\\Images\\Luffy.jpg");
            file.Position = 0;
            TestContext.Out.WriteLine($"File response: {file}");
            var fileName = "tickets.txt";
            FormFile[] form = new FormFile[] {
                new FormFile(file, 0, 500001, "File", fileName)
                { Headers = new HeaderDictionary(), ContentType = "text/plain" },
            };


            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();

            var command = new Create.Command
            {
                Title = "Throw on size limit",
                Id = testId,
                Description = "Should throw on file size limit",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "Priority",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337",
                File = form
            };

            command.File.Should().NotBeNull();
            FluentActions.Invoking(() => SendAsync(command)).Should().Throw<RestException>();
        }

        [Test]
        public async Task ShouldCreateTicketAndIgnoreBadFileType()
        {
            var user = await MockRegisterUser("tom@test.com", "Pa$$w0rd");

            var file = await Utils.GetTestFile("C:\\Users\\bigboss\\Desktop\\asdf.py");
            file.Position = 0;
            TestContext.Out.WriteLine($"File response: {file}");
            var fileName = "asdf.py";
            FormFile[] form = new FormFile[] {
                new FormFile(file, 0, file.Length, "File", fileName)
                { Headers = new HeaderDictionary(), ContentType = "text/plain" },
            };


            var testId = Guid.NewGuid();
            Guid groupId = await SetUpUserGroup();

            var command = new Create.Command
            {
                Title = "Ignore bad file type",
                Id = testId,
                Description = "Should silently create ticket even if bad file type",
                BugType = "Localization",
                Device = "Iphone 2",
                Priority = "Priority",
                Date = DateTime.Now,
                GroupId = groupId,
                Status = "Open",
                Version = "1337",
                File = form
            };

            var response = await SendAsync(command);
            var texts = await LoadRelatedTexts(testId);
            var photos = await LoadRelatedPhotos(testId);

            response.Value.Should().Equals(Unit.Value);
            response.IsSuccess.Should().Equals(true);

            var list = await FindAsync<Ticket>(testId);

            list.Should().NotBeNull();
            list.Title.Should().Be(command.Title);
            list.GroupId.Should().Be(groupId);
            list.Date.Should().BeCloseTo(DateTime.Now, 10000);
            list.Creator.Should().Equals("tom@test.com");

            texts.Count().Equals(0);
            photos.Count().Equals(0);

        }

        public async Task<Guid> SetUpUserGroup()
        {
            // Create generic user tom if he doesnt exist
            var user = ReturnUser();
            // Create a generic group
            var testId = Guid.NewGuid();
            var command = new CreateGroup.Command
            {
                GroupName = "Hammarby IF 3",
                Id = testId,
                Description = "Bajen bärs och brudar",
                IsPublic = false,
                CreatedAt = DateTime.Now,
            };

            await SendAsync(command);

            var group = await FindAsync<Group>(testId);
            return group.Id;

        }

    }

}
