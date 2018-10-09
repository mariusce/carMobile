import React, {Component} from 'react';
import {createStackNavigator} from "react-navigation";
import {Root, StyleProvider} from "native-base";
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Login from './screens/Login';
import Loading from './screens/Loading';
import CodeValidation from './screens/CodeValidation';
import PhoneInput from './screens/PhoneInput';
import Home from './screens/Home';
import Contacts from './screens/Contacts';
import Messages from './screens/Messages';


import configureStore from './store/configureStore';
import {Provider} from 'react-redux';

const AppNavigator = createStackNavigator(
    {
      Welcome: {screen: Welcome},
      Register: {screen: Register},
      Login: {screen: Login},
      CodeValidation: {screen: CodeValidation},
      Loading: {screen: Loading},
      PhoneInput: {screen: PhoneInput},
      Home: {screen: Home},
      Contacts: {screen: Contacts},
      Messages: {screen: Messages},
    },
    {
      initialRouteName: "Loading",
      headerMode: "none"
    }
);

const store = configureStore();

export default () =>

    <StyleProvider style={getTheme(platform)}>
        <Root>
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        </Root>
    </StyleProvider>;

