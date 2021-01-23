import React, { useContext, useEffect, useState } from 'react';
import {
  Divider,
  Dropdown,
  Grid,
  Header,
  List,
  Segment,
  Image,
} from 'semantic-ui-react';
import TicketDetails from '../Details/TicketDetails';
import TicketForm from '../Form/TicketForm';

import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import StatusStats from './StatusStats';
import SearchList from './SearchList';
import { arrayContains } from '../../utils/helperMethods';
import { RootStoreContext } from '../../../app/stores/rootStore';

const tagOptions = [
  {
    key: 'Open',
    text: 'Open',
    value: 'Open',
    icon: { color: 'blue', name: 'circle' },
  },
  {
    key: 'verify',
    text: 'Ready for verification',
    value: 'verify',
    icon: { color: 'green', name: 'circle' },
  },
  {
    key: 'Closed',
    text: 'Closed',
    value: 'Closed',
    icon: { color: 'red', name: 'circle' },
  },
];

const TicketList = () => {
  const { ticketStore, groupStore } = useContext(RootStoreContext);

  const [filterStatus, setFilterStatus] = useState('open');
  const [filterGroup, setGroupFilter] = useState('');
  const [searchResultIds, setSearchResultIds] = useState<string[]>([]);
  useEffect(() => {
    ticketStore.loadTickets();
    groupStore.loadGroups();
  }, [ticketStore, groupStore]);

  const handleStatusClick = (e: any, data: any) => {
    const statusValue = data.value.toLowerCase();

    if (data.placeholder === 'Filter By Group') {
      setGroupFilter(statusValue);
    } else {
      setFilterStatus(statusValue);
    }
    // Now filter list items shown on data.value for status
  };

  const handleSearchResults = (ticketIds: string[]) => {
    setSearchResultIds(ticketIds);
  };

  if (ticketStore.loadingTickets)
    return <LoadingComponent content='Loading Tickets' />;

  return (
    <Segment clearing>
      <Header textAlign='center'>Issues</Header>

      <Grid columns={4} divided stackable>
        <Grid.Row>
          <Grid.Column>
            <Dropdown
              placeholder='Filter By Group'
              fluid
              selection
              options={groupStore.groupTitles}
              onChange={handleStatusClick}
            ></Dropdown>
          </Grid.Column>
          <Grid.Column>
            <Dropdown
              placeholder='Filter By Ticket Status'
              fluid
              selection
              options={tagOptions}
              onChange={handleStatusClick}
            />
          </Grid.Column>
          <Grid.Column>
            <StatusStats groupId={filterGroup} />
          </Grid.Column>
          <Grid.Column>
            <SearchList
              titleList={ticketStore.ticketsByDate.filter(
                (ticket) =>
                  ticket.status.toLowerCase() === filterStatus && ticket
              )}
              handleSearchResults={handleSearchResults}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Divider />
      <List divided relaxed>
        {ticketStore.ticketsByDate.map((ticket) => {
          return (
            // This filtering could be made more concise and prettier
            ticket.status.toLowerCase() === filterStatus &&
            ticket.groupId === filterGroup &&
            (arrayContains(searchResultIds, ticket.id) ||
              searchResultIds.length === 0) && (
              <List.Item key={ticket.id}>
                <Image avatar src={ticket.image || '/assets/user.png'} />
                <List.Content>
                  <List.Header as='a'>{ticket.title}</List.Header>
                  <List.Description as='a'>
                    {ticket.date.replace('T', ' ')}
                  </List.Description>
                </List.Content>
                <TicketDetails ticket={ticket} />

                <TicketForm ticket={ticket} />
              </List.Item>
            )
          );
        })}
      </List>
    </Segment>
  );
};

export default observer(TicketList);
