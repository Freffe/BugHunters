import React, { useState } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { Button, Form } from 'semantic-ui-react';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { IProfile } from '../../../app/models/profile';
import { ITicket } from '../../../app/models/tickets';
import { IUser } from '../../../app/models/user';

interface IProps {
  isAddingComment: boolean;
  addComment: (...args: any) => Promise<void>;
  ticket?: ITicket;
  profile?: IProfile;
  user: IUser;
}
const required = (value: any) => (value ? undefined : 'Required');

const TicketAddComment: React.FC<IProps> = ({
  addComment,
  isAddingComment,
  ticket,
  profile,
  user,
}) => {
  const [shouldComment, setShouldComment] = useState(false);
  return (
    <div style={{ margin: 'auto', paddingTop: '10px' }}>
      {shouldComment ? (
        <FinalForm
          onSubmit={(val) =>
            addComment(ticket, {
              body: val.body,
              username: user.username,
              displayName: user.displayName,
              createdAt: new Date(),
              image: user.image,
            })
          }
          render={({ handleSubmit, submitting, form, invalid, pristine }) => (
            <Form
              onSubmit={() =>
                handleSubmit()!.then(() => {
                  console.log('Submitted');
                  setShouldComment(false);
                  form.reset();
                })
              }
            >
              <Field
                name='body'
                validate={required}
                component={TextAreaInput}
                rows={2}
                placeholder={'Add Comment'}
              />
              <Button
                disabled={isAddingComment || invalid || pristine}
                content={'Add Reply'}
                labelPosition='left'
                icon='edit'
                primary
                loading={submitting || isAddingComment}
              />
              <Button
                content='Cancel'
                labelPosition='right'
                icon='cancel'
                type='button'
                onClick={() => setShouldComment(false)}
              />
            </Form>
          )}
        />
      ) : (
        <Button
          labelPosition='right'
          icon='add'
          content={'Comment'}
          positive
          inverted
          onClick={() => setShouldComment(true)}
        />
      )}
    </div>
  );
};

export default TicketAddComment;
