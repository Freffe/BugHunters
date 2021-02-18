import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileGroups from './ProfileGroups';

import ProfilePhotos from './ProfilePhotos';
import ProfileSettings from './ProfileSettings';
import ProfileTickets from './ProfileTickets';

const ProfileContent = () => {
  const panes = [
    { menuItem: 'Tickets', render: () => <ProfileTickets /> },
    { menuItem: 'Groups', render: () => <ProfileGroups /> },
    { menuItem: 'Photos', render: () => <ProfilePhotos /> },
    {
      menuItem: 'Settings',
      render: () => isCurrentUser && <ProfileSettings />,
    },
  ];
  const { profileStore } = useStore();
  const { isCurrentUser } = profileStore;
  return (
    <Tab
      menu={{
        borderless: true,
        attached: false,
        tabular: false,
      }}
      panes={panes}
    />
  );
};

export default observer(ProfileContent);
