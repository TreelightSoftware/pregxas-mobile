import * as React from "react";
import { AsyncStorage, View, Image, Alert, Dimensions } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Content, Form, Spinner, Item, Input, Button, Text } from "native-base";
import { AdMobBanner } from "expo-ads-admob";
import  Constants  from "expo-constants";

import * as UserActions from "../../reducers/userReducer";
import { UsersAPI } from "../../api";
import { styles } from "../../styles";

const banner = require("../../assets/banner.png");
const { height } = Dimensions.get("window");
const bannerHeight = height / 4;

interface ILoginScreenProps {
  appActions: any;
  history: any;
  userActions: any;
  navigation: any;
}

interface ILoginScreenState {
  loading: boolean;
  email: string;
  password: string;
}

class LoginScreen extends React.Component<ILoginScreenProps, ILoginScreenState> {

  static navigationOptions = {
    header: null
  };

  constructor(props: any){
    super(props);
    this.state = {
      loading: false,
      email: "",
      password: "",
    };

    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.attemptLogin = this.attemptLogin.bind(this);
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.containerContent}>
          <View style={styles.containerContentView}>
            <Image source={banner} style={{width: "100%", height: bannerHeight, marginTop: 20}} resizeMode="contain" />
            <Text>Login to Pregxas by entering your email and password below.</Text>
            <Form>
              <Item>
                <Input placeholder="Email" onChangeText={this.updateEmail} value={this.state.email} autoFocus={true} textContentType="emailAddress" autoCapitalize="none"/>
              </Item>
              <Item>
                <Input placeholder="Password" onChangeText={this.updatePassword} value={this.state.password} textContentType="password" autoCapitalize="none" />
              </Item>

              <View style={{marginTop: 15}}>
              {this.state.loading ? (<Spinner color="blue" />) : (
                <Button block={true} onPress={this.attemptLogin}>
                  <Text>Login</Text>
                </Button>)}
              </View>
            </Form>
          </View>
          {this.loadBanner()}
        </Content>
      </Container>
    );
  }

  private loadBanner(){
    if(Constants.manifest.extra && Constants.manifest.extra.showAds && Constants.manifest.extra.adMobBannerId && Constants.manifest.extra.adMobBannerId !== ""){
      return (
        <View style={{padding: 0, marginTop: 25}}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={Constants.manifest.extra.adMobBannerId}
            testDeviceID="EMULATOR" />
        </View>
      );
    }
    return <View />;
  }

  private updateEmail(email: string){
    this.setState({email});
  }

  private updatePassword(password: string){
    this.setState({password});
  }

  private async attemptLogin(){
    this.setState({ loading: true}, async () => {
      try {
        const result = await UsersAPI.loginUser(this.state.email, this.state.password)
        const user = result.body.data;
        this.props.userActions.loginUser({loggedIn: true, user});
        await AsyncStorage.setItem("jwt", user.jwt);
        // this.props.navigation.navigate("News");
      }catch(err){
        this.setState({loading: false}, () => {
          Alert.alert("Error", "We could not log you in. Please check your information.", [
            {text: "OK"}
          ]);
        });
      }
    });
  }

}



const mapStateToProps = function map(s: any) {
  return {
    ...s
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);