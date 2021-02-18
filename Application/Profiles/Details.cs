using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {

            private readonly IProfileReader _profileReader;

            public Handler(IProfileReader profileReader)
            {
                _profileReader = profileReader;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var mappedProfile = await _profileReader.ReadProfile(request.Username);
                return Result<Profile>.Success(mappedProfile);
            }
        }
    }
}