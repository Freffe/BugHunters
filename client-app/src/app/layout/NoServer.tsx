import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NoServer = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='server' />
        Oops - The server made a hiccup.
      </Header>
      <Segment.Inline>
        <Button as={Link} to='/tickets' primary>
          Return to Tickets page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NoServer;
