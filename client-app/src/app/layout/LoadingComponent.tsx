import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingComponent: React.FC<{ inverted?: boolean; content?: string }> = ({
  inverted = false,
  content,
}) => {
  return (
    <Dimmer
      active
      inverted={inverted}
      style={{ backgroundColor: 'rgb(7, 20, 38)' }}
    >
      <Loader
        content={content}
        style={{ color: 'white', backgroundImage: '#bc4123' }}
      />
    </Dimmer>
  );
};

export default LoadingComponent;
