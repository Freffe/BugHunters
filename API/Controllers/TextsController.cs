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
        public async Task<IActionResult> Text(Guid id, [FromForm] AddTicketTextFile.Command command)
        {
            command.Id = id;
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("tickets/{ticketId}/{textId}")]
        public async Task<IActionResult> Text(Guid ticketId, string textId, [FromForm] DelTicketTextFile.Command command)
        {

            return HandleResult(await Mediator.Send(new DelTicketTextFile.Command { Id = textId, TicketId = ticketId }));
        }
    }
}