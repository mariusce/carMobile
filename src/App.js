import React, {Component} from 'react';
import {createSwitchNavigator, createStackNavigator} from "react-navigation";
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Chat from './screens/Chat';

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
  inactiveColor: '#92c5c1',
  shifting: true,
  barStyle: { backgroundColor: '#186d6a' },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName = 'home';
      switch (routeName) {
        case 'Home':
          iconName = 'home';
          break;
        case 'Contacts':
          iconName = 'people';
          break;
        case 'Messages':
          iconName = 'forum';
          break;
      }
      return <MaterialIcons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: platform.activeTintColor,
    inactiveTintColor: platform.inactiveTintColor,
  },
});



const AppSwitchNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    App: AppNavigator,
    Auth: AuthStack,
    Chat: Chat,
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

