using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Groups
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public bool IsPublic { get; set; }
            public string Description { get; set; }
            public DateTime CreatedAt { get; set; }
            public string GroupName { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.GroupName).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.IsPublic).NotNull();
                RuleFor(x => x.CreatedAt).NotEmpty();
            }
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
                var group = new Group
                {
                    GroupName = request.GroupName,
                    Id = request.Id,
                    Description = request.Description,
                    CreatedAt = request.CreatedAt,
                    Open = 0,
                    Closed = 0,
                    Verify = 0,
                    IsPublic = request.IsPublic,
                    Comments = new List<Comment>()
                };

                _context.Groups.Add(group);
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());
                if (user == null)
                    return null;

                var newMember = new UserGroup
                {
                    AppUser = user,
                    Group = group,
                    IsHost = true,
                    DateJoined = DateTime.Now,
                    IsAdmin = false
                };
                _context.UserGroups.Add(newMember);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed to create group.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}