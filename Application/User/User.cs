using System;
using System.Linq;
using System.Text.Json.Serialization;
using Application.Interfaces;
using Domain;

namespace Application.User
{
    // Returned to the client. 
    // Since we inherit from the IdentityUser we wanna return slightly less data.
    public class User
    {
        public User(AppUser user, IJwtGenerator jwtGenerator, string refreshToken)
        {
            DisplayName = user.DisplayName;
            Token = jwtGenerator.CreateToken(user);
            Username = user.UserName;
            Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url;
            RefreshToken = refreshToken;
            DateJoined = user.DateJoined;
        }
        public DateTime DateJoined { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}