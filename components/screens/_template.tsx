//this file serves as a copy and paste template for a new component

import * as React from "react";
import { Text, View } from 'react-native';
import { connect } from "react-redux";
import { Container, Content } from "native-base";

import { styles } from "../../styles";

interface IStarterProps {
  appActions: any;
  history: any;
}

interface IStarterState {
  loading: boolean;
}

class Starter extends React.Component<IStarterProps, IStarterState> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false
    };

  }

  public render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.containerContent}>
          <View style={styles.containerContentView}>
            <Text>Template</Text>
          </View>
        </Content>
      </Container>
    );
  }

}


const mapStateToProps = function map(s: any) {
  return {
    appState: s.appState
  };
};

function mapDispatchToProps(dispatch: any) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Starter);