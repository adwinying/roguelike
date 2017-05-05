import React, { Component } from 'react';
import Alert from './Alert';
import Header from './Header';
import Stats from './Stats';
import Map from './Map';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div>
        <Alert />
        <Header />
        <Stats />
        <Map />
        <Footer />
      </div>
    );
  }
}

export default App;
