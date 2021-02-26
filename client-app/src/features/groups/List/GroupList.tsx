import React, { useEffect, useState } from 'react';
import { Button, Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';
import GroupListExplainer from './GroupListExplainer';
import { observer } from 'mobx-react-lite';
import { IGroup, IMember } from '../../../app/models/groups';
import GroupSummary from './GroupSummary';
import GroupForm from '../Form/GroupForm';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import GroupDetails from '../Details/GroupDetails';

import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';

interface RouteParams {
  groupId: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const GroupList: React.FC<IProps> = () => {
  let history = useHistory();

  const { groupStore, userStore } = useStore();
  const { loadGroups, setSelectedGroupEmpty, selectedGroupId } = groupStore;
  const { user } = userStore;

  let isProfileRedirect = history.location.state === 'profileGroups';
  const [selectedGroup, setSelectedGroup] = useState<null | string>(
    isProfileRedirect ? selectedGroupId : null
  );
  const [isCreatingGroup, setCreatingGroup] = useState(false);

  useEffect(() => {
    async function gottaLoadGroups() {
      await loadGroups();
    }
    // We need to load groups if we arent redirected from profiles
    // OR if user refresh page on group from a redirect.
    if (
      (!isProfileRedirect && selectedGroupId === '') ||
      (isProfileRedirect && selectedGroupId === '')
    ) {
      gottaLoadGroups();
    }
    return () => {
      //setSelectedGroupEmpty();
      //stopHubConnection();
    };
  }, [selectedGroupId, loadGroups, setSelectedGroupEmpty, isProfileRedirect]);

  const handleDropDownChange = async (e: any, data: any) => {
    if (selectedGroupId) {
      await groupStore.stopHubConnection();
    }
    groupStore.setSelectedGroup(data.value);
    setSelectedGroup(data.value);
  };

  const isMember = (selectedGroup: string) => {
    // get the currently logged in user
    if (!groupStore.selectedGroup) return;
    let checkingGrp: IGroup = groupStore.selectedGroup;
    let isMemberFlag = false;
    // Check if user is member in group
    checkingGrp.members?.forEach((member: IMember) => {
      if (member.username === user?.username) isMemberFlag = true;
    });

    return isMemberFlag;
  };

  if (groupStore.loadingGroups)
    return <LoadingComponent content='Loading Groups...' />;

  return isCreatingGroup ? (
    <GroupForm
      setCreatingGroup={setCreatingGroup}
      setSelectedGroup={setSelectedGroup}
    />
  ) : (
    <Segment clearing style={{ border: '2px solid #bc4123' }}>
      <Grid
        style={{
          margin: '0px',
          marginBottom: '14px',
        }}
        stackable
      >
        <Grid.Row style={{ paddingBottom: '0px' }} columns={2}>
          <Grid.Column
            floated={'left'}
            style={{ margin: '0px', padding: '10px' }}
          >
            <Dropdown
              style={{ marginLeft: '0px' }}
              placeholder='Select Group'
              selection
              defaultValue={selectedGroup!}
              options={groupStore.groupTitles}
              onChange={handleDropDownChange}
            />
          </Grid.Column>
          <Grid.Column align='right' floated={'right'}>
            <Button
              style={{ margin: '0px' }}
              positive
              onClick={() => setCreatingGroup(true)}
            >
              Create Group
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Divider
          fitted
          style={{
            marginLeft: '10px',
            marginRight: '10px',
            marginBottom: '0px',
          }}
        />
        <Grid.Row style={{ margin: '10px' }} centered columns={1}>
          <Segment
            clearing
            style={{
              backgroundColor: 'rgb(7, 20, 38)',
              border: 'none',
            }}
          >
            {selectedGroup ? (
              isMember(selectedGroup!) ? (
                <GroupDetails
                  group={groupStore.groupsByDate.find(
                    (group: IGroup) => group.id === selectedGroup
                  )}
                />
              ) : (
                <GroupSummary
                  group={groupStore.groupsByDate.find(
                    (group: IGroup) => group.id === selectedGroup
                  )}
                ></GroupSummary>
              )
            ) : (
              <GroupListExplainer />
            )}
          </Segment>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default observer(GroupList);
