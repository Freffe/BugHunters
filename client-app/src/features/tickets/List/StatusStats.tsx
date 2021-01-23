import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Statistic } from 'semantic-ui-react';

import { RootStoreContext } from '../../../app/stores/rootStore';

interface IProps {
  groupId: string;
}

const StatusStats: React.FC<IProps> = ({ groupId }) => {
  const { groupStore } = useContext(RootStoreContext);
  const { getGroups } = groupStore;

  const groupStats = { open: 0, verify: 0, closed: 0 };
  if (groupId) {
    const grp = getGroups.filter((group: any) => group.id === groupId);
    groupStats.open = grp[0].open;
    groupStats.closed = grp[0].closed;
    groupStats.verify = grp[0].verify;
  }

  return (
    <Statistic.Group widths={3}>
      <Statistic color='blue' size='mini'>
        <Statistic.Value text={true} style={{ minHeight: '0em' }}>
          {groupStats.open}
        </Statistic.Value>
        <Statistic.Label>Open</Statistic.Label>
      </Statistic>
      <Statistic color='green' size='mini'>
        <Statistic.Value text={true} style={{ minHeight: '0em' }}>
          {groupStats.verify}
        </Statistic.Value>
        <Statistic.Label>Verify</Statistic.Label>
      </Statistic>
      <Statistic color='red' size='mini'>
        <Statistic.Value text={true} style={{ minHeight: '0em' }}>
          {groupStats.closed}
        </Statistic.Value>
        <Statistic.Label>Closed</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  );
};

export default observer(StatusStats);
