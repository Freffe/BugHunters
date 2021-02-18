using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Application.Comments;
using Application.Groups;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class GroupsController : BaseController
    {

        [HttpPost]
        public async Task<IActionResult> Create(Application.Groups.Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<IActionResult> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return HandleResult(await Mediator.Send(command));
        }

        [HttpPost("announcement/{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<IActionResult> Announcement(Guid id, AddAnnouncement.Command command)
        {
            command.Id = id;
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("announcement/{id}/{aid}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<IActionResult> Announcement(Guid id, Guid aid)
        {
            return HandleResult(await Mediator.Send(new DelAnnouncement.Command { Id = aid, GroupId = id }));
        }

        [HttpPut("{id}/member")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<IActionResult> EditMember(Guid Id, EditMember.Command command)
        {
            command.GroupId = Id;
            return HandleResult(await Mediator.Send(command));
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> Join(Guid id)
        {
            return HandleResult(await Mediator.Send(new Join.Command { Id = id }));
        }

        [HttpDelete("{id}/join")]
        public async Task<IActionResult> Leave(Guid id)
        {
            return HandleResult(await Mediator.Send(new Leave.Command { Id = id }));
        }
    }
}