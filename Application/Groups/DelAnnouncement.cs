using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Groups
{
    public class DelAnnouncement
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Guid GroupId { get; set; }
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

                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { group = "Not found" });

                // Get announcement
                var announcement = group.Announcements.FirstOrDefault(x => x.Id == request.Id);
                if (announcement == null)
                    throw new RestException(HttpStatusCode.NotFound, new { announcement = "Not found" });

                // Remove it
                group.Announcements.Remove(announcement);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem Deleting that group announcement.");
            }
        }
    }
}