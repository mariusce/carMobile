import React, {Component} from 'react';
import {StyleSheet, Image, TextInput, Platform} from 'react-native';
import {
  Container,
  Content,
  View,
  Text
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import xmldom from 'xmldom';
window.DOMParser = xmldom.DOMParser;
window.document = new DOMParser().parseFromString("<?xml version='1.0'?>", 'text/xml');
import '../../lib/strophe.js/strophe.js';
import {XMPP_DOMAIN, XMPP_WS_SERVICE_URI} from '../constants';
import platform from '../../native-base-theme/variables/platform';
import {store} from '../store/configureStore';
import _ from 'lodash';
import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
import CustomView from '../../lib/chat/CustomView';
import {updateUser} from '../actions/users';

const Strophe = window.Strophe;
let connection = null;

class Chat extends Component {

  constructor(props) {
    super(props);
    this.friendCarNumber = this.props.navigation.getParam('carNumber');
    this.friendHistory = {};
    this.carNumber = _.toLower(store.getState().authentication.user.carNumber);
    this.jid = this.carNumber + '@' + XMPP_DOMAIN;
    this.password = store.getState().authentication.chat;
    this.contacts = store.getState().authentication.user.contacts;
    this.state =  {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };
    this._isMounted = false;
    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    this.friendHistory = _.find(this.contacts, {'carNumber': this.friendCarNumber});
    this.setState(() => {
      return {
        // messages: require('../../lib/chat/messages.js'),
        messages: this.friendHistory && this.friendHistory.messages || []
      };
    });
  }

  componentDidMount() {
    connection = new Strophe.Connection(XMPP_WS_SERVICE_URI);
    connection.rawInput = this._rawInput;
    connection.rawOutput = this._rawOutput;
    connection.connect(this.jid, this.password, this._onConnect);
  }

  componentWillUnmount() {
    connection.disconnect();
    this._isMounted = false;
    let contacts = _.unionBy([{carNumber: this.friendCarNumber, messages: this.state.messages}], this.contacts, 'carNumber');
    this.props.dispatch(
      updateUser({"contacts": contacts}, (error, json) => {
        if (error) {
          console.log('Failed to save message history with ' + this.friendCarNumber);
        } else {
          console.log('Saved message history with ' + this.friendCarNumber);
        }
      }));
  }

  _rawInput = (data) => {
    console.log('RECV: ' + data);
  };
  _rawOutput = (data) => {
    console.log('SENT: ' + data);
  };

  _onMessage = (msg) => {
    const to = msg.getAttribute('to');
    const from = msg.getAttribute('from');
    const type = msg.getAttribute('type');
    const elems = msg.getElementsByTagName('body');

    if (type === "chat" && elems.length > 0) {
      const text = Strophe.getText(elems[0]);
      this._onReceive(text);
      console.log('CHAT: I got a message from ' + from + ': ' + text);
    }
    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
  };

  _onSubscriptionRequest = (stanza) => {
    if (stanza.type === "subscribe") {
      let from = stanza.from;
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
    let presence_type = presence.type; // unavailable, subscribed, etc...
    let from = presence.from; // the jabber_id of the contact
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

  _onLoadEarlier = () => {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            // messages: GiftedChat.prepend(previousState.messages, require('../../lib/chat/messages.js')),
            messages: GiftedChat.prepend(previousState.messages, this.friendHistory && this.friendHistory.messages || []),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  };

  _onSend = (messages = []) => {
    console.log('message to send: ' + JSON.stringify(messages));
    if (messages && messages.length > 0) {
      let stropheMessage = $msg({
        to:   _.toLower(this.friendCarNumber) + '@' + XMPP_DOMAIN,
        from: connection.jid,
        type: 'chat'
      }).c("body").t(messages[0].text);
      connection.send(stropheMessage);
    }

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  };


  _onReceive = (text) => {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: this.friendCarNumber,
            name: this.friendCarNumber,
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  };

  _renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  };

  _renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };

  _renderCustomView = (props) => {
    return (
      <CustomView
        {...props}
      />
    );
  };

  _renderFooter = (props) => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <Container>
        <Header {...this.props}
                title={this.props.navigation.getParam('carNumber')}
                showBack={true}
                backTo={'Messages'}/>
        <Content contentContainerStyle={styles.content}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this._onSend}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this._onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}

            user={{
              _id: this.carNumber, // sent messages should have same user._id
              name: this.carNumber
            }}

            renderBubble={this._renderBubble}
            renderSystemMessage={this._renderSystemMessage}
            renderCustomView={this._renderCustomView}
            renderFooter={this._renderFooter}
          />
        </Content>
      </Container>
    );
  }
}


Chat.propTypes = {
  headerTitle: PropTypes.string,
};

Chat.defaultProps = {
  headerTitle: ''
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
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Chat);
