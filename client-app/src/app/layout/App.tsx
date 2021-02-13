import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import GroupList from '../../features/groups/List/GroupList';
import HomePage from '../../features/home/HomePage';
import NavBar from '../../features/nav/NavBar';
import Profile from '../../features/profiles/Profile';
import TicketFullDetails from '../../features/tickets/Details/TicketFullDetails';
import TicketForm from '../../features/tickets/Form/TicketForm';
import TicketList from '../../features/tickets/List/TicketList';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    autorun(() => {
      if (token && !appLoaded) {
        console.log('Token: ', token, ' apploaded: ', appLoaded);
        getUser().finally(() => setAppLoaded());
        console.log('Token1: ', token, ' apploaded1: ', appLoaded);
      } else if (!appLoaded) {
        console.log('Token2: ', token, ' apploaded2: ', appLoaded);
        setAppLoaded();
      }
    });
  }, []);

  if (!appLoaded) return <LoadingComponent content='Loading app...' />;
  return (
    <Fragment>
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em', border: '2px solid black' }}>
              <Switch>
                <PrivateRoute path='/issues' component={TicketList} />
                <PrivateRoute
                  path='/ticket/:username/:id'
                  component={TicketFullDetails}
                />
                <PrivateRoute
                  path='/ticket/:groupId/:id'
                  component={TicketFullDetails}
                />
                <PrivateRoute path='/groups' component={GroupList} />
                <PrivateRoute path='/createTicket' component={TicketForm} />
                <PrivateRoute path='/profile/:username' component={Profile} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
