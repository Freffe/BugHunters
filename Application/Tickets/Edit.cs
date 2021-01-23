using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Tickets
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime? Date { get; set; }

            public string Status { get; set; }
            public string BugType { get; set; }
            public string Device { get; set; }
            public string Version { get; set; }
            public string Priority { get; set; }
            public Guid GroupId { get; set; }
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
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var ticket = await _context.Tickets.FindAsync(request.Id);

                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { ticket = "Not found" });

                var group = await _context.Groups.FindAsync(ticket.GroupId);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { group = "Group not found!" });

                var status = ticket.Status.ToLower();

                ticket.Title = request.Title ?? ticket.Title;
                ticket.Description = request.Description ?? ticket.Description;
                ticket.Device = request.Device ?? ticket.Device;
                ticket.Date = request.Date ?? ticket.Date;
                ticket.BugType = request.BugType ?? ticket.BugType;
                ticket.Status = request.Status ?? ticket.Status;
                ticket.Version = request.Version ?? ticket.Version;
                ticket.Priority = request.Priority ?? ticket.Priority;
                // Playing, fix this later
                ticket.GroupId = request.GroupId;

                // Update the status of the group if this ticket changed
                var reqStatusLowered = request.Status.ToLower();
                if (reqStatusLowered != status)
                {
                    if (reqStatusLowered == "open")
                        group.Open += 1;
                    if (reqStatusLowered == "verify")
                        group.Verify += 1;
                    if (reqStatusLowered == "closed")
                        group.Closed += 1;
                    if (status == "open")
                        group.Open -= 1;
                    if (status == "verify")
                        group.Verify -= 1;
                    if (status == "closed")
                        group.Closed -= 1;
                }
                group.Open = 0;
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes Edit");
            }
        }
    }
}