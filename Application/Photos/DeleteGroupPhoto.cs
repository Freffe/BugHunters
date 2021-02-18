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
    public class DeleteGroupPhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid GroupId { get; set; }
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
                // handler logic
                var group = await _context.Groups.SingleOrDefaultAsync(x => x.Id == request.GroupId);
                if (group == null)
                    return null;

                var photo = group.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photo == null)
                    return null;

                //if (photo.IsMain)
                //   throw new RestException(HttpStatusCode.BadRequest, new { Photo = "You cannot delete your main photo" });

                var result = _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                    return null;

                group.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed to delete photo.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}