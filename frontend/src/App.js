import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from "./components/Navigation/MainNavigation"
import AuthContext from './context/auth-context';

class App extends React.Component {
  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  logout = () => {
    this.setState({ token: null, userId: null });
  }

  render() {
    return (
      <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider
            value={{
                token: this.state.token,
                userId: this.state.userId,
                login: this.login,
                logout: this.logout
              }}
            >
              <MainNavigation />
              <main className="main-content">
                  {/*switch is responsible for matching the first path and going to that */}
                  <Switch>
                      {/*without exact, "/" will be used as a prefix, even /events will redirect to auth*/}
                      <Redirect from="/" to="/auth" exact />
                      <Route path="/auth" component={AuthPage} />
                      <Route path="/events" component={EventsPage} />
                      <Route path="/bookings" component={BookingsPage} />
                  </Switch>
              </main>
            </AuthContext.Provider>
          </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
