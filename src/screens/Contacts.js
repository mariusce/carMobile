import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Modal from "react-native-modal";
import {
  Container,
  Content,
  View,
  Text,
  Flatlist,
  Button,
  List, ListItem,
  Left,
  Thumbnail, Body,
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import {getUsers} from '../actions/users';
import platform from '../../native-base-theme/variables/platform';


class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      isModalVisible: false,
      contactIndex: 0
    };
  }

  componentDidMount() {
    let query = undefined;
    this.props.contactIds.forEach(function (contact) {
      if (!query) { query = '?'; }
      query = query.concat('carNumber[$in]=' + contact, '&');
    });
    if (query) {
      query.slice(0, -1); // remove last &
      this.props.dispatch(getUsers(query));
    }
  }

  _toggleModal = (index) => {
    let state = Object.assign({}, this.state);
    state.isModalVisible = !state.isModalVisible;
    state.contactIndex = index;
    this.setState(state);
  };

  render() {
    let contacts = [];
    this.props.contacts.forEach((contact, index) => {
      contacts.push(
        <ListItem avatar key={'contact_' + index} onPress={() => {
          this._toggleModal(index);
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
    let contactModal = [];
    if (this.props && this.props.contacts && this.props.contacts.length > 0) {
      let currentContact = this.props.contacts[this.state.contactIndex];
      contactModal   =
            <Modal
              isVisible={this.state.isModalVisible}
              onBackdropPress={() => {
                this._toggleModal(this.state.contactIndex)
              }}
              animationIn="zoomIn"
              animationOut="zoomOut">
              <View style={styles.modalContent}>
                <Thumbnail large source={{uri: 'https://picsum.photos/200/300/?image=1005'}}/>
                <Text/><Text/>
                <Text>License plate</Text>
                <Text style={styles.propertyText}>{currentContact.carNumber}</Text>
                <Text/><Text/>
                <Text>Full name</Text>
                <Text style={styles.propertyText}>{currentContact.firstName} {currentContact.lastName}</Text>
                <Text/><Text/><Text/><Text/>
                <View style={styles.message}>
                  <Button onPress={() => {
                    this._toggleModal(this.state.contactIndex)
                  }}>
                    <Text>send message</Text>
                  </Button>
                </View>
              </View>
            </Modal>;
    }


    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <List>
            {contacts}
          </List>
          <View style={styles.container}>
            {contactModal}
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
    margin: 10,
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
  const contactIds = state.authentication.user.contacts;
  return {
    contacts: data || [],
    contactIds: contactIds,
    isFetching
  };
}

export default connect(mapStateToProps)(Contacts);
