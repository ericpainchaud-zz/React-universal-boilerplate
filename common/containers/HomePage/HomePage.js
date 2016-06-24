import React, { Component } from 'react';
import { Link } from 'react-router';

/**
 * HomePage section
 */
export default class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: ['HTML5 Boilerplate', 'React.js', '... & more'],
    };
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    return (
      <section>
        <h1>Allo!</h1>
        <p>You now have:</p>
        <ul>
          {this.state.items.map((item, key) => <li key={key}><span> {item}</span></li>)}
        </ul>
        <aside>
          <Link to="/contact">&#9998; <b>Contact</b></Link>
        </aside>
      </section>
    );
  }
}
