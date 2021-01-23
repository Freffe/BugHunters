using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Tickets
{
    public class EditComment
    {
        public class Command : IRequest
        {
            public Guid TicketId { get; set; }
            public Guid CommentId { get; set; }

            public String Body { get; set; }

            public DateTime? CreatedAt { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
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
                var comment = ticket.Comments.FirstOrDefault(x => x.Id == request.CommentId);
                if (comment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Comment = "Not found" });

                // Update this comment
                comment.Body = request.Body ?? comment.Body;
                comment.CreatedAt = request.CreatedAt ?? comment.CreatedAt;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem Updating that ticket comment.");
            }
        }
    }
}