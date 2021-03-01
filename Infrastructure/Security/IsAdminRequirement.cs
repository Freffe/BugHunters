using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsAdminRequirement : IAuthorizationRequirement
    {
    }

    public class IsAdminRequirementHandler : AuthorizationHandler<IsAdminRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsAdminRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsAdminRequirement requirement)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext.Request.RouteValues.ContainsKey("id"))
            {
                // Get user and group to establish 
                var currentUserName = httpContext.User?.Claims?
                    .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

                var groupId = Guid.Parse(httpContext.Request.RouteValues["id"].ToString());

                var group = _context.Groups.FindAsync(groupId).Result;


                // Or is the user an admin of this grp?
                var usersMembership = group.UserGroups?.FirstOrDefault(x => x.AppUser.UserName == currentUserName);

                if (usersMembership.IsHost || usersMembership.IsAdmin)
                    context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}