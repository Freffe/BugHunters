using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
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
        public class Command : IRequest<Result<Text>>
        {
            public IFormFile File { get; set; }
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Text>>
        {
            private readonly DataContext _context;
            private readonly ITextFileAccessor _textFileAccessor;
            public Handler(DataContext context, ITextFileAccessor textFileAccessor)
            {
                _textFileAccessor = textFileAccessor;
                _context = context;
            }

            public async Task<Result<Text>> Handle(Command request, CancellationToken cancellationToken)
            {

                var textFileUploadResult = _textFileAccessor.AddTextFile(request.File);

                var ticket = await _context.Tickets.SingleOrDefaultAsync(x => x.Id == request.Id);
                if (ticket == null)
                    return null;

                var text = new Text
                {
                    Url = textFileUploadResult.Url,
                    Id = textFileUploadResult.PublicId,
                    Name = textFileUploadResult.Name
                };


                ticket.Texts.Add(text);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Text>.Failure("Failed to add text file.");

                return Result<Text>.Success(text);
            }
        }
    }
}