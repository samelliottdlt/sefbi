import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Card, CardText, CardMedia} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import { FB } from './FbSdk';
import { PublishPostDialog } from './PublishPostDialog';

export class PageDetails extends Component {

  state = {
    posts: [],
    fetchingPosts: false
  }

  showPublished = true;

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedPage) return;
    if(!this.props.selectedPage || this.props.selectedPage.id !== nextProps.selectedPage.id) {
      this.setState({...this.state, fetchingPosts: true});
      this.getPosts(nextProps.selectedPage);
    }
  }

  getPosts(page) {
    const { id } = page;
    FB.api(`/${id}/promotable_posts?is_published=${this.showPublished}`, 'GET',
    {"fields":"full_picture,created_time,message,scheduled_publish_time"}, (response) => {
      this.setState({...this.state, posts: response.data, fetchingPosts: false}, () => {
        this.state.posts.forEach((post, i) => {
          FB.api(`/${id}/insights?metric=post_impressions_unique`,'GET', {
            access_token: page.access_token
          }, response => {
              const { posts } = this.state;
              posts[i].views = response.data.length ? response.data[0].values[0].value : 'Unable to get post views';
              this.setState({...this.state, posts: posts});
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
    const { posts, fetchingPosts } = this.state;
    const radioStyles = {
      display: 'inline-block',
      width: '10em',
      verticalAlign: 'middle'
    }
    return (
      <div style={{width: '80%', marginLeft: '20%'}}>
        <PublishPostDialog
          page={selectedPage}
          ref={(dialog) => this.dialog = dialog}
          updatePosts={() => this.getPosts(selectedPage)}
        />
        <div style={{ width: '442px', margin: 'auto', marginBottom: '1.5em'}}>
          <RadioButtonGroup name="PublishStatus" defaultSelected="Published"
            onChange={(e, value) => this.togglePosts(value)}
            style={{display: 'inline-block'}}
          >
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
          <RaisedButton label="Create Post" primary={true} style={{display: 'inline-block'}}
            disabled={selectedPage === null}
            onClick={() => this.dialog.handleOpen()}/>
        </div>
        <div style={{width: '450px', margin: 'auto'}}>
          {
            selectedPage === null ?
            <div style={{marginTop: '3em'}}>
                No page selected. Please select a page from the list to the left.
            </div> :
            posts.length ?
              posts.map(post => (
                <Card key={post.id} style={{marginBottom: '1em'}}>
                  <CardText>
                    {
                      post.scheduled_publish_time ?
                      "Scheduled to publish on " + new Date(post.scheduled_publish_time * 1000).toDateString() :
                      "Created on " + new Date(post.created_time).toDateString()
                    }
                  </CardText>
                  <Divider />
                  <CardText>
                    {post.message}
                  </CardText>
                  {
                    post.full_picture &&
                    <CardMedia>
                      <img src={post.full_picture} alt='Post' />
                    </CardMedia>
                  }
                  {
                    post.views && this.showPublished ?
                    <div>
                      <Divider />
                      <CardText style={{color: 'grey'}}>
                        {post.views}
                      </CardText>
                    </div> :
                    null
                  }
                </Card>
            )) :
            fetchingPosts ?
            <CircularProgress size={80} thickness={5} /> :
            <div style={{marginTop: '3em', textAlign: 'center'}}>
                No posts to show.
            </div>
          }
        </div>
      </div>
    );
  }
}
