import React from 'react';
import { Text, View } from 'react-native';
import { connect } from "react-redux";

import { styles } from "../../styles";

interface SplashProperties {
  navigation: any;
}

class Splash extends React.Component<any, SplashProperties> {

  static navigationOptions = {
    header: null
  };

  constructor(props: any) {
    super(props);

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // first, did the site load
    if(this.props.siteState.status !== "active"){
      this.props.navigation.navigate("Site");
    } else if (this.props.userState.loggedIn) {
      this.props.navigation.navigate("Dashboard");
    } else {
      this.props.navigation.navigate("Login");
    }
  }

  render() {
    return (
      <View style={styles.splashContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  private login() {
    this.props.navigation.navigate("Login");
  }
}

const mapStateToProps = function map(s: any) {
  return {
    ...s
  };
};

function mapDispatchToProps(dispatch: any) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);