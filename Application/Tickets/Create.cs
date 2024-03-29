using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tickets
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public Guid? GroupId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime Date { get; set; }
            public string Status { get; set; }
            public string BugType { get; set; }
            public string Device { get; set; }
            public string Version { get; set; }
            public string Priority { get; set; }
            public Photo Photos { get; set; }
#nullable enable
            public IFormFile?[] File { get; set; }
#nullable disable
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.BugType).NotEmpty();
                RuleFor(x => x.Priority).NotEmpty();
                RuleFor(x => x.Device).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly ITextFileAccessor _textFileAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor, ITextFileAccessor textFileAccessor)
            {
                _textFileAccessor = textFileAccessor;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                if (user == null)
                    return null;

                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                    return null;

                var ticket = new Ticket
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Date = request.Date,
                    Status = request.Status,
                    BugType = request.BugType,
                    Device = request.Device,
                    Version = request.Version,
                    Priority = request.Priority,
                    GroupId = group.Id,
                    TicketOwnerId = user.Id,
                    Creator = user.UserName,
                    Photos = new List<Photo>(),
                    Texts = new List<Text>()
                };
                // If photo in request, create new photo then add it to ticket
                //Console.WriteLine(request.File);
                if (request.File != null)
                {
                    foreach (var photoFile in request.File)
                    {
                        //Console.WriteLine(photoFile.FileName);
                        string[] enders = { ".png", ".jpg" };
                        if (enders.Any(photoFile.FileName.Contains))
                        {
                            //Console.WriteLine("Found png or jpg");
                            var photoUploadResult = _photoAccessor.AddPhoto(photoFile);
                            //Console.WriteLine($"{photoUploadResult} Found png or jpg");

                            var photo = new Photo
                            {
                                Url = photoUploadResult.Url,
                                Id = photoUploadResult.PublicId,
                                Name = photoFile.FileName
                            };
                            //Console.WriteLine($"Adding photo with Name: {photo.Name}");

                            ticket.Photos.Add(photo);
                        }

                        string[] endersText = { ".txt" };
                        if (endersText.Any(photoFile.FileName.Contains))
                        {
                            var textFileUploadResult = _textFileAccessor.AddTextFile(photoFile);
                            //Console.WriteLine($"{textFileUploadResult} is result from addTextFile");

                            var text = new Text
                            {
                                Url = textFileUploadResult.Url,
                                Id = textFileUploadResult.PublicId,
                                Name = photoFile.FileName
                            };

                            ticket.Texts.Add(text);
                            //Console.WriteLine($"Added text: {photoFile.FileName}");
                        }
                    }



                }

                var status = request.Status.ToLower();
                // Update the groups status value
                if (status == "open")
                    group.Open += 1;
                if (status == "verify")
                    group.Verify += 1;
                if (status == "closed")
                    group.Closed += 1;

                _context.Tickets.Add(ticket);

                group.Tickets.Add(ticket);


                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed to create ticket.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}