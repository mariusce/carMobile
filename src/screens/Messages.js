import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {Container, Content, View, Text, Flatlist, StyleProvider, Icon, Button,} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropTypes from "prop-types";


class Messages extends Component {

  render() {
    let iconSize = 80;
    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>

        </Content>
        <Footer active="messages" {...this.props}/>
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
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Messages);
