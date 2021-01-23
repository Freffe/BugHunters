using System;

namespace Domain
{
    public class UserGroup
    {
        // Join table for the many many rel. user -> userGroup -> Group

        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid GroupId { get; set; }
        public virtual Group Group { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }

        public bool IsAdmin { get; set; }

    }
}