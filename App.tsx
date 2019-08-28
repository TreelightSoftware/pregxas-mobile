import React from 'react';
import * as Expo from "expo";
import * as Font from "expo-font";
import { createStackNavigator, createAppContainer } from "react-navigation";
import store from "./store";
import { Provider as StoreProvider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// screens
import SplashScreen from "./components/screens/Splash";
import SiteScreen from "./components/screens/Site";
import LoginScreen from "./components/screens/Login";


const Stack = createStackNavigator({
  Home: {
    screen: SplashScreen,
  },
  Site: {
    screen: SiteScreen,
  },
  Login: {
    screen: LoginScreen,
  },
}, {
  initialRouteName: "Home"
});

const Navigation = createAppContainer(Stack);

export default class App extends React.Component<any, any> {

  constructor(props: any){
    super(props);
    this.state = {
      loading: true
    }
  }

  componentWillMount(){
    this.loadFonts();
  }

  async loadFonts(){
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ loading: false });
  }

  render() {
    if(this.state.loading){
      return (<Expo.AppLoading />);
    }
    return (
      <StoreProvider store={store}>
        <Navigation />
      </StoreProvider>
    );
  }
}

