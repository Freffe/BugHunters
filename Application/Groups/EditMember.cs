using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Groups
{
    public class EditMember
    {
        public class Command : IRequest
        {
            public Guid GroupId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get userGroup and flip isAdmin for target user
                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Group = "Not Found" });

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var membership = await _context.UserGroups.SingleOrDefaultAsync(x => x.GroupId == group.Id && x.AppUserId == user.Id);

                if (membership == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Membership = "Membership not found" });

                // Flip admin status for this member
                membership.IsAdmin = !membership.IsAdmin;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes ");
            }
        }
    }
}