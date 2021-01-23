import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Form as FinalForm, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import GroupClickToComment from './GroupClickToComment';

const GroupDetailedChatFlow = () => {
  const rootStore = useContext(RootStoreContext);
  const [shouldComment, setShouldComment] = useState(false);
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    addAdminComment,
    selectedGroup,
  } = rootStore.groupStore;

  useEffect(() => {
    // Is this firing twice?
    // We already have a connection, dont start a new one.
    // This fires twice when from profile
    // Once when rendeirng groupList -> grouPDetailedChat
    // Once when groupList loadGroups() has loaded and this rerenders because this uses groups.
    async function gottaCreateHub() {
      await createHubConnection(selectedGroup!.id);
    }
    //gottaCreateHub();
    return () => {
      stopHubConnection();
    };
  }, [stopHubConnection, createHubConnection, selectedGroup]);

  const submitComment = async (val: any) => {
    try {
      // This doesnt work.
      // TO receive messages before commenting
      // you need an already established connection dumbfuck
      await addComment(val);
      setShouldComment(false);
    } catch (error) {
      console.log('Error catched submitting comment: ', error);
    }
  };
  return (
    <Fragment>
      <Segment
        size='mini'
        textAlign='center'
        attached='top'
        inverted
        style={{
          border: 'none',
          background: 'linear-gradient(135deg, #047F83 0%, #000000 99%)',
        }}
      >
        <Header size='medium'>{selectedGroup.groupName} chat</Header>
      </Segment>
      <Segment
        attached
        textAlign='left'
        style={{ overflow: 'auto', maxHeight: 320 }}
      >
        <Comment.Group>
          <GroupClickToComment isAnnouncement={false} />

          {selectedGroup &&
            selectedGroup.comments &&
            selectedGroup.comments
              .slice()
              .reverse()
              .map((comment: any) =>
                comment.username !== null ? (
                  <Comment key={comment.id}>
                    <Comment.Avatar src={comment.image || '/assets/user.png'} />
                    <Comment.Content>
                      <Comment.Author
                        as={Link}
                        to={`/profile/${comment.username}`}
                      >
                        {comment.displayName}
                      </Comment.Author>
                      <Comment.Metadata>
                        <div>
                          {formatDistance(
                            new Date(comment.createdAt),
                            new Date()
                          )}
                        </div>
                      </Comment.Metadata>
                      <Comment.Text>{comment.body}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                ) : (
                  <Comment key={comment.id}>
                    <Comment.Content>
                      <Comment.Text
                        style={{ fontStyle: 'italic', color: 'green' }}
                      >
                        {comment.body}
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                )
              )}
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(GroupDetailedChatFlow);
