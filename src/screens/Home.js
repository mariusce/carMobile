import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {Container, Content, View, Text, Flatlist, StyleProvider, Icon, Button, Badge,} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropTypes from "prop-types";


class Home extends Component {

  _onPressGoToContacts = () => {
    this.props.navigation.navigate('Contacts');
  };

  render() {
    let iconSize = 80;
    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>

        </Content>
        <Footer active="home" {...this.props} />
      </Container>
    );
  }
}


Home.propTypes = {
  headerTitle: PropTypes.string,
};

Home.defaultProps = {
  headerTitle: 'Home'
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

export default connect(mapStateToProps)(Home);
