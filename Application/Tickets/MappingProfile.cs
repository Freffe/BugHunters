using Domain;
using AutoMapper;

namespace Application.Tickets
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Ticket, TicketDto>();

        }
    }
}