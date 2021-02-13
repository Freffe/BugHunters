import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Button, Divider, Icon, Item } from 'semantic-ui-react';
import { IGroup } from '../../../app/models/groups';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface IProps {
  group: IGroup;
}

const GroupSummary: React.FC<IProps> = ({ group }) => {
  const { groupStore } = useContext(RootStoreContext);
  const { joinGroup, submittingGroup } = groupStore;
  const { groupName, description, id } = group;
  return (
    <Item.Group
      style={{
        margin: '10px',
      }}
    >
      <Item>
        <Item.Content
          style={{
            margin: '10px',
          }}
          verticalAlign='middle'
        >
          <Item.Header
            style={{
              color: 'white',
            }}
          >
            {groupName}
          </Item.Header>
        </Item.Content>
      </Item>
      <Divider />
      <Item>
        <Item.Content
          style={{
            margin: '10px',
          }}
        >
          <Item.Description
            style={{
              color: 'white',
            }}
          >
            Description: {description}{' '}
          </Item.Description>
          <Item.Description
            style={{
              color: 'white',
            }}
          >
            Alive since {group.createdAt!.split('T')[0]}
          </Item.Description>
          <Item.Extra>
            <h4
              style={{
                color: 'white',
              }}
            >
              Issue Status:{'    '}{' '}
            </h4>
            <Icon color='blue' name='circle'>
              {'    '}
              {group.open}
              {'    '}
            </Icon>
            <Icon color='green' name='circle'>
              {'    '}
              {group.verify}
              {'    '}
            </Icon>
            <Icon color='red' name='circle'>
              {'    '}
              {group.closed}
              {'    '}
            </Icon>
          </Item.Extra>
          <Button
            loading={submittingGroup}
            positive
            onClick={() => joinGroup(id)}
          >
            Join Group
          </Button>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

export default observer(GroupSummary);
