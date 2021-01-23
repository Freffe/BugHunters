using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
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
        public class Query : IRequest<List<GroupDto>> { }

        public class Handler : IRequestHandler<Query, List<GroupDto>>
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

            public async Task<List<GroupDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                //await _context.Groups.FindAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                var groups = await _context.Groups.ToListAsync();

                return _mapper.Map<List<Group>, List<GroupDto>>(groups);
            }
        }
    }
}