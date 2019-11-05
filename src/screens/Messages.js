import React, {Component} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {
  Container,
  Content,
  View,
  Text,
  StyleProvider,
  Icon,
  Button,
  Fab,
  Item,
  Input,
  Textarea,
  Form,
  ListItem, Left, Right, Thumbnail, Body, List, Toast
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import platform from '../../native-base-theme/variables/platform';
import Modal from "react-native-modal";
import {onChangeTextInput} from '../helpers/input';
import Feather from 'react-native-vector-icons/Feather';
import _ from 'lodash';
import {store} from '../store/configureStore';
import moment from 'moment';
import {getUsers, updateUser} from '../actions/users';
import {errorCodeToText} from '../helpers/utils';
import {getAuthenticatedUser} from '../actions/authentication';
import * as firebase from 'react-native-firebase';
import {Notification, NotificationOpen} from "react-native-firebase";


class Messages extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      modalVisible: 0,
      carNumber: '',
      carNumberValid: true,
      message: '',
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getAuthenticatedUser((error, json) => {
      if (error) {
        this.props.navigation.navigate('Auth');
      }
    }));

    // On notification received when App opened create notification and display it
    this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      notification.android.setChannelId('message-channel')
        .setNotificationId(notification.data.sender)
        .setTitle('Car Mate')
        .setBody(notification.data.message)
        .setData({
          sender: notification.data.sender,
          message: notification.data.message
        });
      firebase.notifications().displayNotification(notification);
    });
    // Listen for a Notification being opened: App in Foreground and background
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      firebase.notifications().removeAllDeliveredNotifications(/*notification.data.sender*/);
      this.props.navigation.navigate('Chat', {carNumber: _.toUpper(notification.data.sender)});
    });
  }

  componentWillUnMount() {
    this.removeNotificationListener();
    this.notificationOpenedListener();
  }

  _setModal = (visible) => {
    let state = Object.assign({}, this.state);
    state.modalVisible = visible;
    this.setState(state);
  };

  _goToChat = (carNumber) => {
    this.props.navigation.navigate('Chat', {carNumber: carNumber});
  };

  _onPressOpenChat = () => {
    let state = Object.assign({}, this.state);
    if (!this.state.carNumber || this.state.carNumber.length < 6) {
      state.carNumberValid = false;
      this.setState(state);
      return;
    }
    let query ='?carNumber[$in]=' + this.state.carNumber;
    this.props.dispatch(getUsers(query, (error, json) => {
      if (!error && json && json.total > 0) {
        this.props.navigation.navigate('Chat', {carNumber: this.state.carNumber});
      }
      else if (!error && json && json.total === 0){
        this._setModal(0);
        Toast.show({
          text: 'User not found!',
          buttonText: "Okay",
          type: "warning",
          duration: 3000
        });
      }
      else {
        this._setModal(0);
        Toast.show({
          text: errorCodeToText(json),
          buttonText: "Okay",
          type: "danger",
          duration: 3000
        });
      }
    }));
  };

  render() {
    let contacts = [];
    this.props.contacts.forEach((contact, index) => {
      if (contact) {
        contacts.push(
          <ListItem avatar key={'contact_' + index} onPress={() => {
            this._goToChat(contact.carNumber);
          }}>
            <Left>
              <Thumbnail source={{uri: 'https://picsum.photos/200/300/?image=73'}}/>
            </Left>
            <Body>
            <Text style={styles.propertyText}>{contact.carNumber}</Text>
            <Text>{contact.messages && (contact.messages.length > 0) && _.first(contact.messages).text}</Text>
            </Body>
            <Right>
              <Text note>{contact && contact.messages && (contact.messages.length > 0) &&
              moment(_.first(contact.messages).createdAt).fromNow()}</Text>
            </Right>
          </ListItem>
        );
      }
    });

    let newMessageModal =
          <Modal
            isVisible={this.state.modalVisible === 1}
            onBackdropPress={() => {
              this._setModal(0)
            }}
            animationIn="zoomIn"
            animationOut="zoomOut">
            <View style={styles.modalContent}>
              <Item error={!this.state.carNumberValid} rounded>
                <Icon type="Ionicons" active name='car' />
                <Input onChangeText={text => this._onChangeTextInput('carNumber', text)} placeholder="license plate"/>
                {!this.state.carNumberValid && <Icon type="Ionicons" name='close-circle' />}
              </Item>
              <Text/><Text/>
              <View style={styles.message}>
                <Button onPress={() => {this._onPressOpenChat()}}>
                  <Text>chat</Text>
                </Button>
              </View>
            </View>
          </Modal>;


    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <List>
            {contacts}
          </List>
          <View style={styles.container}>
            {newMessageModal}
          </View>
          <View>
            <Fab
              active={false}
              direction="up"
              containerStyle={{ }}
              style={{ backgroundColor: platform.brandPrimary }}
              position="bottomRight"
              onPress={() => this._setModal(1)}>
              <Feather name="plus" size={40}/>
            </Fab>
          </View>
        </Content>
      </Container>
    );
  }
}


Messages.propTypes = {
  headerTitle: PropTypes.string,
};

Messages.defaultProps = {
  headerTitle: 'Messages'
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  propertyText: {
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  message: {
    justifyContent: "center",
    alignItems: "center",
    color: platform.inactiveTintColor
  },
  messageText: {
    fontSize: 18,
  },
});

function mapStateToProps(state) {
  const data = state.authentication && state.authentication.user && state.authentication.user.contacts;
  const isFetching = state.authentication && state.authentication.isFetching;
  return {
    contacts: data || [],
    isFetching: isFetching
  };
}

export default connect(mapStateToProps)(Messages);
