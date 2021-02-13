import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import GroupClickToComment from './GroupClickToComment';

const GroupDetailedChatFlow = () => {
  const rootStore = useContext(RootStoreContext);

  const { stopHubConnection, selectedGroup } = rootStore.groupStore;

  useEffect(() => {
    //gottaCreateHub();
    return () => {
      stopHubConnection();
    };
  }, [stopHubConnection]);

  return (
    <Fragment>
      <Segment
        size='mini'
        textAlign='center'
        attached='top'
        inverted
        style={{
          border: '2px solid #bc4123',
          background: 'linear-gradient(135deg, #071426 0%, #000000 99%)',
        }}
      >
        <Header size='medium'>{selectedGroup.groupName} chat</Header>
      </Segment>
      <Segment
        attached
        textAlign='left'
        style={{
          overflow: 'auto',
          maxHeight: 320,
          border: '2px solid #bc4123',
        }}
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
                      <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
                        {comment.body}
                      </Comment.Text>
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
