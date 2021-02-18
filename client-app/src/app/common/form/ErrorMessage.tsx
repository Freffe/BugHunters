import { AxiosResponse } from 'axios';
import React from 'react';
import { Message } from 'semantic-ui-react';

interface IProps {
  error: any;
  text?: string;
}
/*
<Message error>
<Message.Header>{error.statusText}</Message.Header>
{error.data && Object.keys(error.data.errors).length > 0 && (
  <Message.List>
    {Object.values(error.data.errors)
      .flat()
      .map((err: any, i) => (
        <Message.Item key={i}>{err}</Message.Item>
      ))}
  </Message.List>
)}
{text && <Message.Content content={text} />}
</Message> */
const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  console.log('error: ', error, ' text: ', text);
  return (
    <Message error>
      <Message.Header>{text}</Message.Header>
      {error && (
        <Message.List>
          {error.length > 0 &&
            error.map((err: any, i: number) => (
              <Message.Item key={i}>{err}</Message.Item>
            ))}
        </Message.List>
      )}
      {typeof error.data === 'string' && (
        <Message.Content content={error.data} />
      )}
    </Message>
  );
};

export default ErrorMessage;
