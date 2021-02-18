using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<Result<User>>
        {

            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, Result<User>>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
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

            public async Task<Result<User>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(request.Email);
                    if (user == null)
                        return null;
                    var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                    if (result.Succeeded)
                    {

                        var refreshToken = _jwtGenerator.GenerateRefreshToken();
                        user.RefreshTokens.Add(refreshToken);
                        await _userManager.UpdateAsync(user);

                        return Result<User>.Success(new User(user, _jwtGenerator, refreshToken.Token));
                    }
                    return Result<User>.Failure("Failed to login that user.");
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Catched error in login: {e}");
                    return null;
                }
                /*
                if (!user.EmailConfirmed)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email is not confirmed" });
                }
                */
            }
        }
    }
}