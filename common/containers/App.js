import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import * as CounterActions from '../actions'

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}


class App extends React.Component {

  /**
   * componentDidMount
   */
  componentDidMount() {
    window.console.log(window.innerHeight);
  }

  render() {
    return (
      <div>
        <Counter counter={this.props.counter}/>
        {this.props.children}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
