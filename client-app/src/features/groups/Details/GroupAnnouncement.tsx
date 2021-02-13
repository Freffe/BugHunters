import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import {
  List,
  Segment,
  Image,
  Button,
  Popup,
  Accordion,
  Icon,
  Grid,
} from 'semantic-ui-react';
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
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAnnouncementId, setIsAnnouncementId] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const handleClick = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  return (
    <Segment
      style={{
        backgroundColor: 'rgb(7, 20, 38)',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
    >
      <Accordion fluid exclusive={false} inverted>
        {announcements?.map((announcement, i) => (
          <List.Item
            key={announcement.id}
            style={{ paddingTop: '14px', paddingBottom: '14px' }}
          >
            <Accordion.Title
              onClick={(e, titleProps) => {
                setIsAnnouncementId(announcement.id);
                handleClick(e, titleProps);
              }}
              active={activeIndex === i}
              index={i}
            >
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
              <Image
                avatar
                floated='left'
                src={announcement.image || '/assets/user.png'}
              />
              {'   '}
              <span style={{ color: 'white', fontSize: '12px' }}>
                {formatDistance(new Date(announcement.createdAt), new Date())}{' '}
                ago.
              </span>
              <p>
                <Icon name='dropdown' />
                {announcement.body.split('\n')[0]}
              </p>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === i}>
              <span style={{ color: 'white', whiteSpace: 'pre-wrap' }}>
                {announcement.body.match(/[^\n]*\n|[^\n]+/g)!.slice(1)}
              </span>
            </Accordion.Content>
          </List.Item>
        ))}
      </Accordion>
    </Segment>
  );
};

export default GroupAnnouncement;
