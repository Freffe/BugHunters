import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Menu, Image, Dropdown, Grid } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

const NavBar = () => {
  const { userStore } = useStore();
  const { user, logout } = userStore;
  return (
    <Grid>
      <Menu fixed='top' inverted>
        <Container style={{ border: 'none' }}>
          <Grid.Column>
            <Menu.Item header as={NavLink} exact to='/'>
              <img
                src='/assets/BugHunter-oranges.png'
                alt='logo'
                style={{ marginRight: '10px' }}
              />
            </Menu.Item>
          </Grid.Column>

          <Menu.Item as={NavLink} to='/issues' name='Issues' />

          <Menu.Item as={NavLink} to='/groups' name='Groups' />
          {/*<Menu.Item as={NavLink} to='/errors' name='Errors' /> */}

          <Menu.Item as={NavLink} to='/createTicket' name='Create Ticket' />
          {user && (
            <Menu.Item position='right'>
              <Image
                avatar
                spaced='right'
                src={user.image || '/assets/user.png'}
              />
              <Dropdown pointing='top left' text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/${user.username}`}
                    text='My profile'
                    icon='user'
                  />
                  <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </Grid>
  );
};

export default observer(NavBar);
