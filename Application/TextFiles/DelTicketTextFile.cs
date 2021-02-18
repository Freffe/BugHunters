using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.TextFiles
{
    public class DelTicketTextFile
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid TicketId { get; set; }
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly ITextFileAccessor _textFileAccessor;
            public Handler(DataContext context, ITextFileAccessor textFileAccessor)
            {
                _textFileAccessor = textFileAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                var ticket = await _context.Tickets.SingleOrDefaultAsync(x => x.Id == request.TicketId);
                if (ticket == null)
                    return null;

                var text = ticket.Texts.FirstOrDefault(x => x.Id == request.Id);
                if (text == null)
                    return null;

                var result = _textFileAccessor.DeleteTextFile(text.Id);

                if (result == null)
                    return null;

                ticket.Texts.Remove(text);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed deleting text file.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}