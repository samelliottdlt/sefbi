import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Card, CardText} from 'material-ui/Card';

import { FB } from './FbSdk';

export class PageDetails extends Component {

  state = {
    posts: []
  }

  showPublished = true;

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedPage) return;
    if(!this.props.selectedPage || this.props.selectedPage.id !== nextProps.selectedPage.id)
      this.getPosts(nextProps.selectedPage);
  }

  getPosts(page) {
    const { id } = page;
    FB.api(`/${id}/promotable_posts?is_published=${this.showPublished}`, (response) => {
      this.setState({...this.state, posts: response.data}, () => {
        this.state.posts.forEach((post) => {
          FB.api(`/${id}/insights?metric=page_posts_impressions`, response => {
            console.log(response);
          })
        })
      });
    })
  }

  togglePosts(value) {
    this.showPublished = value === 'Published';
    if(this.props.selectedPage) this.getPosts(this.props.selectedPage);
  }

  render() {
    const { selectedPage } = this.props;
    const { posts } = this.state;
    const radioStyles = {
      display: 'inline-block',
      width: '10em'
    }
    return (
      <div style={{width: '80%', marginLeft: '20%'}}>
        <div style={{marginBottom: '1.3em'}}>
          <RadioButtonGroup name="PublishStatus" defaultSelected="Published"
            onChange={(e, value) => this.togglePosts(value)}>
            <RadioButton
              value="Published"
              label="Published"
              style={radioStyles}
            />
            <RadioButton
              value="Unpublished"
              label="Unpublished"
              style={radioStyles}
            />
          </RadioButtonGroup>
        </div>
        <div>
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
      </div>
    );
  }
}
