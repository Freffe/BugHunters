using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.Comments;
using Domain;

namespace Application.Tickets
{
    public class TicketDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        //public Bounty Bounty {get; set;}

        public ICollection<CommentDto> Comments { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<Text> Texts { get; set; }
        public string Status { get; set; }
        public string BugType { get; set; }
        public string Device { get; set; }
        public string Version { get; set; }
        public string Priority { get; set; }
        // Is this absolutely necessary to be able to get group Detail?
        // The ticket.GroupId causes object cycle?!?
        [JsonIgnore]
        public string TicketOwnerId { get; set; }
        public string Creator { get; set; }
        public Guid? GroupId { get; set; }
    }
}