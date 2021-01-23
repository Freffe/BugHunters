import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Grid, Segment } from 'semantic-ui-react';
import GroupListExplainer from './GroupListExplainer';
import { observer } from 'mobx-react-lite';
import { IGroup, IMember } from '../../../app/models/groups';
import GroupSummary from './GroupSummary';
import GroupForm from '../Form/GroupForm';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import GroupDetails from '../Details/GroupDetails';

import { RouteComponentProps, useHistory } from 'react-router-dom';

interface RouteParams {
  groupId: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const GroupList: React.FC<IProps> = () => {
  let history = useHistory();

  const { groupStore, userStore } = useContext(RootStoreContext);
  const { loadGroups, setSelectedGroupEmpty, selectedGroupId } = groupStore;
  const { user } = userStore;
  // console.log('history location state ', history.location.state);
  let isProfileRedirect = history.location.state === 'profileGroups';
  const [selectedGroup, setSelectedGroup] = useState<null | string>(
    isProfileRedirect ? selectedGroupId : null
  );
  const [isCreatingGroup, setCreatingGroup] = useState(false);
  //console.log('id: ', groupStore.selectedGroup, groupStore.selectedGroupId);
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
      console.log('Loading groups!');
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
    //history.push(`/groups/${data.value}`);
    // Now filter list items shown on data.value for status
  };

  const isMember = (selectedGroup: string) => {
    // get the currently logged in user
    if (!groupStore.selectedGroup) return;
    let checkingGrp: IGroup = groupStore.selectedGroup;
    let isMemberFlag = false;
    // Check if user is member in group
    // This gives
    // useObserver.ts:119 Uncaught TypeError: _checkingGrp$members.forEach is not a function
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
    <Grid divided='vertically' width={16}>
      <Grid.Row style={{ margin: '10px', paddingBottom: '0px' }} columns={2}>
        <Grid.Column floated={'left'}>
          <Dropdown
            placeholder='Select Group'
            selection
            defaultValue={selectedGroup!}
            options={groupStore.groupTitles}
            onChange={handleDropDownChange}
          />
        </Grid.Column>
        <Grid.Column align='right' floated={'right'}>
          <Button positive onClick={() => setCreatingGroup(true)}>
            Create Group
          </Button>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row style={{ margin: '10px' }} centered padded='horizontally'>
        <Segment
          style={{ width: '800px' /* Temporary css fix until later. */ }}
          size='massive'
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
  );
};

export default observer(GroupList);
