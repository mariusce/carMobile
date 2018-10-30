import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Modal from "react-native-modal";
import {
  Container, Content, Fab,
  View, Text, Flatlist, Icon,
  Button, List, ListItem,
  Left, Thumbnail, Body, Label, Input, Item, Toast,
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


class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      modalVisible: 0,
      contactIndex: 0,
      carNumber: '',
      carNumberValid: true
    };
    this._onChangeTextInput = onChangeTextInput.bind(this);
  }

  componentDidMount() {
    this._getContacts();
  }

  _getContacts = () => {
    let query = undefined;
    store.getState().authentication.user.contacts.forEach(function (contact) {
      if (!query) { query = '?'; }
      query = query.concat('carNumber[$in]=' + contact, '&');
    });
    if (query) {
      query.slice(0, -1); // remove last &
      this.props.dispatch(getUsers(query));
    }
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

    let query ='?carNumber[$in]=' + this.state.carNumber;
    this.props.dispatch(getUsers(query, (error, json) => {
      if (!error && json && json.total > 0) {
        let contacts = store.getState().authentication.user.contacts;
        contacts.push(this.state.carNumber);
        this.props.dispatch(
          updateUser({"contacts": contacts}, (error, json) => {
              this._setModal(0,0);
              this._getContacts();
              if (error) {
                Toast.show({
                  text: errorCodeToText(json),
                  buttonText: "Okay",
                  type: "danger",
                  duration: 3000
                });
          }
        }));
      }
      else if (!error && json && json.total === 0){
        this._setModal(0,0);
        this._getContacts();
        Toast.show({
          text: 'User not found!',
          buttonText: "Okay",
          type: "warning",
          duration: 3000
        });
      }
      else {
        this._setModal(0,0);
        this._getContacts();
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
      contacts.push(
        <ListItem avatar key={'contact_' + index} onPress={() => {
          this._setModal(index, 1);
        }}>
          <Left>
            <Thumbnail source={{uri: 'https://picsum.photos/200/300/?image=73'}}/>
          </Left>
          <Body>
            <Text>{contact.firstName} {contact.lastName}</Text>
            <Text style={styles.propertyText}>{contact.carNumber}</Text>
          </Body>
        </ListItem>
      );
    });

    let viewContactModal = [];
    if (this.props && this.props.contacts && this.props.contacts.length > 0) {
      let currentContact = this.props.contacts[this.state.contactIndex];
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
            <Text/>
            <Text>Full name</Text>
            <Text style={styles.propertyText}>{currentContact.firstName} {currentContact.lastName}</Text>
            <Text/><Text/><Text/><Text/>
            <View style={styles.message}>
              <Button onPress={() => {
                this._setModal(this.state.contactIndex, 0)
              }}>
                <Text>send message</Text>
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
  const {
    data,
    isFetching
  } = state.users;
  return {
    contacts: data || [],
    isFetching
  };
}

export default connect(mapStateToProps)(Contacts);
