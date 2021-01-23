import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Item,
  Segment,
  Image,
  Header,
  Grid,
  Popup,
} from 'semantic-ui-react';

import { IGroup, IMember } from '../../../app/models/groups';
import { RootStoreContext } from '../../../app/stores/rootStore';
import GroupAdminsList from './GroupAdminsList';
import GroupAnnouncement from './GroupAnnouncement';
import GroupClickToComment from './GroupClickToComment';
import GroupDetailedChatFlow from './GroupDetailedChatFlow';
import GroupDetailsFooter from './GroupDetailsFooter';
import GroupDetailsHeader from './GroupDetailsHeader';
import GroupUploadPhoto from './GroupUploadPhoto';

interface IProps {
  group: IGroup;
}

const GroupDetails: React.FC<IProps> = ({ group }) => {
  const { groupName, description, id, members, photos } = group;
  const { groupStore } = useContext(RootStoreContext);
  const {
    stopHubConnection,
    leaveGroup,
    submittingGroup,
    isHostOfGroup,
    createHubConnection,
    selectedGroupId,
    isHostOrAdminOfGroup,
    deleteAnnouncement,
    submittingAnnouncement,
    uploadPhoto,
    deletePhoto,
    loadingGroupPhoto,
    deletingGroupPhoto,
  } = groupStore;
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  // Clean up when grouplist -> chat works.
  useEffect(() => {
    console.log('GroupDetails called');
    createHubConnection(selectedGroupId);
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, selectedGroupId, stopHubConnection]);

  return (
    <Item.Group
      divided
      style={{
        border: '1px solid black',
        margin: '10px',
      }}
    >
      <Item>
        <Item.Content
          style={{
            margin: '10px',
          }}
          verticalAlign='middle'
        >
          <Item>
            <Item.Content
              style={{
                margin: '10px',
              }}
            >
              <GroupDetailsHeader
                groupId={selectedGroupId}
                deletePhoto={deletePhoto}
                groupName={groupName}
                photo={{
                  id: photos ? photos?.slice(0, 1)[0]?.id : undefined,
                  url: photos ? photos?.slice(0, 1)[0]?.url : undefined,
                }}
                isHostOrAdminOfGroup={isHostOrAdminOfGroup}
                loadingGroupPhoto={loadingGroupPhoto}
                deletingGroupPhoto={deletingGroupPhoto}
                setIsAddingPhoto={setIsAddingPhoto}
                isAddingPhoto={isAddingPhoto}
              />

              <Segment clearing>
                <Item.Description>{description} </Item.Description>
              </Segment>
              {isHostOrAdminOfGroup && isAddingPhoto && (
                <GroupUploadPhoto
                  groupId={selectedGroupId}
                  uploadPhoto={uploadPhoto}
                  loading={loadingGroupPhoto}
                  setIsAddingPhoto={setIsAddingPhoto}
                />
              )}
              <Item.Description>
                <Segment clearing attached secondary style={{ padding: '6px' }}>
                  <GroupAdminsList
                    members={members!.filter(
                      (member: IMember) => member.isAdmin || member.isHost
                    )}
                    isHostOrAdmin={isHostOrAdminOfGroup}
                  />
                </Segment>
                {isHostOrAdminOfGroup && (
                  <GroupClickToComment isAnnouncement={true} />
                )}
                {group.announcements!.length > 0 && (
                  <GroupAnnouncement
                    groupId={selectedGroupId}
                    announcements={group.announcements}
                    isHostOrAdminOfGroup={isHostOrAdminOfGroup}
                    deleteAnnouncement={deleteAnnouncement}
                    submittingAnnouncement={submittingAnnouncement}
                  />
                )}
              </Item.Description>
            </Item.Content>
          </Item>
          <Divider />
          <GroupDetailedChatFlow />
          <Item.Content>
            <Item.Extra>
              <GroupDetailsFooter group={group} />
            </Item.Extra>
            <Button
              loading={submittingGroup}
              negative
              disabled={isHostOfGroup}
              onClick={() => leaveGroup(id)}
            >
              Leave Group
            </Button>
          </Item.Content>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

export default observer(GroupDetails);
