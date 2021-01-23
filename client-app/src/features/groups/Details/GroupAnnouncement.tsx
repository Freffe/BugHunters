import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import { List, Segment, Image, Button, Popup } from 'semantic-ui-react';
import { IAnnouncement } from '../../../app/models/groups';

interface IProps {
  announcements?: IAnnouncement[] | undefined;
  isHostOrAdminOfGroup: boolean;
  groupId: string;
  deleteAnnouncement: (groupId: string, announcementId: string) => void;
  submittingAnnouncement: boolean;
}

const GroupAnnouncement: React.FC<IProps> = ({
  announcements,
  isHostOrAdminOfGroup,
  groupId,
  deleteAnnouncement,
  submittingAnnouncement,
}) => {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isAnnouncementId, setIsAnnouncementId] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  return (
    <Segment style={{ overflow: 'auto' }}>
      <List divided relaxed floated='left'>
        {announcements?.map((announcement) => (
          <List.Item style={{ width: '660px' }} key={announcement.id}>
            <Image
              avatar
              floated='left'
              src={announcement.image || '/assets/user.png'}
            />
            <List.Content>
              <List.Header
                as='a'
                onClick={() => {
                  setIsAnnouncementId(announcement.id);
                  setIsHeaderExpanded(!isHeaderExpanded);
                }}
                floated='right'
              >
                {isHeaderExpanded && announcement.id === isAnnouncementId ? (
                  <p>{announcement.body}</p>
                ) : (
                  announcement.body.substr(0, 30) + '...'
                )}
              </List.Header>
              <List.Description as='a'>
                <span>
                  {formatDistance(new Date(announcement.createdAt), new Date())}{' '}
                  ago.
                </span>
              </List.Description>
            </List.Content>
            {isHostOrAdminOfGroup && (
              <Popup
                key={announcement.id}
                header={'Delete announcement'}
                trigger={
                  <Button
                    icon='cancel'
                    onClick={() => {
                      setDeleteKey(announcement.id);
                      deleteAnnouncement(groupId, announcement.id);
                    }}
                    floated='right'
                    loading={
                      submittingAnnouncement && announcement.id === deleteKey
                    }
                  />
                }
              />
            )}
          </List.Item>
        ))}
      </List>
    </Segment>
  );
};

export default GroupAnnouncement;
