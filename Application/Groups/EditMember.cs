using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Groups
{
    public class EditMember
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid GroupId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get userGroup and flip isAdmin for target user
                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                    return null;

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                if (user == null)
                    return null;

                var membership = await _context.UserGroups.SingleOrDefaultAsync(x => x.GroupId == group.Id && x.AppUserId == user.Id);

                if (membership == null)
                    return null;

                // Flip admin status for this member
                membership.IsAdmin = !membership.IsAdmin;

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed updating member.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}