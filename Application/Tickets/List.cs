using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tickets
{
    public class List
    {
        public class Query : IRequest<List<TicketDto>> { }

        public class Handler : IRequestHandler<Query, List<TicketDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<List<TicketDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tickets = await _context.Tickets.ToListAsync();

                return _mapper.Map<List<Ticket>, List<TicketDto>>(tickets);
            }
        }
    }
}