using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
using Application.Core;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Groups
{
    public class AddAnnouncement
    {
        public class Command : IRequest<Result<AnnouncementDto>>
        {
            public string Body { get; set; }
            public Guid Id { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<AnnouncementDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<AnnouncementDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var group = await _context.Groups.FindAsync(request.Id);
                if (group == null)
                    return null;

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                if (user == null)
                    return null;

                var announcement = new Announcement
                {
                    Author = user,
                    Group = group,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                group.Announcements.Add(announcement);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<AnnouncementDto>.Failure("Failed to add announcement.");

                var mappedAnnouncement = _mapper.Map<AnnouncementDto>(announcement); ;
                return Result<AnnouncementDto>.Success(mappedAnnouncement);

            }
        }
    }
}