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
        public async Task<ActionResult<Unit>> Create(Application.Groups.Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<List<GroupDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GroupDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpPost("announcement/{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<AnnouncementDto>> Announcement(Guid id, AddAnnouncement.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("announcement/{id}/{aid}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<Unit>> Announcement(Guid id, Guid aid)
        {
            return await Mediator.Send(new DelAnnouncement.Command { Id = aid, GroupId = id });
        }

        [HttpPut("{id}/member")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<Unit>> EditMember(Guid Id, EditMember.Command command)
        {
            command.GroupId = Id;
            return await Mediator.Send(command);
        }

        [HttpPost("{id}/join")]
        public async Task<ActionResult<Unit>> Join(Guid id)
        {
            return await Mediator.Send(new Join.Command { Id = id });
        }

        [HttpDelete("{id}/join")]
        public async Task<ActionResult<Unit>> Leave(Guid id)
        {
            return await Mediator.Send(new Leave.Command { Id = id });
        }
    }
}