import React, { useContext, useState } from 'react';
import { Form, Comment, Button } from 'semantic-ui-react';
import { Field, Form as FinalForm } from 'react-final-form';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { v4 as uuid } from 'uuid';

const GroupClickToComment: React.FC<{ isAnnouncement: boolean }> = ({
  isAnnouncement,
}) => {
  const { groupStore, userStore } = useContext(RootStoreContext);
  const [shouldComment, setShouldComment] = useState(false);

  const submitAnnouncement = async (val: any) => {
    //console.log('SubmitComment: ', val.body);
    try {
      if (isAnnouncement) {
        const body = {
          body: val.body,
          username: userStore.user!.username,
          displayName: userStore.user!.displayName,
          createdAt: new Date(),
          image: userStore.user?.image,
          id: uuid(),
        };
        await groupStore.addAnnouncement(groupStore.selectedGroupId, body);
      } else {
        await groupStore.addComment(val);
      }
      setShouldComment(false);
    } catch (error) {
      console.log('Error catched submitting announcement: ', error);
    }
  };

  return (
    <Comment>
      {shouldComment ? (
        <FinalForm
          onSubmit={(val) => submitAnnouncement(val)}
          render={({ handleSubmit, submitting, form }) => (
            <Form
              onSubmit={() =>
                handleSubmit()!.then(() => {
                  console.log('Submitted');

                  form.reset();
                })
              }
            >
              <Field
                name='body'
                component={TextAreaInput}
                rows={2}
                placeholder={
                  isAnnouncement ? `Add your Announcement` : 'Add Comment'
                }
              />
              <Button
                content={isAnnouncement ? 'Create' : 'Add Reply'}
                labelPosition='left'
                icon='edit'
                primary
                loading={submitting}
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
          content={isAnnouncement ? 'Announcement' : 'Comment'}
          inverted
          style={{
            marginTop: isAnnouncement && '10px',
            backgroundColor: '#bc4123',
          }}
          onClick={() => setShouldComment(true)}
        />
      )}
    </Comment>
  );
};

export default observer(GroupClickToComment);
