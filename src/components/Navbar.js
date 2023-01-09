import './Navbar.css'
import React, { Component } from 'react'

export default class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='Navbar'>
                <div style={{ fontSize: '42px',  marginTop: '50px', marginBottom: '8vh', borderBottom:'1px solid white', paddingLeft:'10px', paddingRight:'10px' }}>Sorinello</div>
                <div className="Navbar-button" onClick={() => { this.props.changeSelection('home') }} style={{ backgroundColor: this.props.selectedTab == 'home' ? '#2c2a25' : '#1f2125', borderLeft: this.props.selectedTab == 'home' ? '5px solid #f8ce45' : '0px' }}>
                    <i className="pi pi-home" style={{ paddingLeft: '20px' }} ></i>
                    <div className='Navbar-button-text'>Home</div>
                </div>
                <div className="Navbar-button" onClick={() => { this.props.changeSelection('employees') }} style={{ backgroundColor: this.props.selectedTab == 'employees' ? '#2c2a25' : '#1f2125', borderLeft: this.props.selectedTab == 'employees' ? '5px solid #f8ce45' : '0px' }}>
                    <i className="pi pi-users" style={{ paddingLeft: '20px' }}></i>
                    <div className='Navbar-button-text'>Employees</div>
                </div>
                <div className="Navbar-button" onClick={() => { this.props.changeSelection('customers') }} style={{ backgroundColor: this.props.selectedTab == 'customers' ? '#2c2a25' : '#1f2125', borderLeft: this.props.selectedTab == 'customers' ? '5px solid #f8ce45' : '0px' }}>
                    <i className="pi pi-building" style={{ paddingLeft: '20px' }}></i>
                    <div className='Navbar-button-text'>Customers</div>
                </div>
                <div className="Navbar-button" onClick={() => { this.props.changeSelection('settings') }} style={{ backgroundColor: this.props.selectedTab == 'settings' ? '#2c2a25' : '#1f2125', borderLeft: this.props.selectedTab == 'settings' ? '5px solid #f8ce45' : '0px' }}>
                    <i className="pi pi-cog" style={{ paddingLeft: '20px' }}></i>
                    <div className='Navbar-button-text'>Settings</div>
                </div>
                <div className="Navbar-button" onClick={() => { this.props.changeSelection('logOut') }} style={{ backgroundColor: this.props.selectedTab == 'logOut' ? '#2c2a25' : '#1f2125', borderLeft: this.props.selectedTab == 'logOut' ? '5px solid #f8ce45' : '0px' }}>
                    <i className="pi pi-sign-out" style={{ paddingLeft: '20px' }}></i>
                    <div className='Navbar-button-text'>Log Out</div>
                </div>
            </div>
        )
    }
}

