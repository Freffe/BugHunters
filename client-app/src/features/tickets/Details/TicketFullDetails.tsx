import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  List,
  Segment,
  Image,
  Divider,
  Header,
  Button,
  Modal,
  Container,
} from 'semantic-ui-react';
import StatusCircle from '../../../app/common/stylings/StatusCircle';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { ITicket } from '../../../app/models/tickets';
import { useStore } from '../../../app/stores/store';
import TicketForm from '../Form/TicketForm';
import TicketAddComment from './TicketAddComment';
import TicketComment from './TicketComment';
import TicketDetails from './TicketDetails';

interface RouteParams {
  id: string;
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const TicketFullDetails: React.FC<IProps> = ({ match }) => {
  const { profileStore, ticketStore, userStore } = useStore();
  const { loadProfile, loadingProfile, profile } = profileStore;
  const { user } = userStore;
  const {
    isAddingComment,
    addComment,
    deleteComment,
    editComment,
    editTicketStatus,
    submittingTicket,
    setSelectedTicketFromId,
    isEditingComment,
    selectedTicket,
    isDeletingComment,
    isTicketCreatorOrAdmin,
    addTextFile,
    addPhoto,
    isAddingText,
    isAddingPhoto,
  } = ticketStore;

  const [selectedStatusColor, setSelectedStatusColor] = useState('');
  const [isEditingTicket, setIsEditingTicket] = useState(false);

  useEffect(() => {
    console.log('Hooks changed');
    if (selectedTicket === null && match.params.id) {
      setSelectedTicketFromId(match.params.id);
    }
    if (
      (profile === null && selectedTicket!) ||
      (selectedTicket! &&
        profile!.username !== selectedTicket!.creator &&
        selectedTicket !== null)
    ) {
      loadProfile(selectedTicket!.creator);
    }
  }, [
    loadProfile,
    profile,
    match.params,
    selectedTicket,
    setSelectedTicketFromId,
  ]);

  const handleStatusChange = async (data: any) => {
    const outerButton = data.value?.toLowerCase();
    const innerSpan = data.style.color;
    const editingTicket: ITicket = toJS(selectedTicket!);
    if (outerButton === 'closed' || innerSpan === 'red') {
      editingTicket.status = 'closed';
    }
    if (outerButton === 'verify' || innerSpan === 'green') {
      editingTicket.status = 'verify';
    }
    if (outerButton === 'open' || innerSpan === 'blue') {
      editingTicket.status = 'open';
    }
    setSelectedStatusColor(editingTicket.status);
    await editTicketStatus(editingTicket);
  };

  if (loadingProfile)
    return <LoadingComponent content='Loading profile tickets...' />;
  //const selTicketDate = toJS(selectedTicket?.date);
  const ticketStatus = toJS(selectedTicket!.status).toLowerCase();
  const isTicketAdminOrHost = isTicketCreatorOrAdmin();
  return (
    <Container>
      <Segment clearing>
        <List divided relaxed>
          {selectedTicket!.id === match.params.id && (
            <List.Item key={selectedTicket!.id}>
              <List.Content>
                <List.Header style={{ color: 'white' }}>
                  <Image avatar src={profile?.image || '/assets/user.png'} />
                  {selectedTicket!.title}
                </List.Header>
                <List.Description
                  style={{ marginLeft: '32px', color: 'white' }}
                >
                  {toJS(selectedTicket!.date).replace('T', ' ')}
                  <Button.Group
                    size='mini'
                    floated='right'
                    onClick={(e: any) => {
                      handleStatusChange(e.target);
                    }}
                  >
                    <Button
                      basic
                      color='red'
                      value={'Closed'}
                      loading={
                        submittingTicket && selectedStatusColor === 'closed'
                      }
                    >
                      <StatusCircle
                        isFilled={ticketStatus === 'closed'}
                        status={'closed'}
                      />
                    </Button>
                    <Button
                      basic
                      color='green'
                      value={'Verify'}
                      loading={
                        submittingTicket && selectedStatusColor === 'verify'
                      }
                    >
                      <StatusCircle
                        isFilled={ticketStatus === 'verify'}
                        status={'verify'}
                      />
                    </Button>
                    <Button
                      basic
                      color='blue'
                      value={'Open'}
                      loading={
                        submittingTicket && selectedStatusColor === 'open'
                      }
                    >
                      <StatusCircle
                        isFilled={ticketStatus === 'open'}
                        status={'open'}
                      />
                    </Button>
                  </Button.Group>
                  {isTicketAdminOrHost && (
                    <Modal
                      onClose={() => setIsEditingTicket(false)}
                      onOpen={() => setIsEditingTicket(true)}
                      open={isEditingTicket}
                      trigger={
                        <Button
                          floated='right'
                          style={{
                            marginRight: '80px',
                            color: 'white',
                            backgroundColor: '#bc4123',
                          }}
                          size='large'
                          content='Edit Ticket'
                          onClick={() => setIsEditingTicket(true)}
                        />
                      }
                    >
                      <Modal.Content>
                        <TicketForm
                          ticket={selectedTicket}
                          setIsEditingTicket={setIsEditingTicket}
                        />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          content='close'
                          icon='cancel'
                          onClick={() => setIsEditingTicket(false)}
                        />
                      </Modal.Actions>
                    </Modal>
                  )}
                </List.Description>
              </List.Content>
              <TicketDetails
                ticket={selectedTicket!}
                isTicketCreatorOrAdmin={isTicketAdminOrHost}
                addTextFile={addTextFile}
                addPhoto={addPhoto}
                isAddingText={isAddingText}
                isAddingPhoto={isAddingPhoto}
              />
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
            <Header style={{ textAlign: 'center', color: 'white' }}>
              Comments
            </Header>
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
          user={user!}
        />
      </Segment>
    </Container>
  );
};

export default observer(TicketFullDetails);
