using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Groups
{
    public class Join
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                var group = await _context.Groups.FindAsync(request.Id);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Group = "Not Found" });

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var membership = await _context.UserGroups.SingleOrDefaultAsync(x => x.GroupId == group.Id && x.AppUserId == user.Id);

                if (membership != null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Membership = "You are already a member of this group." });

                membership = new UserGroup
                {
                    Group = group,
                    AppUser = user,
                    IsHost = false,
                    DateJoined = DateTime.Now,
                    IsAdmin = false
                };

                _context.UserGroups.Add(membership);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes ");
            }
        }
    }
}