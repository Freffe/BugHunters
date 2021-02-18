using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListGroups
    {
        public class Query : IRequest<Result<List<UserGroupDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserGroupDto>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<UserGroupDto>>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    return null;

                var queryable = user.UserGroups
                    .OrderBy(a => a.Group.CreatedAt)
                    .AsQueryable();

                switch (request.Predicate)
                {

                    case "past":
                        queryable = queryable.Where(a => a.Group.CreatedAt <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    case "admin":
                        queryable = queryable.Where(a => a.IsAdmin);
                        break;
                    default:
                        queryable = queryable.Where(a => (a.Group.CreatedAt >= DateTime.Now || a.Group.CreatedAt <= DateTime.Now));
                        break;
                }

                var groups = queryable.ToList();
                var groupsToReturn = new List<UserGroupDto>();

                foreach (var group in groups)
                {
                    var userGroup = new UserGroupDto
                    {
                        Id = group.Group.Id,
                        GroupName = group.Group.GroupName,
                        Description = group.Group.Description,
                        Date = group.Group.CreatedAt
                    };

                    groupsToReturn.Add(userGroup);
                }

                return Result<List<UserGroupDto>>.Success(groupsToReturn);
            }
        }
    }
}