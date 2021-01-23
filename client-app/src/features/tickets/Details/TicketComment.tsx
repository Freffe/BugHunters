import { formatDistance } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Comment, Item, Button } from 'semantic-ui-react';
import { IComment } from '../../../app/models/groups';
import { IUser } from '../../../app/models/user';
import TicketCommentEdit from './TicketCommentEdit';

interface IProps {
  comments?: any;
  editComment: (...args: any) => Promise<void>;
  deleteComment: (...args: any) => Promise<void>;
  user: IUser | null;
  ticketId: string;
  isEditingComment: boolean;
  isDeletingComment: boolean;
}

const TicketComment: React.FC<IProps> = ({
  comments,
  editComment,
  deleteComment,
  isEditingComment,
  isDeletingComment,
  user,
  ticketId,
}) => {
  const [isEditComment, setIsEditComment] = useState(false);
  const [isSelectedComment, setIsSelectedComment] = useState('');
  return comments ? (
    comments?.map((comment: IComment, i: any) => (
      <Grid
        key={comment.id}
        style={{
          border: '1px solid black',
          background: '#f2f2f2',
          marginBottom: '1px',
        }}
      >
        <Grid.Row>
          <Grid.Column width={2}>
            <Item.Group>
              <Item style={{ border: '1px solid black' }}>
                <div
                  style={{
                    justifyContent: 'center',
                    margin: 'auto',
                    padding: '4px',
                  }}
                >
                  <Item.Image
                    src={comment.image || '/assets/user.png'}
                    size='tiny'
                    style={{ width: 'auto' }}
                  />
                  <Item.Extra
                    as={Link}
                    to={`/profile/${comment.username}`}
                    style={{ textAlign: 'center' }}
                  >
                    {comment.displayName}
                  </Item.Extra>
                  <Item.Meta>
                    <span className='date'>Joined in 2015</span>
                  </Item.Meta>
                </div>
              </Item>
            </Item.Group>
          </Grid.Column>
          <Grid.Column width={14}>
            <div style={{ padding: '4px' }}>
              <Comment>
                <Comment.Metadata>
                  <Grid>
                    <Grid.Row columns='2'>
                      <Grid.Column floated='left'>
                        Posted{' '}
                        {formatDistance(
                          new Date(comment.createdAt),
                          new Date()
                        )}{' '}
                        ago.
                      </Grid.Column>
                      <Grid.Column textAlign='right' floated='right'>
                        {user?.username === comment.username && (
                          <Grid.Row>
                            <Button
                              content='Edit'
                              icon='edit'
                              primary
                              onClick={() => {
                                setIsSelectedComment(comment.id);
                                setIsEditComment(true);
                              }}
                            />
                            <Button
                              loading={
                                isDeletingComment &&
                                comment.id === isSelectedComment
                              }
                              content='Delete'
                              icon='cancel'
                              negative
                              onClick={() => {
                                setIsSelectedComment(comment.id);
                                deleteComment(ticketId, comment.id);
                              }}
                            />
                          </Grid.Row>
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Comment.Metadata>
                {isEditComment && isSelectedComment === comment.id ? (
                  <TicketCommentEdit
                    key={comment.id}
                    ticketId={ticketId}
                    commentId={comment.id}
                    commentBody={comment.body}
                    setIsEditComment={setIsEditComment}
                    editComment={editComment}
                    isEditingComment={isEditingComment}
                  />
                ) : (
                  <Comment.Text style={{ paddingTop: '4px' }}>
                    {comment.body}
                  </Comment.Text>
                )}
              </Comment>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ))
  ) : (
    <div>Hey</div>
  );
};

export default observer(TicketComment);
