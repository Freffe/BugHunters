import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NoNet = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='server' />
        Oops - A network error occurred, maybe the server is taking a break.
      </Header>
      <Segment.Inline>
        <Button as={Link} to='/tickets' primary>
          Return to Tickets page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NoNet;
