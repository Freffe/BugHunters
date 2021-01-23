using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Comments;
using Application.Tickets;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static Application.Tickets.Create;

namespace API.Controllers
{
    public class TicketsController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<List<TicketDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Application.Tickets.Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("withPhoto")]
        public async Task<ActionResult<Unit>> CreateWithPhoto([FromForm] Application.Tickets.Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("comment/{id}")]
        public async Task<ActionResult<CommentDto>> Comment(Guid id, AddComment.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("comment/{ticketId}/{id}")]
        public async Task<ActionResult<Unit>> Comment(Guid ticketId, Guid id)
        {
            return await Mediator.Send(new DelComment.Command { Id = id, TicketId = ticketId });
        }

        [HttpPut("comment/{ticketId}/{id}")]
        public async Task<ActionResult<Unit>> EditComment(Guid ticketId, Guid id, EditComment.Command command)
        {
            command.CommentId = id;
            command.TicketId = ticketId;
            return await Mediator.Send(command);
        }
    }
}