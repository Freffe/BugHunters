import React, { useContext, useState } from 'react';
import { Button, Grid, Header, Image, Item } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileAbout from './ProfileAbout';

const ProfileDescription: React.FC<{
  description: string;
  displayName: string;
  userImage?: string;
}> = ({ description, displayName, userImage }) => {
  const { profileStore } = useStore();
  const { isCurrentUser, editProfile, profile } = profileStore;
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
