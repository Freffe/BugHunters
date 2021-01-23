import { group } from 'console';
import React from 'react';
import { Image, List, Popup, Dropdown } from 'semantic-ui-react';
import { IMember } from '../../../app/models/groups';

interface IProps {
  members: IMember[];
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
    image: { avatar: false, src: member.image },
  }));
};

const GroupAdminsList: React.FC<IProps> = ({ members, isHostOrAdmin }) => {
  return (
    <div>
      <List horizontal relaxed='very' floated='left'>
        <List.Item>Admins: </List.Item>
        {members.map((member) => (
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
        <List horizontal relaxed='very' floated='right'>
          <List.Item>
            <Dropdown
              className='icon'
              icon='add'
              style={{ margin: '0px', paddingRight: '3px', paddingTop: '10px' }}
              labeled
              selection
              placeholder='Promote Member'
              options={getOptions(members)}
            />
          </List.Item>
        </List>
      )}
    </div>
  );
};

export default GroupAdminsList;
