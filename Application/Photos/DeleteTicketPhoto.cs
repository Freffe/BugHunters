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

namespace Application.Photos
{
    public class DeleteTicketPhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid TicketId { get; set; }
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var ticket = await _context.Tickets.SingleOrDefaultAsync(x => x.Id == request.TicketId);
                if (ticket == null)
                    return null;

                var photo = ticket.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photo == null)
                    return null;

                var result = _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                    return null;

                ticket.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed deleting photo.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}