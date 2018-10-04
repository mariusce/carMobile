import React, {Component} from 'react';
import { Container, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import {connect} from "react-redux";
import Error from './Error';

class MyContainer extends Component {
    render() {
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
                {this.props.children}
                <Error/>
            </Container>
          </StyleProvider>);
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(MyContainer);
