using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
using Application.Core;
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
        public class Command : IRequest<Result<CommentDto>>
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
        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {

                var ticket = await _context.Tickets.FindAsync(request.Id);
                if (ticket == null)
                    return null;

                var group = await _context.Groups.FindAsync(ticket.GroupId);
                if (group == null)
                    return null;

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                if (user == null)
                    return null;

                var comment = new Comment
                {
                    Author = user,
                    TicketId = ticket.Id,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                ticket.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<CommentDto>.Failure("Failed to add comment.");
                var commentDto = _mapper.Map<CommentDto>(comment);

                return Result<CommentDto>.Success(commentDto);
            }
        }
    }
}