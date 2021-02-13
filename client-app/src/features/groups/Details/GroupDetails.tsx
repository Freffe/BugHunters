import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, Item, Segment } from 'semantic-ui-react';

import { IGroup, IMember } from '../../../app/models/groups';
import { RootStoreContext } from '../../../app/stores/rootStore';
import GroupAdminsList from './GroupAdminsList';
import GroupAnnouncement from './GroupAnnouncement';
import GroupAnnouncementTest from './GroupAnnouncement';
import GroupClickToComment from './GroupClickToComment';
import GroupDescriptionEdit from './GroupDescriptionEdit';
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
    editGroupDescription,
    isUploadingGroupEdit,
    loadingGroupPhoto,
    deletingGroupPhoto,
    selectedGroup,
  } = groupStore;
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  // Clean up when grouplist -> chat works.
  useEffect(() => {
    console.log('GroupDetails called');
    createHubConnection(selectedGroupId);
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, selectedGroupId, stopHubConnection]);

  const handleFinalFormSubmit = async (values: any) => {
    try {
      //await editProfile(values);
      const newGroup = selectedGroup;
      newGroup.description = values.description;
      await editGroupDescription(newGroup);
      setIsEditingDescription(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Item.Group
      divided
      style={{
        margin: '10px',
        backgroundColor: 'rgb(7, 20, 38) ',
        border: '1px solidrgba(255,255,255,0.4)',
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

              <Segment
                clearing
                style={{
                  backgroundColor: 'rgb(7, 20, 38)',
                  color: 'white',
                  border: 'none',
                }}
              >
                {isEditingDescription ? (
                  <div>
                    <GroupDescriptionEdit
                      handleFinalFormSubmit={handleFinalFormSubmit}
                      description={description}
                      isUploadingGroupEdit={isUploadingGroupEdit}
                    />
                    <Button
                      floated='right'
                      icon='cancel'
                      onClick={() => setIsEditingDescription(false)}
                    />
                  </div>
                ) : (
                  <>
                    <Item.Description style={{ whiteSpace: 'pre-wrap' }}>
                      {description}{' '}
                    </Item.Description>
                    {isHostOrAdminOfGroup && (
                      <Button
                        floated='right'
                        icon='edit'
                        onClick={() => setIsEditingDescription(true)}
                      />
                    )}
                  </>
                )}
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
                <Segment
                  clearing
                  attached
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    backgroundColor: 'rgb(7, 20, 38)',
                    color: 'white',
                  }}
                >
                  <GroupAdminsList
                    admins={members!.filter(
                      (member: IMember) => member.isAdmin || member.isHost
                    )}
                    members={members!.filter(
                      (member: IMember) => !member.isAdmin && !member.isHost
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
