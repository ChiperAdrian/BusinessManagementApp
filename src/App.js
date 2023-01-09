import './App.css';
import Navbar from './components/Navbar';
import Customers from './components/Customers'
import Employees from './components/Employees';
import Home from './components/Home';

import "primereact/resources/themes/arya-orange/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

import React, { Component } from 'react'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'home',
      selectedWork: null,
      selectedEmployee: null,
    }
    this.changeSelection = (selection) => {
      this.setState({ ...this.state, selectedTab: selection })
    }
    this.changeSelectedWork = (selection) => {
      this.setState({ ...this.state, selectedWork: selection })
    }

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navbar changeSelection={this.changeSelection} selectedTab={this.state.selectedTab}></Navbar>
          {
            (this.state.selectedTab === 'customers' && <Customers></Customers>)
            ||
            (this.state.selectedTab === 'employees' && <Employees></Employees>)
            ||
            (this.state.selectedTab === 'home' && <Home></Home>)
          }
          
        </header>
      </div>
    );
  }
}


