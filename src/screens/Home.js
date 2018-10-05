import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {Container, Content, View, Text, Flatlist, StyleProvider, Icon, Button,} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropTypes from "prop-types";


class Home extends Component {

  _onPressAgentsButton = () => {
    this.props.navigation.navigate('Agents');
  };

  _onPressMyPlanButton = () => {
    this.props.navigation.navigate('MyPlans');
  };

  _onPressSettingsButton = () => {
    this.props.navigation.navigate('Settings');
  };

  render() {
    let iconSize = 80;
    return (
      <Container>
        <Header showBack={false} {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          
        </Content>
        <Footer/>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row'
  },
  logo: {
    paddingBottom: 30
  },
  icon: {
    fontSize: 70
  },
  button: {
    width: 90,
    height: 110,
    margin: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    paddingTop: 15
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Home);
