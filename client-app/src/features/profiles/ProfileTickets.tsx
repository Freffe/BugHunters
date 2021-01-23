import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { List, Segment, Image } from 'semantic-ui-react';
import StatusCircle from '../../app/common/stylings/StatusCircle';

import { RootStoreContext } from '../../app/stores/rootStore';

const ProfileTickets = () => {
  const { profileStore, ticketStore } = useContext(RootStoreContext);
  const { profile } = profileStore;
  const { setSelectedTicket } = ticketStore;

  return (
    <Segment clearing>
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
                  to={`/ticket/${profile!.username}/${ticket.id}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  {ticket.title}
                </List.Header>
                <List.Description as='a'>
                  {ticket.date.replace('T', ' ')}
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
