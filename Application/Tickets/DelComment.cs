using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Tickets
{
    public class DelComment
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Guid TicketId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var ticket = await _context.Tickets.FindAsync(request.TicketId);
                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Ticket = "Not found" });

                // Get comment
                var comment = ticket.Comments.FirstOrDefault(x => x.Id == request.Id);
                if (comment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Comment = "Not found" });

                // Remove it
                ticket.Comments.Remove(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem Deleting that ticket comment.");
            }
        }
    }
}