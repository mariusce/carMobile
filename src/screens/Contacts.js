import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Modal from "react-native-modal";
import {
  Container, Content, Fab,
  View, Text, Flatlist, Icon,
  Button, List, ListItem,
  Left, Right, Thumbnail, Body, Label, Input, Item, Toast,
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import {getUsers, updateUser} from '../actions/users';
import platform from '../../native-base-theme/variables/platform';
import Feather from 'react-native-vector-icons/Feather';
import {onChangeTextInput} from '../helpers/input';
import {errorCodeToText} from '../helpers/utils';
import {store} from '../store/configureStore';
import _ from 'lodash';
import moment from 'moment';
import {getAuthenticatedUser} from '../actions/authentication';


class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      modalVisible: 0,
      contactIndex: 0,
      carNumber: '',
      carNumberValid: true
    };
    // this.contacts = [];
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  componentDidMount() {
    this._getAuthenticatedUser();
  }

  _getAuthenticatedUser = () => {
    this.props.dispatch(getAuthenticatedUser((error, json) => {
      if (error) {
        this.props.navigation.navigate('Auth');
      }
    }));
  };

  _goToChat = (carNumber) => {
    this._setModal(0,0);
    this.props.navigation.navigate('Chat', {carNumber: carNumber});
  };

  _setModal = (index, visible) => {
    let state = Object.assign({}, this.state);
    state.modalVisible = visible;
    state.contactIndex = index;
    this.setState(state);
  };

  _onPressAddContact = () => {
    // validate inputs
    let state = Object.assign({}, this.state);
    if (!this.state.carNumber || this.state.carNumber.length < 6) {
      state.carNumberValid = false;
      this.setState(state); return;
    }
    let contacts = this.props && this.props.user && this.props.user.contacts;
    let contactAlreadyAdded = _.find(contacts, {'carNumber': this.state.carNumber});
    if (!contactAlreadyAdded && (this.props.user !== this.state.carNumber)) {
      let query = '?carNumber[$in]=' + this.state.carNumber;
      this.props.dispatch(getUsers(query, (error, json) => {
        if (!error && json && json.total > 0) {
          contacts.push({carNumber: this.state.carNumber});
          this.props.dispatch(
            updateUser({"contacts": contacts}, (error, json) => {
              if (error) {
                Toast.show({
                  text:       errorCodeToText(json),
                  buttonText: "Okay",
                  type:       "danger",
                  duration:   3000
                });
              } else {
                this._getAuthenticatedUser();
              }
            }));
        }
        else if (!error && json && json.total === 0) {
          Toast.show({
            text:       'User not found!',
            buttonText: "Okay",
            type:       "warning",
            duration:   3000
          });
        }
        else {
          Toast.show({
            text:       errorCodeToText(json),
            buttonText: "Okay",
            type:       "danger",
            duration:   3000
          });
        }
      }));
    }
    this._setModal(0, 0);
  };

  render() {
    let contacts = [];
    this.props && this.props.user && this.props.user.contacts.forEach((contact, index) => {
      contacts.push(
        <ListItem avatar key={'contact_' + index} onPress={() => {
          this._setModal(index, 1);
        }}>
          <Left>
            <Thumbnail source={{uri: 'https://picsum.photos/200/300/?image=73'}}/>
          </Left>
          <Body>
            <Text style={styles.propertyText}>{contact && contact.carNumber}</Text>
            <Text >{'available'}</Text>
          </Body>
          <Right>
            <Text note>{contact && contact.messages && (contact.messages.length > 0) &&
              moment(_.first(contact.messages).createdAt).fromNow()}</Text>
          </Right>
        </ListItem>
      );
    });

    let viewContactModal = [];
    if (this.props && this.props.user && this.props.user.contacts && this.props.user.contacts.length > 0) {
      let currentContact = this.props.user.contacts[this.state.contactIndex];
      viewContactModal   =
        <Modal
          isVisible={this.state.modalVisible === 1}
          onBackdropPress={() => {
            this._setModal(this.state.contactIndex, 0)
          }}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.modalContent}>
            <Thumbnail large source={{uri: 'https://picsum.photos/200/300/?image=1005'}}/>
            <Text/><Text/>
            <Text>License plate</Text>
            <Text style={styles.propertyText}>{currentContact.carNumber}</Text>
            <Text/><Text/><Text/><Text/>
            <View style={styles.message}>
              <Button onPress={() => {this._goToChat(currentContact.carNumber)}}>
                <Text>chat</Text>
              </Button>
            </View>
          </View>
        </Modal>;
    }

    let newContactModal =
      <Modal
        isVisible={this.state.modalVisible === 2}
        onBackdropPress={() => {
          this._setModal(this.state.contactIndex, 0)
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
            <Button onPress={() => {this._onPressAddContact()}}>
              <Text>add contact</Text>
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
            {viewContactModal}
          </View>
          <View style={styles.container}>
            {newContactModal}
          </View>
          <View>
            <Fab
              active={false}
              direction="up"
              containerStyle={{ }}
              style={{ backgroundColor: platform.brandPrimary }}
              position="bottomRight"
              onPress={() => this._setModal(0, 2)}>
              <Feather name="plus" size={40}/>
            </Fab>
          </View>
        </Content>
      </Container>
    );
  }
}


Contacts.propTypes = {
  headerTitle: PropTypes.string,
};

Contacts.defaultProps = {
  headerTitle: 'Contacts',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  propertyText: {
    fontWeight: 'bold'
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

export default connect(mapStateToProps)(Contacts);
