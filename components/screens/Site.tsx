import * as React from "react";
import { View, Dimensions, Image, Alert } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Content, Form, Spinner, Item, Input, Button, Text } from "native-base";

import { SitesAPI } from "../../api/";
import * as SiteActions from "../../reducers/siteReducer";
import { styles } from "../../styles";
import { SiteAPI } from "../../api/sites";

const banner = require("../../assets/banner.png");
const { height } = Dimensions.get("window");
const bannerHeight = height / 4;

interface IStarterProps {
  siteActions: any;
  navigation: any;
}

interface IStarterState {
  loading: boolean;
  siteAvailable: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  siteName: string;
  siteDescription: string;
  secretKey: string;
}

class SiteScreen extends React.Component<IStarterProps, IStarterState> {

  static navigationOptions = {
    header: null
  };

  constructor(props: any){
    super(props);
    this.state = {
      loading: true,
      siteAvailable: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      username: "",
      siteName: "",
      siteDescription: "",
      secretKey: ""
    };

    // binders
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updateSiteName = this.updateSiteName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.updateSecretKey = this.updateSecretKey.bind(this);
    this.setupSite = this.setupSite.bind(this);

  }

  public componentDidMount(){
    this.loadSite();
  }

  public render() {
    if(this.state.loading){
      return (
        <View style={{marginTop: 15}}>
          <Spinner color="blue" />
        </View>
      )
    }

    if(!this.state.siteAvailable){
      return (
        <Container>
          <Content contentContainerStyle={styles.containerContent}>
            <View style={styles.containerContentView}>
              <Image source={banner} style={{width: "100%", height: bannerHeight, marginTop: 20}} resizeMode="contain" />
              <Text>Unfortunately, this site is not setup and not available to be setup. If you are not expecting this message, please contact the owner of this app.</Text>
            </View>
          </Content>
        </Container>
        );
    }
    return (
    <Container>
      <Content contentContainerStyle={styles.containerContent}>
        <View style={styles.containerContentView}>
          <Image source={banner} style={{width: "100%", height: bannerHeight, marginTop: 20}} resizeMode="contain" />
          <Text>The site is ready to be setup. Please provide all of the following pieces of data to set the site up for use. The Secret Key should have been provided to when the server started.</Text>
          <Form>
            <Item>
              <Input placeholder="Your First Name" onChangeText={this.updateFirstName} value={this.state.firstName} textContentType="givenName" autoCapitalize="words"/>
            </Item>
            <Item>
              <Input placeholder="Your Last Name" onChangeText={this.updateLastName} value={this.state.lastName} textContentType="familyName" autoCapitalize="words"/>
            </Item>
            <Item>
              <Input placeholder="Email" onChangeText={this.updateEmail} value={this.state.email} textContentType="emailAddress" autoCapitalize="none"/>
            </Item>
            <Item>
              <Input placeholder="Username" onChangeText={this.updateUsername} value={this.state.username} textContentType="username" autoCapitalize="none"/>
            </Item>
            <Item>
              <Input placeholder="Password" onChangeText={this.updatePassword} value={this.state.password} textContentType="newPassword" autoCapitalize="none"/>
            </Item>
            <Item>
              <Input placeholder="Site Name" onChangeText={this.updateSiteName} value={this.state.siteName} textContentType="name" autoCapitalize="words"/>
            </Item>
            <Item>
              <Input placeholder="Site Description" onChangeText={this.updateDescription} value={this.state.siteDescription} textContentType="name" autoCapitalize="sentences"/>
            </Item>
            <Item>
              <Input placeholder="Secret Key" onChangeText={this.updateSecretKey} value={this.state.secretKey} textContentType="oneTimeCode" autoCapitalize="none"/>
            </Item>

            <View style={{marginTop: 15}}>
            {this.state.loading ? (<Spinner color="blue" />) : (
              <Button block={true} onPress={this.setupSite} style={styles.buttonPrimary}>
                <Text>Setup Site</Text>
              </Button>)}
            </View>

          </Form>
        </View>
      </Content>
    </Container>
    );
  }

  private loadSite(){
    this.setState({loading: true}, async () => {
      try{
        const siteRes = await SitesAPI.getSiteInfo();
        if(siteRes.body.data.status === "active"){
          // redirect to login
          return this.props.navigation.navigate("Login");
        }
        this.setState({loading: false, siteAvailable: true});
      }catch(err){
        this.setState({loading: false, siteAvailable: false});
      }
    });
  }

  private setupSite(){
    // check all fields are present
    if(this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.email === "" ||
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.siteName === "" ||
      this.state.siteDescription === "" ||
      this.state.secretKey === "" ){
        return Alert.alert("Error", "All fields must be entered and cannot be blank.", [
          {text: "OK"}
        ]);
    }
    this.setState({loading: true}, async () => {
      try{
        await SitesAPI.setupSite(this.state.firstName, this.state.lastName, this.state.email, this.state.username, this.state.password, this.state.siteName, this.state.siteDescription, this.state.secretKey);
        // if here, then it worked so get the site again and store it
        const siteRes = await SitesAPI.getSiteInfo();
        this.props.siteActions.setSite(siteRes.body.data);
        this.props.navigation.navigate("Login");
      }catch(err){
        Alert.alert("Error", "We could not setup that site. Please verify all of the information and try again.", [
          {text: "OK"}
        ]);
        this.setState({loading: false});
      }
    });
  }

  private updateFirstName(firstName: string){
    this.setState({firstName});
  }

  private updateLastName(lastName: string){
    this.setState({lastName});
  }

  private updateEmail(email: string){
    this.setState({email});
  }

  private updateUsername(username: string){
    this.setState({username});
  }

  private updatePassword(password: string){
    this.setState({password});
  }

  private updateSiteName(siteName: string){
    this.setState({siteName});
  }

  private updateDescription(siteDescription: string){
    this.setState({siteDescription});
  }

  private updateSecretKey(secretKey: string){
    this.setState({secretKey});
  }
}


const mapStateToProps = function map(s: any) {
  return {
    ...s
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    siteActions: bindActionCreators(SiteActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteScreen);