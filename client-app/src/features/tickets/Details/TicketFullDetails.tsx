import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { List, Segment, Image, Divider, Header } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import TicketAddComment from './TicketAddComment';
import TicketComment from './TicketComment';
import TicketDetails from './TicketDetails';

interface RouteParams {
  id: string;
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const TicketFullDetails: React.FC<IProps> = ({ match }) => {
  const { profileStore, ticketStore, userStore } = useContext(RootStoreContext);
  const { loadProfile, loadingProfile, profile } = profileStore;
  const { user } = userStore;
  const {
    isAddingComment,
    addComment,
    deleteComment,
    editComment,
    setSelectedTicketFromId,
    isEditingComment,
    selectedTicket,
    isDeletingComment,
  } = ticketStore;
  useEffect(() => {
    if (selectedTicket === null) {
      setSelectedTicketFromId(match.params.id);
    }
    if (profile === null) {
      loadProfile(match.params.username);
    }
  }, [
    loadProfile,
    profile,
    match.params,
    selectedTicket,
    setSelectedTicketFromId,
  ]);

  if (loadingProfile)
    return <LoadingComponent content='Loading profile tickets...' />;
  return (
    <Segment clearing>
      <List divided relaxed>
        {selectedTicket?.id === match.params.id && (
          <List.Item key={selectedTicket.id}>
            <Image avatar src={profile?.image || '/assets/user.png'} />
            <List.Content>
              <List.Header as='a'>{selectedTicket.title}</List.Header>
              <List.Description as='a'>
                {selectedTicket.date.replace('T', ' ')}
              </List.Description>
            </List.Content>
            <TicketDetails ticket={selectedTicket} />
          </List.Item>
        )}
      </List>
      <Divider />
      {/* TODO: You know you could just set the selected ticket in mobx right? */}
      {selectedTicket?.id === match.params.id && (
        <div
          key={selectedTicket.id}
          style={{ marginLeft: '14px', marginRight: '14px' }}
        >
          <Header style={{ textAlign: 'center' }}>Comments</Header>
          <TicketComment
            key={selectedTicket.id}
            comments={selectedTicket.comments}
            deleteComment={deleteComment}
            editComment={editComment}
            user={user}
            ticketId={selectedTicket.id}
            isEditingComment={isEditingComment}
            isDeletingComment={isDeletingComment}
          />
        </div>
      )}
      <TicketAddComment
        ticket={selectedTicket!}
        isAddingComment={isAddingComment}
        addComment={addComment}
        profile={profile!}
      />
    </Segment>
  );
};

export default observer(TicketFullDetails);
