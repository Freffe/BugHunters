using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Groups
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string GroupName { get; set; }
            public string Description { get; set; }
            public DateTime? CreatedAt { get; set; }

            public int Open { get; set; }
            public int Closed { get; set; }
            public int Verify { get; set; }
            public bool IsPublic { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.GroupName).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.IsPublic).NotEmpty();
                RuleFor(x => x.CreatedAt).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var group = await _context.Groups.FindAsync(request.Id);

                if (group == null)
                    throw new RestException(HttpStatusCode.NotFound, new { group = "Not found" });

                group.GroupName = request.GroupName ?? group.GroupName;
                group.Description = request.Description ?? group.Description;
                group.CreatedAt = request.CreatedAt ?? group.CreatedAt;
                group.IsPublic = request.IsPublic;
                group.Verify = request.Verify;
                group.Closed = request.Closed;
                group.Open = request.Open;


                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes Edit");
            }
        }
    }
}