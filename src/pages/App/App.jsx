import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import User from '../User/User';
import NavBar from '../../components/TuxComponents/layouts/NavBar';
import authService from '../../services/authService';
import Landing from '../Landing/Landing';
import PreviewActivity from '../PreviewActivity/PreviewActivity';
// import IndexActivities from '../IndexActivities/IndexActivities';
import './App.css';
import Manager from '../Manager/Manager';
import Activity from '../Activity/Activity';
import userService from '../../services/userService';

import ActivityContextProvider from '../../contexts/ActivityContext';
import ManagerContextProvider from '../../contexts/ManagerContext';

// !A temporary list of activity route names and their ids. Below you will see this variable being mapped through and rendering the Activity Routes. This way when we have multiple activities the Routes will be dynamically generated, and we just have to store these properties on the activities themselves or the User object if we want to restrict the user to only seeing the activities that have been assigned to them.

const activities = [{ name: 'heuristics', id: '6009f75ea00e3f38a7c65c7d' }];

const App = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const userProfile = await userService.getCurrentUser();
    setUser(userProfile);
  };

  const handleLogout = async () => {
    setUser(null);
    authService.logoutFromGoogle();
  };

  useEffect(() => {
    getUser();
  }, []);

  const NavRoutes = () => {
    // These routes will render the NavBar
    return (
      <>
        <NavBar user={user} handleLogout={handleLogout} />
        {/* <Route exact path="/activities" render={() => <IndexActivities />} /> */}
        {/* <Route exact path="/manager-dashboard" render={() => <Manager />} /> */}
        <Route
          exact
          path="/manager-dashboard"
          render={() => (
            <ManagerContextProvider>
              <Manager />
            </ManagerContextProvider>
          )}
        />
        <Route
          exact
          path="/preview-activity"
          render={({ location }) => <PreviewActivity location={location} />}
        />

        {/* // !Mapping through the activities array to dynamically render Activity Routes. */}
        {activities.length > 0 &&
          activities.map((activity, index) => (
            <Route
              exact
              path={`/activity/${activity.name}`}
              render={() => (
                <ActivityContextProvider activityId={activity.id}>
                  <Activity />
                </ActivityContextProvider>
              )}
            />
          ))}
      </>
    );
  };
  return (
    <>
      {/* //! These routes will not render a navbar */}
      <Route
        exact
        path="/"
        render={() => (!user ? <User user={user} /> : <Landing />)}
      />

      <Route
        path="/signup/:groupId?/:email?"
        render={({ history, match }) => (
          <Signup history={history} match={match} />
        )}
      />
      <Route
        exact
        path="/login"
        render={({ history }) => <Login history={history} />}
      />

      {/* These routes will render the NavBar */}
      <Route component={NavRoutes} />
    </>
  );
};

export default App;
