import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Menu, Image, Dropdown, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const NavBar = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;
  return (
    <Grid>
      <Menu fixed='top' inverted>
        <Container>
          <Grid.Column>
            <Menu.Item header as={NavLink} exact to='/'>
              <img
                src='/assets/bugHunter-oranges.png'
                alt='logo'
                style={{ marginRight: '10px' }}
              />
            </Menu.Item>
          </Grid.Column>

          <Menu.Item as={NavLink} to='/issues' name='Issues' />

          <Menu.Item as={NavLink} to='/groups' name='Groups' />

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
