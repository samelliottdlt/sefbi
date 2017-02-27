import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import './App.css';

import { asyncFB } from './FbSdk';
import { permissions } from './permissions'

class App extends Component {
  state = {
    loggedIn: null
  }

  componentDidMount() {
    this.checkLoginState();

    asyncFB.then((FB) => {
      FB.Event.subscribe('auth.authResponseChange', (response) => {
        this.checkLoginState();
      });
    })
  }

  checkLoginState() {
    asyncFB.then((FB) => {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          this.setState({loggedIn: true})
        } else if (response.status === 'not_authorized') {
          this.setState({loggedIn: false})
        } else {
          // the user isn't logged in to Facebook.
          this.setState({loggedIn: false})
        }
       });
    })
  }

  toggleLogin() {
    asyncFB.then((FB) => {
      const { loggedIn } = this.state;
      loggedIn ? FB.logout() : FB.login(null, permissions)
    });
  }

  render() {
    const {loggedIn} = this.state;
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span>Facebook Page Manager</span>}
            iconElementRight={
              loggedIn !== null ?
                <FlatButton label={loggedIn ? 'Logout' : 'Login'}
                  onClick={() => this.toggleLogin()}
                /> :
                <span></span>
            }
          />
          {
            loggedIn ? <div></div> :
            <Card>
              <CardHeader
                style={{textAlign: 'center', marginTop: '2em'}}
                title="Please login to your Facebook account by clicking the login button at the top right."
              />
            </Card>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
