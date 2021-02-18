import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, Item, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useStore } from '../../app/stores/store';
import ProfileContent from './ProfileContent';
import ProfileDescription from './ProfileDescription';

interface RouteParams {
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const Profile: React.FC<IProps> = ({ match }) => {
  const { profileStore, groupStore } = useStore();
  const { loadingProfile, profile, loadProfile } = profileStore;
  const { loadGroups, loadingGroups } = groupStore;

  useEffect(() => {
    console.log('One');
    async function loadstuff() {
      await loadProfile(match.params.username);
      await loadGroups();
    }
    loadstuff();
  }, [loadProfile, match, loadGroups]);

  if (loadingProfile || loadingGroups)
    return <LoadingComponent content='Loading profile...' />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment
          style={{
            backgroundColor: 'rgb(7, 20, 38)',
            borderBottom: '2px solid #bc4123',
            border: '2px solid #bc4123',
          }}
        >
          <Item.Group>
            <Item>
              <Item.Content verticalAlign='top'>
                <ProfileDescription
                  userImage={profile!.image}
                  displayName={profile!.displayName}
                  description={profile!.bio}
                />
              </Item.Content>
            </Item>
            <Item>
              <Item.Content verticalAlign='top'>
                <ProfileContent />
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(Profile);
