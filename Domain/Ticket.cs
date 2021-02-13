using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain
{
    public class Ticket
    {
        // Guid to allow creation of ID from both client side and server side.
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        //public Bounty Bounty {get; set;}
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Text> Texts { get; set; }
        public string Status { get; set; }
        public string BugType { get; set; }
        public string Device { get; set; }
        public string Version { get; set; }
        public string Priority { get; set; }
        // Is this absolutely necessary to be able to get group Detail?
        // The ticket.GroupId causes object cycle?!?
        [JsonIgnore]
        public virtual string TicketOwnerId { get; set; }
        // Is this absolutely necessary to be able to get group Detail?
        // The ticket.GroupId causes object cycle?!?
        [JsonIgnore]
        public string Creator { get; set; }
        [JsonIgnore]
        public virtual Guid? GroupId { get; set; }



    }
}