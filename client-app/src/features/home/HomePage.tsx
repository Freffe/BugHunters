import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment, Tab } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';

const HomePage = () => {
  const token = window.localStorage.getItem('jwt');
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  //const { openModal } = rootStore.modalStore;
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        {isLoggedIn && user && token ? (
          <Fragment>
            <Header as='h2' inverted content={`Welcome ${user.displayName}`} />
            <Button as={Link} to='/groups' size='huge' inverted>
              Go to groups!
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as='h2' inverted content='Welcome to Bug hunters!' />
            <Segment
              style={{
                backgroundColor: 'rgb(7, 20, 38)',
                border: '2px solid #bc4123',
              }}
            >
              <Tab
                menu={{ attached: 'bottom' }}
                panes={[
                  {
                    menuItem: 'Login',
                    render: () => (
                      <Tab.Pane
                        attached='top'
                        style={{
                          backgroundColor: 'rgb(7, 20, 38)',
                          border: 'none',
                        }}
                      >
                        <LoginForm />
                      </Tab.Pane>
                    ),
                  },
                  {
                    menuItem: 'Register',
                    render: () => (
                      <Tab.Pane
                        attached='top'
                        style={{
                          backgroundColor: 'rgb(7, 20, 38)',
                          border: 'none',
                        }}
                      >
                        <RegisterForm />
                      </Tab.Pane>
                    ),
                  },
                ]}
              />
            </Segment>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default HomePage;
