using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tickets
{
    public class List
    {
        public class Query : IRequest<Result<List<TicketDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<TicketDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<TicketDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tickets = await _context.Tickets.ToListAsync();
                var mappedTickets = _mapper.Map<List<Ticket>, List<TicketDto>>(tickets);
                return Result<List<TicketDto>>.Success(mappedTickets);
            }
        }
    }
}