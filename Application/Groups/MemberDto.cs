namespace Application.Groups
{
    public class MemberDto
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public bool IsHost { get; set; }
        public bool IsAdmin { get; set; }
    }
}