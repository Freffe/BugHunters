using System;
using System.Threading.Tasks;
using Application.Core;
using Application.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(Login.Query query)
        {
            var user = await Mediator.Send(query);
            if (user != null && user.IsSuccess)
                setTokenCookie(user.Value.RefreshToken);
            return HandleResult(user);
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(Register.Command command)
        {
            //command.Origin = Request.Headers["origin"];
            return HandleResult(await Mediator.Send(command));
            //return Ok("Registration successful - please check your email");
        }
        [HttpGet]
        public async Task<IActionResult> CurrentUser()
        {
            var user = await Mediator.Send(new CurrentUser.Query());
            if (user.IsSuccess)
                setTokenCookie(user.Value.RefreshToken);
            return HandleResult(user);
        }

        [HttpDelete("delete/{user}")]
        public async Task<IActionResult> Delete(string user)
        {
            Console.WriteLine($"{user}");
            return HandleResult(await Mediator.Send(new Delete.Command { User = user }));
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken(Application.User.RefreshToken.Command command)
        {
            command.RefreshToken = Request.Cookies["refreshToken"];
            var user = await Mediator.Send(command);
            if (user.IsSuccess)
                setTokenCookie(user.Value.RefreshToken);
            return HandleResult(user);
        }
        private void setTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}