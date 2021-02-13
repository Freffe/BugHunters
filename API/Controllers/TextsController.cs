using System;
using System.Threading.Tasks;
using Application.TextFiles;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TextsController : BaseController
    {

        [HttpPost("tickets/{id}")]
        public async Task<ActionResult<Text>> Text(Guid id, [FromForm] AddTicketTextFile.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("tickets/{ticketId}/{textId}")]
        public async Task<ActionResult<Unit>> Text(Guid ticketId, string textId, [FromForm] DelTicketTextFile.Command command)
        {

            return await Mediator.Send(new DelTicketTextFile.Command { Id = textId, TicketId = ticketId });
        }
    }
}