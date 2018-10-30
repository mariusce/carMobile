import React, {Component} from 'react';
import {StyleSheet, Image, TextInput} from 'react-native';
import {Container, Content, View, Text, StyleProvider, Icon, Button, Fab, Item, Input, Textarea, Form} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import xmldom from 'xmldom';
window.DOMParser = xmldom.DOMParser;
window.document = new DOMParser().parseFromString("<?xml version='1.0'?>", 'text/xml');
import '../../lib/strophe.js/strophe.js';
import {XMPP_DOMAIN, XMPP_WS_SERVICE_URI} from '../constants';
import platform from '../../native-base-theme/variables/platform';
import Feather from 'react-native-vector-icons/Feather';
import Modal from "react-native-modal";
import {onChangeTextInput} from '../helpers/input';
import {store} from '../store/configureStore';
import _ from 'lodash';

const Strophe = window.Strophe;
let connection = null;

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
    connection = new Strophe.Connection(XMPP_WS_SERVICE_URI);
    connection.rawInput = this._rawInput;
    connection.rawOutput = this._rawOutput;
    const jid = _.toLower(store.getState().authentication.user.carNumber) + '@' + XMPP_DOMAIN;
    const password = store.getState().authentication.chat;
    connection.connect(jid, password, this._onConnect);
  }

  componentWillUnmount() {
    connection.disconnect();
  }

  _setModal = (visible) => {
    let state = Object.assign({}, this.state);
    state.modalVisible = visible;
    this.setState(state);
  };

  _rawInput = (data) => {
    console.log('RECV: ' + data);
  };
  _rawOutput = (data) => {
    console.log('SENT: ' + data);
  };

  _sendMessage = (msg) => {
    let m = $msg({
      to: 'marius@marius.lan',
      from: 'marius@marius.lan',
      type: 'chat'
    }).c("body").t(msg);
    connection.send(m);
  };

  _onPressSendMessage = () => {
    let state = Object.assign({}, this.state);
    if (!this.state.carNumber || this.state.carNumber.length < 6) {
      state.carNumberValid = false;
      this.setState(state);
      return;
    }
    let message = $msg({
      to: _.toLower(this.state.carNumber) + '@' + XMPP_DOMAIN,
      from: connection.jid,
      type: 'chat'
    }).c("body").t(this.state.message);
    connection.send(message);
    this._setModal(0);
  };

  _onMessage = (msg) => {
    const to = msg.getAttribute('to');
    const from = msg.getAttribute('from');
    const type = msg.getAttribute('type');
    const elems = msg.getElementsByTagName('body');

    if (type === "chat" && elems.length > 0) {
      let body = elems[0];
      console.log('CHAT: I got a message from ' + from + ': ' + Strophe.getText(body));
    }
    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
  };

  _onSubscriptionRequest = (stanza) => {
    if (stanza.type === "subscribe") {
      var from = stanza.from;
      // log('onSubscriptionRequest: from=' + from);
      // Send a 'subscribed' notification back to accept the incoming
      // subscription request
      connection.send($pres({
        to: from,
        type: "subscribed"
      }));
    }
    return true;
  };

  _onPresence = (presence) => {
    // log('onPresence:');
    var presence_type = presence.type; // unavailable, subscribed, etc...
    var from = presence.from; // the jabber_id of the contact
    if (!presence_type) presence_type = "online";
    // log('	>' + from + ' --> ' + presence_type);
    if (presence_type !== 'error') {
      if (presence_type === 'unavailable') {
        // Mark contact as offline
      } else {
        // var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
        // if (show === 'chat' || show === '') {
        //   // Mark contact as online
        // } else {
        //   // etc...
        // }
      }
    }
    return true;
  };

  _onConnect = (status) => {
    if (status === Strophe.Status.CONNECTING) {
      console.log('Strophe is connecting.');
    } else if (status === Strophe.Status.CONNFAIL) {
      console.log('Strophe failed to connect.');
    } else if (status === Strophe.Status.DISCONNECTING) {
      console.log('Strophe is disconnecting.');
    } else if (status === Strophe.Status.DISCONNECTED) {
      console.log('Strophe is disconnected.');
    } else if (status === Strophe.Status.CONNECTED) {
      console.log('Strophe is connected.');
      console.log('ECHOBOT: Send a message to ' + connection.jid +  ' to talk to me.');
      // set presence
      connection.send($pres());
      // set handlers
      connection.addHandler(this._onMessage, null, 'message', null, null,  null);
      connection.addHandler(this._onSubscriptionRequest, null, "presence", "subscribe");
      connection.addHandler(this._onPresence, null, "presence");
    }
  };

  render() {
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
              <View>
                <TextInput style={styles.messageText}
                  multiline = {true} numberOfLines = {2}
                  onChangeText={text => this._onChangeTextInput('message', text)} placeholder="Hi! Your car is awesome!" />
              </View>
              <Text/><Text/>
              <View style={styles.message}>
                <Button onPress={() => {this._onPressSendMessage()}}>
                  <Text>send</Text>
                </Button>
              </View>
            </View>
          </Modal>;


    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
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
    margin: 10,
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
  return {};
}

export default connect(mapStateToProps)(Messages);
