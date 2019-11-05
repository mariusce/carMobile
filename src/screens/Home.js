import React, {Component} from 'react';
import _ from 'lodash';
import {StyleSheet, Image} from 'react-native';
import {
  Container,
  Content,
  View,
  Text,
  Flatlist,
  Thumbnail,
  Toast,
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import {getAuthenticatedUser} from '../actions/authentication';
import {updateUser} from '../actions/users';
import * as firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';

let processedInitialNotification = false;

class Home extends Component {

  componentDidMount() {
    this.props.dispatch(getAuthenticatedUser((error, json) => {
      if (error) {
        this.props.navigation.navigate('Auth');
      }
    }));

    // check/require permissions
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          console.log ("user has permissions");
        } else {
          // user doesn't have permission
          firebase.messaging().requestPermission()
            .then(() => {
              // User has authorised
              console.log ("user has authorised");
            })
            .catch(error => {
              // User has rejected permissions
              console.log ("user has rejected permissions");
            });
        }
      });

      // Build notifications channel
      const channel = new firebase.notifications.Android.Channel('message-channel', 'Message Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('Channel to use for messaging');

      // Create the channel
      firebase.notifications().android.createChannel(channel);
      console.log('notifications channel created!');

      // process notification received when App is closed
      if (!processedInitialNotification) {
        firebase.notifications().getInitialNotification()
          .then((notificationOpen: NotificationOpen) => {
            if (notificationOpen) {
              // App was opened by a notification
              // Get the action triggered by the notification being opened
              const action                     = notificationOpen.action;
              // Get information about the notification that was opened
              const notification: Notification = notificationOpen.notification;
              processedInitialNotification = true;
              // navigate to chat view
              this.props.navigation.navigate('Chat', {carNumber: _.toUpper(notification.data.sender)});
            }
          });
      }

      // On notification received when App opened create notification and display it
      this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // Process your notification as required
        notification.android.setChannelId('message-channel')
          .setNotificationId(notification.notificationId)
          .setTitle(_.toUpper(notification.data.sender))
          .setBody(notification.data.message)
          .setData({
            sender: notification.data.sender,
            message: notification.data.message
          });
        console.log('created notification: ' + JSON.stringify(notification.data));
        return firebase.notifications().displayNotification(notification);
      });

      // Listen for a Notification being opened: App in Foreground and background (not closed)
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        firebase.notifications().removeAllDeliveredNotifications(/*notification.data.sender*/);
        // navigate to chat view
        this.props.navigation.navigate('Chat', {carNumber: _.toUpper(notification.data.sender)});
      });

      // Retrieve the current registration token
      this._getDeviceRegistrationToken();
      // Monitor token generation
      this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        // Process your token as required
        if (!this.props.user.fcmToken || (this.props.user.fcmToken  !== fcmToken)) {
          // send user token to server. It will be used to send notifications to the client device
          this.props.user.fcmToken = fcmToken;
          this.props.dispatch(
            updateUser({"fcmToken": fcmToken}, (error, json) => {
              if (error) {
                console.log('Failed to save fcmToken for user ' + this.props.user.carNumber);
              } else {
                console.log('Save fcmToken for user ' + this.props.user.carNumber);
              }
            }));
        }
      });
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.notificationOpenedListener();
    this.removeNotificationListener();
  }


  _getDeviceRegistrationToken = () => {
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          console.log('got token: ' + JSON.stringify(fcmToken));
          if (!this.props.user.fcmToken || (this.props.user.fcmToken  !== fcmToken)) {
            // send user token to server. It will be used to send notifications to the client device
            this.props.user.fcmToken = fcmToken;
            this.props.dispatch(
              updateUser({"fcmToken": fcmToken}, (error, json) => {
                if (error) {
                  console.log('Failed to save fcmToken for user ' + this.props.user.carNumber);
                } else {
                  console.log('Save fcmToken for user ' + this.props.user.carNumber);
                }
              }));
          }
        } else {
          // user doesn't have a device token yet
          console.log('the user has no device token ');
        }
      });
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <View style={styles.image}>
            <Thumbnail large source={{uri: 'https://picsum.photos/200/300/?image=1005'}} />
          </View>
          <View style={styles.details}>
            <Text >License plate</Text>
            <Text style={styles.propertyText}>{this.props.user.carNumber}</Text>
            <Text/><Text/>
            <Text >Full name</Text>
            <Text style={styles.propertyText}>{this.props.user.firstName} {this.props.user.lastName}</Text>
            <Text/><Text/>
            <Text >Email</Text>
            <Text style={styles.propertyText}>{this.props.user.email}</Text>
            <Text/><Text/>
            <Text >Phone</Text>
            <Text style={styles.propertyText}>{this.props.user.phone}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

Home.propTypes = {
  headerTitle: PropTypes.string,
  user: PropTypes.object,
  isFetching: PropTypes.bool,
};

Home.defaultProps = {
  headerTitle: 'Home',
  user: {},
  isFetching: false,
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 3,
    margin: 20
  },
  propertyText: {
    fontWeight: 'bold'
  }
});

function mapStateToProps(state) {
  const data = state.authentication && state.authentication.user;
  const isFetching = state.authentication && state.authentication.isFetching;
  return {
    user: data || {},
    isFetching: isFetching
  };
}

export default connect(mapStateToProps)(Home);
