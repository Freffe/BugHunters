
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Domain
{
    public class Group
    {

        public Guid Id { get; set; }
        public string GroupName { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
        // Join table UserGroup for m -> m relationship with AppUser.
        [JsonIgnore]
        public virtual ICollection<UserGroup> UserGroups { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Announcement> Announcements { get; set; }

        public virtual ICollection<Photo> Photos { get; set; }
        public bool IsPublic { get; set; }
        public string Description { get; set; }
        public int Open { get; set; }
        public int Closed { get; set; }
        public int Verify { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}