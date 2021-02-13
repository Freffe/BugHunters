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
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import StatusStats from './StatusStats';
import SearchList from './SearchList';
import { arrayContains } from '../../utils/helperMethods';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Link } from 'react-router-dom';
import { IMember } from '../../../app/models/groups';

const tagOptions = [
  {
    key: 'open',
    text: 'Open',
    value: 'open',
    icon: { color: 'blue', name: 'circle' },
  },
  {
    key: 'verify',
    text: 'Ready for verification',
    value: 'verify',
    icon: { color: 'green', name: 'circle' },
  },
  {
    key: 'closed',
    text: 'Closed',
    value: 'closed',
    icon: { color: 'red', name: 'circle' },
  },
];

const TicketList = () => {
  const { ticketStore, groupStore } = useContext(RootStoreContext);
  const { setSelectedTicket } = ticketStore;
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGroup, setGroupFilter] = useState('');
  const [searchResultIds, setSearchResultIds] = useState<string[]>([]);
  useEffect(() => {
    ticketStore.loadTickets();
    groupStore.loadGroups();
  }, [ticketStore, groupStore, setGroupFilter]);

  const groupMemberPhoto = (groupId: string, username: string) => {
    if (username && groupId) {
      const members = groupStore.groupRegistry.get(groupId).members;
      const isFound = members.filter(
        (member: IMember) => member.username === username
      );

      if (isFound && isFound[0]) {
        return isFound[0].image;
      }
    }
    return '/assets/user.png';
  };

  const handleStatusClick = (e: any, data: any) => {
    if (data.value === '') return;
    const statusValue = data.value.toLowerCase();

    if (data.placeholder === 'Filter By Group') {
      setGroupFilter(statusValue);
      setFilterStatus('');
    } else {
      setFilterStatus(statusValue);
    }
    // Now filter list items shown on data.value for status
  };

  const handleSearchResults = (ticketIds: string[]) => {
    setSearchResultIds(ticketIds);
  };

  if (ticketStore.loadingTickets)
    return <LoadingComponent content='Loading Tickets...' />;

  return (
    <Segment clearing>
      <Header textAlign='center' style={{ color: 'white' }}>
        Issues
      </Header>

      <Grid columns={4} divided stackable>
        <Grid.Row>
          <Grid.Column>
            <Dropdown
              placeholder='Filter By Group'
              fluid
              selection
              options={groupStore.groupTitleForUser}
              onChange={handleStatusClick}
            ></Dropdown>
          </Grid.Column>
          <Grid.Column>
            <Dropdown
              disabled={
                filterGroup === '' ||
                (filterGroup !== '' &&
                  groupStore.groupRegistry.get(filterGroup).tickets.length <= 0)
              }
              placeholder='Filter By Ticket Status'
              fluid
              value={filterStatus}
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
                <Image
                  avatar
                  src={groupMemberPhoto(filterGroup, ticket.creator)}
                />
                <List.Content>
                  <List.Header
                    as={Link}
                    to={`/ticket/${ticket.groupId}/${ticket.id}`}
                    onClick={async () => await setSelectedTicket(ticket)}
                  >
                    {ticket.title}
                  </List.Header>
                  <List.Description style={{ color: 'white' }}>
                    {ticket.date.replace('T', ' ')}
                  </List.Description>
                </List.Content>
                {/*<TicketDetails
                  ticket={ticket}
                  isTicketCreatorOrAdmin={ticketStore.isTicketCreatorOrAdmin}
                  addTextFile={ticketStore.addTextFile}
                  
                />*/}
              </List.Item>
            )
          );
        })}
      </List>
    </Segment>
  );
};

export default observer(TicketList);
