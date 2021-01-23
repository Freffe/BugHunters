using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
using Application.Errors;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tickets
{
    public class AddComment
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid Id { get; set; }
            public string Username { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get Ticket
                var ticket = await _context.Tickets.FindAsync(request.Id);
                if (ticket == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Ticket = "Not Found" });

                // Get group
                var group = await _context.Groups.FindAsync(ticket.GroupId);
                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Group = "Not Found" });

                // Get user
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Group = group,
                    TicketId = ticket.Id,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                ticket.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommentDto>(comment); ;

                throw new Exception("Problem saving changes ");
            }
        }
    }
}