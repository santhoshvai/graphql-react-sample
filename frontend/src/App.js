import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from "./components/Navigation/MainNavigation"

function App() {
  return (
    <BrowserRouter>
        <React.Fragment>
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
        </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
