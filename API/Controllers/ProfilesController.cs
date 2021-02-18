using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }
        [HttpPut]
        public async Task<IActionResult> Edit(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/groups")]
        public async Task<IActionResult> GetUserGroups(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListGroups.Query { Username = username, Predicate = predicate }));
        }
    }
}