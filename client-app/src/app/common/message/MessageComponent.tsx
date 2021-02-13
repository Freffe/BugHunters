import React, { useState } from 'react';
import { Message } from 'semantic-ui-react';
interface IProps {
  status: boolean;
  header: string;
  message: string;
  negative?: boolean;
}
const MessageComponent: React.FC<IProps> = ({ status, header, message }) => {
  const [isShowingMessage, setIsShowingMessage] = useState(true);
  if (isShowingMessage) {
    return (
      <Message
        onDismiss={() => setIsShowingMessage(!isShowingMessage)}
        negative={status}
      >
        <Message.Header>{header}</Message.Header>
        <Message.Content>{message}</Message.Content>
      </Message>
    );
  }
  return <></>;
};

export default MessageComponent;
