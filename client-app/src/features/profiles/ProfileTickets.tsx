import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { List, Segment, Image } from 'semantic-ui-react';
import StatusCircle from '../../app/common/stylings/StatusCircle';
import { format } from 'date-fns';
import { useStore } from '../../app/stores/store';

const ProfileTickets = () => {
  const { profileStore, ticketStore } = useStore();
  const { profile } = profileStore;
  const { setSelectedTicket } = ticketStore;

  return (
    <Segment clearing style={{ border: 'none' }}>
      <List divided relaxed>
        {profile!.tickets.map((ticket) => {
          return (
            <List.Item key={ticket.id}>
              <Image>
                <StatusCircle status={ticket.status} isFilled={true} />
              </Image>

              <List.Content>
                <List.Header
                  as={Link}
                  to={`/ticket/${ticket.groupId}/${ticket.id}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  {ticket.title}
                </List.Header>
                <List.Description as='a' style={{ color: 'white' }}>
                  {format(new Date(ticket.date), 'eeee do MMMM')}
                </List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    </Segment>
  );
};

export default observer(ProfileTickets);
