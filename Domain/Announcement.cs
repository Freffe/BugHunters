using System;

namespace Domain
{
    public class Announcement
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        // Virtual for lazy loading
        public virtual AppUser Author { get; set; }
        public virtual Group Group { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}