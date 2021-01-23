using System;
using System.Threading.Tasks;
using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseController
    {
        [HttpPost]
        public async Task<ActionResult<Photo>> Add([FromForm] Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(string id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/setmain")]
        public async Task<ActionResult<Unit>> SetMain(string id)
        {
            return await Mediator.Send(new SetMain.Command { Id = id });
        }


        [HttpPost("groups/{id}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<Photo>> AddGroupPhoto(Guid id, [FromForm] AddGroupPhoto.Command command)
        {
            Console.WriteLine("Inside route of addGroupPhoto");
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("groups/{id}/{pid}")]
        [Authorize(Policy = "IsHostOrAdmin")]
        public async Task<ActionResult<Unit>> DeleteGroupPhoto(Guid id, string pid)
        {
            return await Mediator.Send(new DeleteGroupPhoto.Command { GroupId = id, Id = pid });
        }

        // Policy for ticket Owner Id ?
        [HttpPost("tickets/{id}")]
        public async Task<ActionResult<Photo>> AddTicketPhoto(Guid id, [FromForm] AddTicketPhoto.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        // Policy for ticket Owner Id ?
        [HttpDelete("tickets/{id}/{pid}")]
        public async Task<ActionResult<Unit>> DeleteTicketPhoto(Guid id, string pid)
        {
            return await Mediator.Send(new DeleteTicketPhoto.Command { TicketId = id, Id = pid });
        }
    }
}