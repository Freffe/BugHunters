import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import TextAreaInput from '../../../app/common/form/TextAreaInput';

const required = (value: any) => (value ? undefined : 'Required');

interface IProps {
  ticketId: string;
  commentId: string;
  commentBody: string;
  setIsEditComment: (flag: boolean) => void;
  editComment: (
    ticketId: string,
    commentId: string,
    body: string
  ) => Promise<void>;
  isEditingComment: boolean;
}

const TicketCommentEdit: React.FC<IProps> = ({
  ticketId,
  commentId,
  commentBody,
  setIsEditComment,
  editComment,
  isEditingComment,
}) => {
  const handleFinalFormSubmit = async (values: any) => {
    try {
      await editComment(ticketId, commentId, values);
      setIsEditComment(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ marginTop: '4px' }}>
      <FinalForm
        initialValues={{ body: commentBody }}
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder='body'
              validate={required}
              value={commentBody}
              name='body'
              rows={3}
              component={TextAreaInput}
            />
            <Button
              disabled={isEditingComment || invalid || pristine}
              loading={isEditingComment}
              floated='right'
              positive
              type='submit'
              content='submit'
            />
            <Button
              floated='right'
              type='button'
              content='cancel'
              onClick={() => setIsEditComment(false)}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default TicketCommentEdit;
