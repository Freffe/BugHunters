import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { List, Segment, Image } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfileGroups = () => {
  const { groupStore } = useContext(RootStoreContext);
  const { groupTitleForUser } = groupStore;
  const isItCalling = (key: string) => {
    groupStore.setSelectedGroup(key);
  };
  return (
    <Segment clearing style={{ border: 'none' }}>
      <List divided relaxed>
        {groupTitleForUser!.map((group) => {
          return (
            <List.Item key={group.key}>
              <Image
                avatar
                src={(group.photo && group.photo!.url) || '/assets/user.png'}
              />
              <List.Content>
                <List.Header
                  as={Link}
                  to={{
                    pathname: `/groups`,
                    state: 'profileGroups',
                  }}
                  onClick={() => isItCalling(group.key)}
                >
                  {group.text}
                </List.Header>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    </Segment>
  );
};

export default observer(ProfileGroups);
