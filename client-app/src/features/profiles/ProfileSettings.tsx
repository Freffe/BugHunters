import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Grid, Modal, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

const ProfileSettings = () => {
  const { profileStore, userStore } = useStore();
  const { profile } = profileStore;
  const { deleteAccount, isDeletingUser } = userStore;

  const [isOpen, setIsOpen] = useState(false);

  const deleteUser = async (user: string) => {
    console.log('Delete: ', user);
    await deleteAccount(user);
  };

  return (
    <Segment
      style={{
        backgroundColor: 'rgb(7, 20, 38)',
        borderBottom: '2px solid #bc4123',
        border: '2px solid #bc4123',
      }}
    >
      <Grid>
        <Grid.Row
          style={{
            padding: '14px',
            margin: '0px',
          }}
          floated='left'
        >
          <p
            style={{
              marginRight: '10px',
              paddingTop: '7px',
              textAlign: 'center',
              color: 'white',
            }}
          >
            Permanently remove your account from Bug Hunters
          </p>
          <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            size='mini'
            trigger={
              <Button
                floated='right'
                style={{
                  backgroundColor: '#bc4123',
                  borderBottom: '2px solid #bc4123',
                  color: 'white',
                }}
              >
                Delete Account
              </Button>
            }
          >
            <Modal.Header>Delete Your Account</Modal.Header>
            <Modal.Content>
              Are you sure you want to delete your account?
            </Modal.Content>
            <Modal.Actions>
              <Button
                loading={isDeletingUser}
                positive
                onClick={() => deleteUser(profile!.username)}
              >
                Yes
              </Button>
              <Button primitive='true' onClick={() => setIsOpen(false)}>
                No
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileSettings);
