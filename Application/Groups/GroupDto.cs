using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.Comments;
using Application.Tickets;
using Domain;

namespace Application.Groups
{
    public class GroupDto
    {
        public Guid Id { get; set; }
        public string GroupName { get; set; }
        // This causes object cycle
        public ICollection<TicketDto> Tickets { get; set; }

        public bool IsPublic { get; set; }
        public string Description { get; set; }
        public int Open { get; set; }
        public int Closed { get; set; }
        public int Verify { get; set; }
        public DateTime CreatedAt { get; set; }
        [JsonPropertyName("members")]
        public ICollection<MemberDto> UserGroups { get; set; }
        public ICollection<CommentDto> Comments { get; set; }
        public ICollection<AnnouncementDto> Announcements { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}