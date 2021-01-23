using System;

namespace Application.Profiles
{
    public class UserGroupDto
    {
        public Guid Id { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }
}