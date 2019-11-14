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
  ListItem, Right, Left, Body, Icon, Item, Input, Button, Form, Label, List
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import {getAuthenticatedUser, login} from '../actions/authentication';
import {updateUser} from '../actions/users';
import * as firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import {Gravatar} from 'react-native-gravatar';
import Modal from "react-native-modal";
import {onChangeTextInput} from '../helpers/input';
import platform from '../../native-base-theme/variables/platform';
import {EMAIL_REGEX} from '../constants';
import {errorCodeToText} from '../helpers/utils';

let processedInitialNotification = false;

class Home extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      modalNameVisible: 0,
      modalEmailVisible: 0,
      modalPhoneVisible: 0,
      modalPasswordVisible: 0,
      emailValid: true,
      oldPassOk: true,
      newPassOk: true,
      passwordsMatch: true
    };

    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

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

  _onPressSave = (option) => {
    switch (option) {
      case 'name':
        this.props.dispatch(
          updateUser({
            "firstName": this.state.firstName || this.props.user.firstName,
            "lastName":  this.state.lastName || this.props.user.lastName
          }, (error, json) => {
            if (error) {
              console.log('Failed to update user name for ' + this.props.user.carNumber);
            } else {
              this.props.user.firstName = json.firstName;
              this.props.user.lastName  = json.lastName;
              this.forceUpdate();
            }
          })
        );
        this._setModal(0, option);
        break;
      case 'email':
        let state = Object.assign({}, this.state);
        if (this.state.email && !EMAIL_REGEX.test(String(this.state.email).toLowerCase())) {
          state.emailValid = false;
          this.setState(state);
          return;
        }
        this.props.dispatch(
          updateUser({"email": this.state.email}, (error, json) => {
            if (error) {
              console.log('Failed to update user email for ' + this.props.user.carNumber);
            } else {
              this.props.user.email = json.email;
              this.forceUpdate();
            }
          })
        );
        this._setModal(0, option);
        break;
      case 'phone':
        this.props.dispatch(
          updateUser({"phone": this.state.phone}, (error, json) => {
            if (error) {
              console.log('Failed to update user phone for ' + this.props.user.carNumber);
            } else {
              this.props.user.phone = json.phone;
              this.forceUpdate();
            }
          })
        );
        this._setModal(0, option);
        break;
      case 'password':
        const data = {
          id: this.props.user.carNumber,
          secret: this.state.password,
          method: 'password'
        };
        let state2 = Object.assign({}, this.state);
        this.props.dispatch(login(data, (error, json) => {
          state2.oldPassOk = !error;
          state2.newPassOk      = !!(this.state.passwordNew && this.state.passwordNew.length >= 4);
          state2.passwordsMatch = this.state.passwordNew === this.state.passwordCheck;
          this.setState(state2);
          if (!state2.oldPassOk || !state2.newPassOk || !state2.passwordsMatch)
            return;

          const data = {
            carNumber: this.props.user.carNumber,
            password: this.state.password,
            newPassword: this.state.passwordNew,
          };
          this.props.dispatch(updateUser(data, (error, json) => {
            if (!error) {
              this._setModal(0, option);
            } else {
              Toast.show({
                text: errorCodeToText(json),
                buttonText: "Okay",
                type: "danger",
                duration: 3000
              });
            }
          }));
        }));

        break;
    }
  };

  _setModal = (visible, option) => {
    let state = Object.assign({}, this.state);
    switch (option) {
      case 'name':
        state.modalNameVisible = visible;
        break;
      case 'email':
        state.modalEmailVisible = visible;
        break;
      case 'phone':
        state.modalPhoneVisible = visible;
        break;
      case 'password':
        state.modalPasswordVisible = visible;
        break;
    }

    this.setState(state);
  };

  render() {

    let modalUpdateName =
          <Modal
            isVisible={this.state.modalNameVisible === 1}
            onBackdropPress={() => {
              this._setModal(0, 'name')
            }}
            animationIn="zoomIn"
            animationOut="zoomOut">
            <View style={styles.modalContent}>
              <Form>
                <Item stackedLabel>
                  <Label>First Name</Label>
                  <Input onChangeText={text => this._onChangeTextInput('firstName', text)}>{this.props.user.firstName}</Input>
                </Item>
                <Text/>
                <Item stackedLabel last>
                  <Label>Last Name</Label>
                  <Input onChangeText={text => this._onChangeTextInput('lastName', text)}>{this.props.user.lastName}</Input>
                </Item>

                <Text/><Text/>
                <View style={styles.saveButton}>
                  <Button onPress={() => {this._onPressSave('name')}}>
                    <Text>Save</Text>
                  </Button>
                </View>
              </Form>
            </View>
          </Modal>;

    let modalUpdateEmail =
          <Modal
            isVisible={this.state.modalEmailVisible === 1}
            onBackdropPress={() => {
              this._setModal(0, 'email');
            }}
            animationIn="zoomIn"
            animationOut="zoomOut">
            <View style={styles.modalContent}>
              <Form>
                <Item stackedLabel error={!this.state.emailValid}>
                  <Label>Email</Label>
                  <Input onChangeText={text => this._onChangeTextInput('email', text)}>{this.props.user.email}</Input>
                </Item>
                <Text/><Text/>
                <View style={styles.saveButton}>
                  <Button onPress={() => {this._onPressSave('email')}}>
                    <Text>Save</Text>
                  </Button>
                </View>
              </Form>
            </View>
          </Modal>;

    let modalUpdatePhone =
          <Modal
            isVisible={this.state.modalPhoneVisible === 1}
            onBackdropPress={() => {
              this._setModal(0, 'phone');
            }}
            animationIn="zoomIn"
            animationOut="zoomOut">
            <View style={styles.modalContent}>
              <Form>
                <Item stackedLabel>
                  <Label>Phone</Label>
                  <Input onChangeText={text => this._onChangeTextInput('phone', text)}>{this.props.user.phone}</Input>
                </Item>
                <Text/><Text/>
                <View style={styles.saveButton}>
                  <Button onPress={() => {this._onPressSave('phone')}}>
                    <Text>Save</Text>
                  </Button>
                </View>
              </Form>
            </View>
          </Modal>;

    let modalUpdatePassword =
          <Modal
            isVisible={this.state.modalPasswordVisible === 1}
            onBackdropPress={() => {
              this._setModal(0, 'password')
            }}
            animationIn="zoomIn"
            animationOut="zoomOut">
            <View style={styles.modalContent}>
              <Form>
                <Item stackedLabel error={!this.state.oldPassOk}>
                  <Label>Old Password</Label>
                  <Input onChangeText={text => this._onChangeTextInput('password', text)} />
                </Item>
                <Text/>
                <Item stackedLabel error={!this.state.newPassOk}>
                  <Label>New Password</Label>
                  <Input onChangeText={text => this._onChangeTextInput('passwordNew', text)} />
                </Item>
                <Text/>
                <Item stackedLabel last error={!this.state.passwordsMatch}>
                  <Label>Confirm New Password</Label>
                  <Input onChangeText={text => this._onChangeTextInput('passwordCheck', text)} />
                </Item>

                <Text/><Text/>
                <View style={styles.saveButton}>
                  <Button onPress={() => {this._onPressSave('password')}}>
                    <Text>Save</Text>
                  </Button>
                </View>
              </Form>
            </View>
          </Modal>;

    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <View style={styles.image}>
            {/*<Thumbnail large source={{uri: 'https://picsum.photos/200/300/?image=1005'}} />*/}
            <Gravatar options={{
              email: this.props.user.email,
              parameters: { "size": "200", "d": "mm" },
              secure: true
            }} style={styles.roundedProfileImage}/>
          </View>
          <List style={styles.details}>
            <ListItem>
              <Left ><Text>License plate</Text></Left>
              <Body><Text style={styles.propertyText}>{this.props.user.carNumber}</Text></Body>
            </ListItem>
            <ListItem>
              <Left ><Text>Full name</Text></Left>
              <Body><Text style={styles.propertyText}>{this.props.user.firstName} {this.props.user.lastName}</Text></Body>
              <Right><Icon type="Ionicons" active name='create' onPress={() => {
                this._setModal(1, 'name');}}/></Right>
            </ListItem>
            <ListItem>
              <Left><Text >Email</Text></Left>
              <Body><Text style={styles.propertyText}>{this.props.user.email}</Text></Body>
              <Right><Icon type="Ionicons" active name='create' onPress={() => {
                this._setModal(1, 'email');}}/></Right>
            </ListItem>
            <ListItem>
              <Left><Text >Phone</Text></Left>
              <Body><Text style={styles.propertyText}>{this.props.user.phone}</Text></Body>
              <Right><Icon type="Ionicons" active name='create' onPress={() => {
                this._setModal(1, 'phone');}}/></Right>
            </ListItem>
          </List>
          <View style={styles.changePassButton}>
            <Button  onPress={() => {this._setModal(1, 'password')}}>
              <Text>Change password</Text>
            </Button>
          </View>
          <View>
            {modalUpdateName}
          </View>
          <View>
            {modalUpdateEmail}
          </View>
          <View>
            {modalUpdatePhone}
          </View>
          <View>
            {modalUpdatePassword}
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
    margin: 5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedProfileImage: {
    width:100, height:100, borderWidth:3,
    borderColor:'white', borderRadius:50
  },
  details: {
    flex: 3,
  },
  propertyText: {
    fontWeight: 'bold'
  },
  modalContent: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  saveButton: {
    // justifyContent: "center",
    // alignItems: "center",
    color: platform.inactiveTintColor
  },
  changePassButton: {
    justifyContent: "center",
    alignItems: "center",
    color: platform.inactiveTintColor
  },
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
