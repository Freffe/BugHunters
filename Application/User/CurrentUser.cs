using MediatR;
using Persistence;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Identity;
using Domain;
using Application.Interfaces;
using System.Linq;
using Application.Core;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<Result<User>> { }

        public class Handler : IRequestHandler<Query, Result<User>>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccessor _userAccessor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
            }

            public async Task<Result<User>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Get user from DB
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
                var refreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokens.Add(refreshToken);
                await _userManager.UpdateAsync(user);
                return Result<User>.Success(new User(user, _jwtGenerator, refreshToken.Token));
            }
        }
    }
}