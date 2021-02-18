using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Groups
{
    public class DelAnnouncement
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public Guid GroupId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {

                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                    return null;

                var announcement = group.Announcements.FirstOrDefault(x => x.Id == request.Id);
                if (announcement == null)
                    return null;

                group.Announcements.Remove(announcement);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed deleting announcement.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}