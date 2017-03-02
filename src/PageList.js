import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import { FB } from './FbSdk';
import { PageDetails } from './PageDetails';

export class PageList extends Component  {

  state = {
    pages: null,
    selectedPage: null
  }

  componentDidMount() {
    FB.api('/me/accounts', 'get', null, (response) => {
      console.log(response);
      this.setState({...this.state, pages: response.data},
        () => {
          this.state.pages.forEach((page, i) => {
            this.getPageImage(page).then((url) => {
              const pages = this.state.pages;
              pages[i].imageUrl = url;
              this.setState({...this.state, pages: pages});
            });
          })
        }
      )
    })
  }

  setSelectedPage(page) {
    this.setState({...this.state, selectedPage: page})
  }

  getPageImage(page) {
    return new Promise((resolve, reject) => {
      FB.api(
        `/${page.id}/picture`,
        (response) => {
          if (response && !response.error)
            resolve(response.data.url);
          else
            reject(response.error);
        }
      );
    });
  }

  render() {
    const { pages, selectedPage } = this.state;
    return (
      <div style={{marginTop: '2em'}}>
        {
          pages !== null ?
            <div>
              <div style={{position: 'fixed', width: '20%'}}>
                <Subheader>Pages</Subheader>
                {
                  pages.map((page, i) => (
                    <List key={page.id}>
                      <ListItem
                        value={i}
                        leftAvatar={<Avatar src={
                          page.imageUrl
                        } />}
                        primaryText={page.name} onClick={() => this.setSelectedPage(page)}/>
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
