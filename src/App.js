import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import './App.css';

import { asyncFB } from './FbSdk';
import { permissions } from './permissions';
import { PageList } from './PageList';

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
        <div style={{height: '100%'}}>
          <AppBar
            title={<span>Facebook Page Manager</span>}
          />


          {
            loggedIn ?
            <PageList></PageList> :
            <div style={{position: 'relative', top: '40%'}}>
              <RaisedButton label="Login" style={{margin: 'auto', width: '100px', display: 'block'}}
                primary={true} onClick={() => this.toggleLogin()} />
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
