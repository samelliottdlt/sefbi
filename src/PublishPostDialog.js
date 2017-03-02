import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import TimePicker from 'material-ui/TimePicker';

import { FB } from './FbSdk';

export class PublishPostDialog extends React.Component {
  state = {
    open: false,
    posting: false,
    isScheduled: false
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false, isScheduled: false, postText: '', time: null, date: null});
  };

  dateChange = (event, date) => {
    this.setState({
      date: date,
    });
  };

  timeChange = (event, date) => {
    this.setState({
      time: date,
    });
  };

  handleRequestClose() {
    this.setState({...this.state, missingInfo: false})
  }

  textChange = (event) => {
    this.setState({
      postText: event.target.value,
    });
  };

  createPost() {
    const { id, access_token } = this.props.page;
    this.setState({...this.state, posting: true});
    const {time, date, postText} = this.state;

    const timeToPublish = new Date(date);
    timeToPublish.setHours(time.getHours());
    timeToPublish.setHours(time.getMinutes());

    const unixTimestamp = timeToPublish.getTime() / 1000;

    const options = {
      access_token: access_token,
      message: postText,
      published: !this.state.isScheduled
    };

    if(this.state.isScheduled) options.scheduled_publish_time = unixTimestamp;

    FB.api(`/${id}/feed`, 'POST', options, (res) => {
      this.props.updatePosts();
      this.handleClose();
      this.setState({...this.state, posting: false});
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Create"
        primary={true}
        disabled={
          (!this.state.isScheduled && (!this.state.postText || this.state.postText.length === 0)) ||
          (this.state.isScheduled && (!this.state.date || !this.state.time))
        }
        onTouchTap={() => this.createPost()}
      />,
    ];

    const { posting } = this.state;

    return (
      <div>
        <Dialog
          title="Create Post"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <Toggle
            style={{width: '20%'}}
            label="Scheduled"
            onToggle={(_, isInputChecked) => this.setState(
              {
                ...this.state,
                isScheduled: isInputChecked,
                time: null,
                date: null
              }
            )}
          />
          {
            posting ? <CircularProgress size={80} thickness={5} style={{display: 'block', margin: 'auto'}}/> :
            <TextField
              hintText="Write something..."
              multiLine={true}
              style={{width: '100%'}}
              onChange={this.textChange}
            />
          }
          {
            this.state.isScheduled &&
            <div>
              <DatePicker hintText="Select Date" onChange={this.dateChange} />
              <TimePicker
                hintText="Select Time"
                onChange={this.timeChange}
              />
            </div>
          }
        </Dialog>
      </div>
    );
  }
}
