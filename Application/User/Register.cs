using System;
using System.Collections.Generic;
using System.Linq;
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
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<Result<User>>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Origin { get; set; }
            public DateTime DateJoined { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }
        public class Handler : IRequestHandler<Command, Result<User>>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _context = context;
                _userManager = userManager;
            }
            public async Task<Result<User>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Is username or email in use?
                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    return Result<User>.Failure("A user with that email already exist.");

                if (await _context.Users.AnyAsync(x => x.UserName == request.Username))
                    return Result<User>.Failure("A user with that name already exist.");

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username,
                    DateJoined = request.DateJoined
                };

                var refreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokens.Add(refreshToken);
                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    //throw new Exception("Problem creating user");
                    return Result<User>.Success(new User(user, _jwtGenerator, refreshToken.Token));
                }
                return Result<User>.Failure("Problem creating user.");
                // Create a token that we can send to the user
                //var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                // Convert token into querystring format as to avoid having the browser interact with this
                //token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                // Set up verification email
                //var verifyUrl = $"{request.Origin}/user/verifyEmail?token={token}&email={request.Email}";

                //var message = $"<p>Please click the link below to verify your email adress:</p><p><a href='{verifyUrl}'>{verifyUrl}</a></p>";

                //await _emailSender.SendEmailAsync(request.Email, "Please verify email adress", message);
                //return Unit.Value;
            }
        }
    }
}