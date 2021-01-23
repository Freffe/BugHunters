import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfileGroups from './ProfileGroups';

import ProfilePhotos from './ProfilePhotos';
import ProfileTickets from './ProfileTickets';

const panes = [
  { menuItem: 'Tickets', render: () => <ProfileTickets /> },
  { menuItem: 'Groups', render: () => <ProfileGroups /> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  { menuItem: 'Settings', render: () => <Tab.Pane>Tickets Settings</Tab.Pane> },
];

const ProfileContent = () => {
  return (
    <Tab
      menu={{ borderless: true, attached: false, tabular: false }}
      panes={panes}
    />
  );
};

export default ProfileContent;
