using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
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
        public class Command : IRequest
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
            public IFormFile? File { get; set; }
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
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "User not found " });

                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { group = "Group not found!" });

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
                    Photos = new List<Photo>()
                };
                // If photo in request, create new photo then add it to ticket
                if (request.File != null)
                {

                    var photoUploadResult = _photoAccessor.AddPhoto(request.File);

                    var photo = new Photo
                    {
                        Url = photoUploadResult.Url,
                        Id = photoUploadResult.PublicId
                    };

                    ticket.Photos.Add(photo);
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

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes create.cs");
            }
        }
    }
}