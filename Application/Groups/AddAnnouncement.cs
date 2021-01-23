using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
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
        public class Command : IRequest<AnnouncementDto>
        {
            public string Body { get; set; }
            public Guid Id { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, AnnouncementDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<AnnouncementDto> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get Group
                var group = await _context.Groups.FindAsync(request.Id);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Group = "Not Found" });

                // Get user
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var announcement = new Announcement
                {
                    Author = user,
                    Group = group,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                group.Announcements.Add(announcement);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<AnnouncementDto>(announcement); ;

                throw new Exception("Problem saving changes ");
            }
        }
    }
}