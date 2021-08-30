import React from 'react';
import './App.scss';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { SignIn } from './features/signIn/SignIn';
import { useAppDispatch, useAppSelector } from './app/state/store';
import { selectRouterRedirectTo } from './features/routerSlice';
import { routerReset } from '../src/features/routerSlice';
import { Welcome } from './pages/welcome/Welcome';
import { SignUp } from './features/signUp/SignUp';
import { Identify } from './features/identify/Identify';
import { ResetPassword } from './features/resetPassword/ResetPassword';
import { PersonalSettings } from './pages/personalSettings/PersonalSettings';
import { getToken } from './useToken';
import { Header } from './components/authorized/header/Header';
import { LeftBar } from './features/leftBar/LeftBar';
import { selectLeftBarOpen } from './features/leftBar/leftBarSlice';

const App = () => {
  const location = useLocation();
  const history = useHistory();
  const redirectTo = useAppSelector(selectRouterRedirectTo);
  const isLeftBarOpen = useAppSelector(selectLeftBarOpen);
  const dispatch = useAppDispatch();
  const token = getToken();

  React.useEffect(() => {
    if (redirectTo && location.pathname !== redirectTo) {
      history.push(redirectTo);
      dispatch(routerReset());
    }
  });

  if (!token) {
    return (
      <Switch>
        <Route path="/identify">
          <Identify />
        </Route>
        <Route path="/resetpassword">
          <ResetPassword />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/">
          <Welcome />
        </Route>
      </Switch>
    )
  }

  return (
    <div>
      <Header />
      <div className="page">
        <LeftBar />
        <div className={isLeftBarOpen ? "mainWithLeftBar" : "main"}>
          <Switch>
            <Route path="/personalsettings">
              <PersonalSettings />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;