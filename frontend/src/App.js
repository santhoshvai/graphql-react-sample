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
                      {/*go to events by default when authenticated*/}
                      {this.state.token && <Redirect from="/" to="/events" exact />}
                      {/*redirect from auth to events when authenticated -- happens after login, but when typed to browser whole page refreshes and the state is lost*/}
                      {this.state.token && <Redirect from="/auth" to="/events" exact />}
                      {/*show auth only when not authenticated*/}
                      {!this.state.token && (
                        <Route path="/auth" component={AuthPage} />
                      )}
                      <Route path="/events" component={EventsPage} />
                      {/*show bookings only when authenticated*/}
                      {this.state.token && (
                        <Route path="/bookings" component={BookingsPage} />
                      )}
                      {/*go to auth when not authenticated, except in case of events*/}
                      {!this.state.token && <Redirect to="/auth" exact />}
                  </Switch>
              </main>
            </AuthContext.Provider>
          </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
