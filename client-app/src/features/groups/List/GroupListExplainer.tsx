import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

const GroupListExplainer = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='file' />
        Select what Group to view from the dropdown above. If no Group is
        available, you can create your own aswell!
      </Header>
    </Segment>
  );
};

export default GroupListExplainer;
