import React from 'react';
import { Header, Segment, Image } from 'semantic-ui-react';

const GroupListExplainer = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Image
          src='/assets/bughunter-grp.png'
          alt='logo'
          style={{ marginRight: '10px', width: '60px', height: '60px' }}
        />
        Select what Group to view from the dropdown above. If no Group is
        available, you can create your own aswell!
      </Header>
    </Segment>
  );
};

export default GroupListExplainer;
