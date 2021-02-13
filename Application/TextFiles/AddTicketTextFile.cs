using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.TextFiles
{
    public class AddTicketTextFile
    {
        public class Command : IRequest<Text>
        {
            public IFormFile File { get; set; }
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Text>
        {
            private readonly DataContext _context;
            private readonly ITextFileAccessor _textFileAccessor;
            public Handler(DataContext context, ITextFileAccessor textFileAccessor)
            {
                _textFileAccessor = textFileAccessor;
                _context = context;
            }

            public async Task<Text> Handle(Command request, CancellationToken cancellationToken)
            {

                var textFileUploadResult = _textFileAccessor.AddTextFile(request.File);

                var ticket = await _context.Tickets.SingleOrDefaultAsync(x => x.Id == request.Id);
                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Ticket = "Not found" });

                var text = new Text
                {
                    Url = textFileUploadResult.Url,
                    Id = textFileUploadResult.PublicId,
                    Name = textFileUploadResult.Name
                };


                ticket.Texts.Add(text);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return text;

                throw new Exception("Problem saving changes in AddTicketTextFile.cs");
            }
        }
    }
}