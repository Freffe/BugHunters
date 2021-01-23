using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Groups
{
    public class Details
    {
        public class Query : IRequest<GroupDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, GroupDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<GroupDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var group = await _context.Groups.FindAsync(request.Id);

                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { group = "Not found" });

                var groupToReturn = _mapper.Map<Group, GroupDto>(group);
                return groupToReturn;
            }
        }
    }
}