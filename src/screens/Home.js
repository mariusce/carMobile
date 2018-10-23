import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  Container,
  Content,
  View,
  Text,
  Flatlist,
  Thumbnail,
  Toast,
} from "native-base";
import {connect} from 'react-redux';
import Header from '../components/Header';
import PropTypes from "prop-types";
import {getAuthenticatedUser, register} from '../actions/authentication';


class Home extends Component {

  componentDidMount() {
    this.props.dispatch(getAuthenticatedUser((error, json) => {
      if (error) {
        this.props.navigation.navigate('Auth');
      }
    }));
  }

  render() {
    return (
      <Container>
        <Header {...this.props} title={this.props.headerTitle}/>
        <Content contentContainerStyle={styles.content}>
          <View style={styles.image}>
            <Thumbnail large source={{uri: 'https://picsum.photos/200/300/?image=1005'}} />
          </View>
          <View style={styles.details}>
            <Text >License plate</Text>
            <Text style={styles.propertyText}>{this.props.user.carNumber}</Text>
            <Text/><Text/>
            <Text >Full name</Text>
            <Text style={styles.propertyText}>{this.props.user.firstName} {this.props.user.lastName}</Text>
            <Text/><Text/>
            <Text >Email</Text>
            <Text style={styles.propertyText}>{this.props.user.email}</Text>
            <Text/><Text/>
            <Text >Phone</Text>
            <Text style={styles.propertyText}>{this.props.user.phone}</Text>
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
    margin: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 3,
    margin: 20
  },
  propertyText: {
    fontWeight: 'bold'
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

export default connect(mapStateToProps)(Home);
