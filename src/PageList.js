import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import { FB } from './FbSdk';
import { PageDetails } from './PageDetails';

export class PageList extends Component  {

  state = {
    pages: null,
    selectedPage: null
  }

  componentDidMount() {
    FB.api('/me/accounts', 'get', null, (response) => {
      this.setState({...this.state, pages: response.data})
    })
  }

  setSelectedPage(page) {
    this.setState({...this.state, selectedPage: page})
  }

  render() {
    const { pages, selectedPage } = this.state;

    return (
      <div style={{marginTop: '2em'}}>
        {
          pages !== null ?
            <div>
              <div style={{display: 'inline-block', width: '20%'}}>
                {
                  pages.map((page) => (
                    <List key={page.id}>
                      <Subheader>Pages</Subheader>
                      <ListItem primaryText={page.name} onClick={() => this.setSelectedPage(page)}/>
                    </List>
                  ))
                }
              </div>
              <PageDetails selectedPage={selectedPage}/>
            </div>
            :
            <CircularProgress size={80} thickness={5} />
        }
      </div>
    )
  }
}
