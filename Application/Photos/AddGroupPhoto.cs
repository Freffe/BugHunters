using System;
using System.Linq;
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

namespace Application.Photos
{
    public class AddGroupPhoto
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                var photoUploadResult = _photoAccessor.AddPhoto(request.File);
                Console.WriteLine("Inside handler of addGroupPhoto");
                var group = await _context.Groups.SingleOrDefaultAsync(x => x.Id == request.Id);
                if (group == null)
                    return null;

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!group.Photos.Any(x => x.IsMain))
                    photo.IsMain = true;

                group.Photos.Add(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Photo>.Failure("Failed adding photo.");

                return Result<Photo>.Success(photo);
            }
        }
    }
}