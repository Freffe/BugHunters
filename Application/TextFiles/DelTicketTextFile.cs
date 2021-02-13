using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.TextFiles
{
    public class DelTicketTextFile
    {
        public class Command : IRequest
        {
            public Guid TicketId { get; set; }
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ITextFileAccessor _textFileAccessor;
            public Handler(DataContext context, ITextFileAccessor textFileAccessor)
            {
                _textFileAccessor = textFileAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                var ticket = await _context.Tickets.SingleOrDefaultAsync(x => x.Id == request.TicketId);
                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Ticket = "Not found" });

                var text = ticket.Texts.FirstOrDefault(x => x.Id == request.Id);
                if (text == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Text = "Not found" });

                //if (photo.IsMain)
                // throw new RestException(HttpStatusCode.BadRequest, new { Photo = "You cannot delete your main photo" });

                var result = _textFileAccessor.DeleteTextFile(text.Id);

                if (result == null)
                    throw new Exception("Problem deleting the text file");

                ticket.Texts.Remove(text);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}