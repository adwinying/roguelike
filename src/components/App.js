import React, { Component } from 'react';
import Header from './Header';
import Stats from './Stats';
import Map from './Map';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Stats />
        <Map />
        <Footer />
      </div>
    );
  }
}

export default App;
