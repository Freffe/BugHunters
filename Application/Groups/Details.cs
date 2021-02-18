using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Groups
{
    public class Details
    {
        public class Query : IRequest<Result<GroupDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<GroupDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<GroupDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var group = await _context.Groups.FindAsync(request.Id);

                if (group == null)
                    return null;

                var groupToReturn = _mapper.Map<Group, GroupDto>(group);
                return Result<GroupDto>.Success(groupToReturn);
            }
        }
    }
}