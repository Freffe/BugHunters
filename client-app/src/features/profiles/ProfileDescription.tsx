import React, { useContext, useState } from 'react';
import { Button, Grid, Header, Image, Item } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileAbout from './ProfileAbout';

const ProfileDescription: React.FC<{
  description: string;
  displayName: string;
  userImage?: string;
}> = ({ description, displayName, userImage }) => {
  const rootStore = useContext(RootStoreContext);
  const { isCurrentUser, editProfile, profile } = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);

  return (
    <Grid>
      <Grid.Column width={16}>
        <Header size='huge' style={{ color: 'white' }}>
          <Image fluid rounded src={userImage || '/assets/user.png'} />
          <Header.Content attached='top'>{displayName}</Header.Content>

          {isCurrentUser && (
            <Button
              floated='right'
              style={{ color: 'white', backgroundColor: '#bc4123' }}
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Header>
        <Item.Description floated='right' style={{ color: 'white' }}>
          {editMode ? (
            <ProfileAbout
              editProfile={editProfile}
              profile={profile!}
              setEditMode={setEditMode}
            />
          ) : (
            <span>{profile!.bio}</span>
          )}
        </Item.Description>
      </Grid.Column>
    </Grid>
  );
};

export default ProfileDescription;
