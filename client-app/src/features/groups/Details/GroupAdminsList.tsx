import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Image, List, Popup, Dropdown, Button } from 'semantic-ui-react';
import { IMember } from '../../../app/models/groups';

import { useStore } from '../../../app/stores/store';

interface IProps {
  members: IMember[];
  admins: IMember[];
  isHostOrAdmin: boolean;
}

const styles = {
  borderColor: 'orange',
  borderWidth: 2,
};

const getOptions = (members: any) => {
  return members.map((member: IMember) => ({
    key: member.username,
    text: member.displayName,
    value: member.username,
    image: { avatar: true, src: member.image || '/assets/user.png' },
  }));
};

const GroupAdminsList: React.FC<IProps> = ({
  admins,
  members,
  isHostOrAdmin,
}) => {
  const { groupStore } = useStore();
  const { isPromotingMember, selectedGroupId, addAdmin } = groupStore;
  const [promotedMember, setPromotedMember] = useState('');

  const handleAdminDropdown = (e: any, data: any) => {
    const statusValue = data.value.toLowerCase();

    if (data.placeholder === 'Promote') {
      if (statusValue) setPromotedMember(statusValue);
    }
    if (!statusValue) {
      setPromotedMember('');
    }
  };

  return (
    <div>
      <List
        horizontal
        relaxed='very'
        floated='left'
        style={{ marginLeft: '14px' }}
      >
        <List.Item>
          <b>Admins </b>{' '}
        </List.Item>
        {admins.map((member) => (
          <List.Item key={member.username}>
            <Popup
              header={member.displayName}
              trigger={
                <Image
                  bordered
                  style={member.isHost ? styles : null}
                  size='mini'
                  circular
                  src={member.image || '/assets/user.png'}
                />
              }
            />
          </List.Item>
        ))}
      </List>
      {isHostOrAdmin && (
        <List horizontal floated='right'>
          <List.Item style={{ maxHeight: '32px' }}>
            <Dropdown
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                minWidth: '10em',
              }}
              clearable
              labeled
              selection
              placeholder='Promote'
              options={getOptions(members)}
              onChange={handleAdminDropdown}
            />
            <Button
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: '38px',
                paddingTop: '0px',
                paddingBottom: '0px',
                marginBottom: '3px',
                marginRight: '9px',
              }}
              loading={isPromotingMember}
              disabled={promotedMember === ''}
              size='medium'
              positive
              icon='add'
              onClick={() =>
                promotedMember && addAdmin(selectedGroupId, promotedMember)
              }
            />
          </List.Item>
        </List>
      )}
    </div>
  );
};

export default observer(GroupAdminsList);
