import React, { Component } from 'react';
import {Card, CardText} from 'material-ui/Card';

import { FB } from './FbSdk';

export class PageDetails extends Component {

  state = {
    posts: []
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.selectedPage || this.props.selectedPage.id !== nextProps.selectedPage.id)
      this.getPosts(nextProps.selectedPage);
  }

  getPosts(page) {
    const { id } = page;
    FB.api(`/${id}/promotable_posts`, (response) => {
      this.setState({...this.state, posts: response.data})
    })
  }

  render() {
    const { selectedPage } = this.props;
    const { posts } = this.state;
    return (
      <div style={{display: 'inline-block', width: '80%'}}>
        {
          selectedPage === null ?
          <Card>
            <CardText>
              No page selected. Please select a page from the list to the left.
            </CardText>
          </Card> :
          posts.map(post => (
            <Card key={post.id}>
              <CardText>
                {post.message}
              </CardText>
            </Card>
          ))
        }
      </div>
    );
  }
}
