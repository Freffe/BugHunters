using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
            RefreshTokens = new List<RefreshToken>();
        }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public DateTime DateJoined { get; set; }
        public virtual ICollection<UserGroup> UserGroups { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }

        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}