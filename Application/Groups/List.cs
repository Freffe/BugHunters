using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Groups
{
    public class List
    {
        public class Query : IRequest<Result<List<GroupDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<GroupDto>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<List<GroupDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var groups = await _context.Groups.ToListAsync();
                var mappedGroups = _mapper.Map<List<Group>, List<GroupDto>>(groups);
                return Result<List<GroupDto>>.Success(mappedGroups);
            }
        }
    }
}