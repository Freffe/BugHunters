import React from 'react';
import { List } from 'semantic-ui-react';
import { IGroup } from '../../../app/models/groups';

interface IProps {
  group: IGroup;
}

const dotStyles = {
  border: '1px solid',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'inline-block',
  marginLeft: '4px',
};

const GroupDetailsFooter: React.FC<IProps> = ({ group }) => {
  return (
    <div>
      <List horizontal floated='left'>
        <List.Item>Alive since {group.createdAt!.split('T')[0]}</List.Item>
        <List.Item>
          {group.groupName}'s: {group.members?.length}
        </List.Item>
      </List>

      <List horizontal floated='right'>
        <List.Item>
          <span style={{ color: 'blue', ...dotStyles }}>{group.open}</span>
          <span style={{ color: 'green', ...dotStyles }}>{group.verify}</span>
          <span style={{ color: 'red', ...dotStyles }}>{group.closed}</span>
        </List.Item>
      </List>
    </div>
  );
};

export default GroupDetailsFooter;
