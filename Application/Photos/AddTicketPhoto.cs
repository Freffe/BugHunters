using System;
using System.Linq;
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

namespace Application.Photos
{
    public class AddTicketPhoto
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File { get; set; }
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                var photoUploadResult = _photoAccessor.AddPhoto(request.File);

                var ticket = await _context.Tickets.SingleOrDefaultAsync(x => x.Id == request.Id);
                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Ticket = "Not found" });

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!ticket.Photos.Any(x => x.IsMain))
                    photo.IsMain = true;

                ticket.Photos.Add(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return photo;

                throw new Exception("Problem saving changes in AddTicketPhoto.cs");
            }
        }
    }
}