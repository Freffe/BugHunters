using System;

namespace Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        // Virtual for lazy loading
        public virtual AppUser Author { get; set; }
        public virtual Group Group { get; set; }
        public virtual Guid? TicketId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}