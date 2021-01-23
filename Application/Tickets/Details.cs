using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Tickets
{
    public class Details
    {
        public class Query : IRequest<TicketDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, TicketDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<TicketDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var ticket = await _context.Tickets.FindAsync(request.Id);

                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { ticket = "Not found" });

                return _mapper.Map<Ticket, TicketDto>(ticket);
            }
        }
    }
}