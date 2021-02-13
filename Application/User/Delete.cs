using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
namespace Application.User
{
    public class Delete
    {
        public class Command : IRequest<Unit>
        {

            public string User { get; set; }
        }

        public class QueryValidator : AbstractValidator<Command>
        {
            public QueryValidator()
            {
                RuleFor(x => x.User).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IUserAccessor userAccessor, DataContext context)
            {
                _userAccessor = userAccessor;
                _context = context;
                _signInManager = signInManager;
                _userManager = userManager;

                if (userManager is null)
                {
                    throw new System.ArgumentNullException(nameof(userManager));
                }

                if (signInManager is null)
                {
                    throw new System.ArgumentNullException(nameof(signInManager));
                }
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Handler logic
                // Bob@test.com will crash, 2 users with same mail.

                var user = await _userManager.FindByNameAsync(request.User);
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }
                var result = await _context.Users.AnyAsync(x => x.UserName == request.User);

                var currentUser = _userAccessor.GetCurrentUsername();


                if (result && currentUser == request.User)
                {
                    // Get Comments
                    var coms = await _context.Comments.Where(x => x.Author.UserName == request.User).ToListAsync();
                    _context.Comments.RemoveRange(coms);
                    await _context.SaveChangesAsync();


                    user.RefreshTokens.Clear();
                    //await _context.SaveChangesAsync();
                    // remove that comment
                    var res = await _userManager.DeleteAsync(user);

                    //_context.Users.Remove(user);
                    if (res.Succeeded) return Unit.Value;
                }

                throw new RestException(HttpStatusCode.BadRequest);
            }
        }


    }
}