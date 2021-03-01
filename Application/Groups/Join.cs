using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
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
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var group = await _context.Groups.FindAsync(request.Id);
                Console.WriteLine($"Group is: {group}, using {request.Id}");
                if (group == null)
                    return null;

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                Console.WriteLine($"User is: {user}, using {_userAccessor.GetCurrentUsername()}");
                if (user == null)
                    return null;

                var membership = await _context.UserGroups.SingleOrDefaultAsync(x => x.GroupId == group.Id && x.AppUserId == user.Id);
                Console.WriteLine($"membership is: {membership}, using {user.Id}");
                if (membership != null)
                    return null;

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

                if (!success) return Result<Unit>.Failure("Failed joining group.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}