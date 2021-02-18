using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Tickets
{
    public class DelComment
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public Guid TicketId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {

                var ticket = await _context.Tickets.FindAsync(request.TicketId);
                if (ticket == null)
                    return null;

                // Get comment
                var comment = ticket.Comments.FirstOrDefault(x => x.Id == request.Id);
                if (comment == null)
                    return null;

                // Remove it
                ticket.Comments.Remove(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed to delete comment.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}