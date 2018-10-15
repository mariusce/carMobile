import React, {Component} from 'react';
import {SwitchNavigator, createStackNavigator} from "react-navigation";
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Root, StyleProvider} from "native-base";
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Login from './screens/Login';
import Loading from './screens/Loading';
import CodeValidation from './screens/CodeValidation';
import PhoneInput from './screens/PhoneInput';


import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import Home from './screens/Home';
import Contacts from './screens/Contacts';
import Messages from './screens/Messages';

const AuthStack = createStackNavigator(
    {
      Welcome: {screen: Welcome},
      Register: {screen: Register},
      Login: {screen: Login},
      CodeValidation: {screen: CodeValidation},
      PhoneInput: {screen: PhoneInput},
    },
    {
      initialRouteName: "Welcome",
      headerMode: "none"
    }
);

const AppNavigator = createMaterialBottomTabNavigator({
  Home: { screen: Home },
  Contacts: { screen: Contacts },
  Messages: { screen: Messages },
}, {
  initialRouteName: 'Home',
  activeColor: '#f0edf6',
  inactiveColor: '#3e2465',
  barStyle: { backgroundColor: '#694fad' },
});



const AppSwitchNavigator = SwitchNavigator(
  {
    Loading: Loading,
    App: AppNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Loading',
  }
);

const store = configureStore();

export default () =>

    <StyleProvider style={getTheme(platform)}>
        <Root>
            <Provider store={store}>
                <AppSwitchNavigator/>
            </Provider>
        </Root>
    </StyleProvider>;

