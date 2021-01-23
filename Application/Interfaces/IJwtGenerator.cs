using Domain;
namespace Application.Interfaces
{
    // We need this interface to make the infrastructure jwtGenerator available to our application
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
        RefreshToken GenerateRefreshToken();
    }
}
