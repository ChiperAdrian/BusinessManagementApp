import React, { Component } from 'react'
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import customersService from '../services/customers-service';
import './Customers.css'
import { v4 as uuidv4 } from 'uuid';


class Customer {
    constructor(id, name, email, phone, state, city, street, totalHoursWorked, totalIncome, customerSince, locations, work) {
        this.id = id
        this.name = name
        this.email = email
        this.phone = phone
        this.state = state
        this.city = city
        this.street = street
        this.totalHoursWorked = totalHoursWorked
        this.totalIncome = totalIncome
        this.customerSince = customerSince
        this.locations = locations
        this.work = work
    }
}
class Location {
    constructor(id, name, state, city, street) {
        this.id = id
        this.name = name
        this.state = state
        this.city = city
        this.street = street
    }
}


export default class Customers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customersFetched: false,
            customers: [],
            selectedCustomer: null,
            selectedLocationId: null,
            showAddCustomerDialog: false,
            showEditCustomerDialog: false,
            showRemoveCustomerDialog: false,
            showAddLocationDialog: false,
            showEditLocationDialog: false,
            showRemoveLocationDialog: false,
            customerForm: {
                name: "",
                email: "",
                phone: "",
                state: "",
                city: "",
                street: "",
            },
            locationForm: {
                name: "",
                state: "",
                city: "",
                street: ""
            },
            express: "Not fetched"
        }

        // ----------------------------CUSTOMER FORM----------------------------
        this.customerNameChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, name: e.target.value } })
        }
        this.customerEmailChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, email: e.target.value } })
        }
        this.customerPhoneChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, phone: e.target.value } })
        }
        this.customerStateChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, state: e.target.value } })
        }
        this.customerCityChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, city: e.target.value } })
        }
        this.customerStreetChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, street: e.target.value } })
        }

        // ---------------------------- LOCATION FORM----------------------------
        this.locationNameChange = (e) => {
            this.setState({ ...this.state, locationForm: { ...this.state.locationForm, name: e.target.value } })
        }
        this.locationStateChange = (e) => {
            this.setState({ ...this.state, locationForm: { ...this.state.locationForm, state: e.target.value } })
        }
        this.locationCityChange = (e) => {
            this.setState({ ...this.state, locationForm: { ...this.state.locationForm, city: e.target.value } })
        }
        this.locationStreetChange = (e) => {
            this.setState({ ...this.state, locationForm: { ...this.state.locationForm, street: e.target.value } })
        }

        // ---------------------------- TOASTS----------------------------
        this.showAddCustomerSuccess = () => {
            this.addCustomerToast.show({ severity: 'success', summary: 'Success', detail: 'Customer successfully edited', life: 3000 });
        }
        this.showEditCustomerSuccess = () => {
            this.editCustomerToast.show({ severity: 'success', summary: 'Success', detail: 'Customer successfully edited', life: 3000 });
        }
        this.showRemoveCustomerSuccess = () => {
            this.removeCustomerToast.show({ severity: 'success', summary: 'Success', detail: 'Customer successfully deleted', life: 3000 });
        }
        this.showAddLocationSuccess = () => {
            this.addLocationToast.show({ severity: 'success', summary: 'Success', detail: 'Location successfully added' })
        }
        this.showEditLocationSuccess = () => {
            this.editLocationToast.show({ severity: 'success', summary: 'Success', detail: 'Location successfully edited', life: 3000 });
        }
        this.showRemoveLocationSuccess = () => {
            this.removeLocationToast.show({ severity: 'success', summary: 'Success', detail: 'Location successfully deleted', life: 3000 });
        }
    }

    /////////////////////////////  COMPONENT WILL MOUNT /////////////////////////// 

    componentWillMount() {
        this.fetchCustomersWithWorkAndLocation()
    }
    fetchCustomersWithWorkAndLocation() {
        fetch("http://localhost:3001/getAllCustomersWithWorkAndLocations")
            .then(res => res.text())
            .then(res => {
                const data = JSON.parse(res)
                var customers = []
                data.forEach(customer => {
                    customers.push(new Customer(
                        customer.id,
                        customer.name,
                        customer.email,
                        customer.phone,
                        customer.state,
                        customer.city,
                        customer.street,
                        customer.totalHoursWorked,
                        customer.totalIncome,
                        customer.customerSince,
                        customer.locations,
                        customer.workIDs
                    ))
                })
                this.setState({ ...this.state, customers: customers, customersFetched: true, selectedCustomer: customers[0] })
            })
    }

    // ---------------------------- CUSTOMERS CRUD ----------------------------
    // async getCustomers() {
    //     var customers = await customersService.getAllCustomers()
    //     this.setState((currentState, currentprops) => {
    //         return {
    //             ...currentState,
    //             customers: customers,
    //             customersFetched: true,
    //             selectedCustomer: customers[0]
    //         }
    //     })
    // }
    async addCustomer() {
        const newCustomer = {
            id: uuidv4(),
            name: this.state.customerForm.name,
            email: this.state.customerForm.email,
            phone: this.state.customerForm.phone,
            state: this.state.customerForm.state,
            city: this.state.customerForm.city,
            street: this.state.customerForm.street,
            customerSince: this.getTodayDate(),
            totalHoursWorked: 0,
            totalIncome: 0,
        }
        try {
            await customersService.addCustomer(newCustomer)
            this.showAddCustomerSuccess()
        } catch (err) {
            console.log("Failed to add customer:", err.message)
        }
    }

    async editCustomer() {
        try {
            await customersService.updateCustomer(this.state.customerForm, this.state.selectedCustomer.id)
            this.showEditCustomerSuccess()
        } catch (err) {
            console.log("Error updating customer:", err.message)
        }
    }

    async deleteCustomer() {
        try {
            await customersService.deleteCustomer(this.state.selectedCustomer.id)
            this.showRemoveCustomerSuccess()
        } catch (err) {
            console.log("Error")
        }
    }
    // ---------------------------- CUSTOMER FORM ----------------------------

    renderAddCustomerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideAddCustomerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.addCustomer(); this.hideAddCustomerDialog(); }}></Button>
            </div>
        )
    }
    renderEditCustomerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideEditCustomerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.editCustomer(); this.hideEditCustomerDialog(); }}></Button>
            </div>
        )
    }
    renderRemoveCustomerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideRemoveCustomerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.deleteCustomer(); this.hideRemoveCustomerDialog(); }}></Button>
            </div>
        )
    }

    showAddCustomerDialog() {
        this.setState({ ...this.state, showAddCustomerDialog: true })
    }
    hideAddCustomerDialog() {
        this.setState({ ...this.state, showAddCustomerDialog: false })
    }
    showEditCustomerDialog() {
        this.setState({
            ...this.state, showEditCustomerDialog: true, customerForm: {
                name: this.state.selectedCustomer.name,
                email: this.state.selectedCustomer.email,
                phone: this.state.selectedCustomer.phone,
                state: this.state.selectedCustomer.state,
                city: this.state.selectedCustomer.city,
                street: this.state.selectedCustomer.street,
            }
        })
    }
    hideEditCustomerDialog() {
        this.setState({
            ...this.state, showEditCustomerDialog: false, customerForm: {
                name: "",
                email: "",
                phone: "",
                state: "",
                city: "",
                street: ""
            }
        })

    }
    showRemoveCustomerDialog() {
        this.setState({ ...this.state, showRemoveCustomerDialog: true })
    }
    hideRemoveCustomerDialog() {
        this.setState({ ...this.state, showRemoveCustomerDialog: false })
    }
    // ---------------------------- LOCATIONS CRUD ----------------------------

    async addLocation() {
        const newLocation = {
            id: uuidv4(),
            name: this.state.locationForm.name,
            state: this.state.locationForm.state,
            city: this.state.locationForm.city,
            street: this.state.locationForm.street
        }
        try {
            await customersService.addLocation(newLocation, this.state.selectedCustomer.id)
            this.showAddLocationSuccess()
        } catch (err) {
            console.log("Failed to add location:", err.message)
        }
    }
    getTodayDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        return today
    }
    async updateLocation() {
        try {
            await customersService.updateLocation(this.state.locationForm, this.state.selectedCustomer.id, this.state.selectedLocationId)
            this.showEditLocationSuccess()
        } catch (err) {
            console.log("Error updating customer:", err.message)
        }
    }
    async deleteLocation() {
        try {
            customersService.deleteLocation(this.state.selectedCustomer.id, this.state.selectedLocationId)
            this.showRemoveLocationSuccess()
        } catch (err) {
            console.log("Error deleting location")
        }
    }


    // ---------------------------- LOCATION FORM ----------------------------
    renderAddLocationDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideAddLocationDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.addLocation(); this.hideAddLocationDialog(); }}></Button>
            </div>
        )
    }
    renderEditLocationDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideEditLocationDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.updateLocation(); this.hideEditLocationDialog(); }}></Button>
            </div>
        )
    }
    renderRemoveLocationDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideRemoveLocationDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.deleteLocation(); this.hideRemoveLocationDialog(); }}></Button>
            </div>
        )
    }
    showAddLocationDialog() {
        this.setState({ ...this.state, showAddLocationDialog: true })
    }
    hideAddLocationDialog() {
        this.setState({ ...this.state, showAddLocationDialog: false })
    }
    showEditLocationDialog(id) {
        var currentLocation = null
        this.state.selectedCustomer.locations.forEach((location) => {
            if (location.id === id) {
                currentLocation = location
            }
        })
        this.setState({
            ...this.state, showEditLocationDialog: true, selectedLocationId: currentLocation.id, locationForm: {
                name: currentLocation.name,
                state: currentLocation.state,
                city: currentLocation.city,
                street: currentLocation.street,
            }
        })
    }
    hideEditLocationDialog() {
        this.setState({ ...this.state, })
        this.setState({
            ...this.state, showEditLocationDialog: false, selectedLocationId: null, locationForm: {
                name: "",
                state: "",
                city: "",
                street: "",
            }
        })
    }
    showRemoveLocationDialog(idOfLocation) {
        this.setState({ ...this.state, showRemoveLocationDialog: true, selectedLocationId: idOfLocation })
    }
    hideRemoveLocationDialog() {
        this.setState({ ...this.state, showRemoveLocationDialog: false, selectedLocationId: null })
    }



    render() {
        return (
            <div style={{ display: 'flex', width: '100%', minHeight: '100%', color: '#cfcccd' }}>
                {/* CUSTOMERS LIST */}
                <div style={{ width: '50%', minHeight: '100%', paddingTop: '50px', }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '950px', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid white' }}>
                            <div style={{ fontSize: '42px', fontWeight: 'bold', paddingLeft: '40px', }}>Customers</div>
                            <i className="pi pi-plus" id="addCustomerButton" onClick={() => { this.showAddCustomerDialog() }} style={{ fontSize: '42px', color: '#cfcccd', paddingRight: '20px' }}></i>
                        </div>
                        {
                            this.state.customersFetched && this.state.customers.map((customer) => (
                                <div className='customerCard' style={{ background: this.state.selectedCustomer.id === customer.id ? '#2c2a25' : '#17171b', borderLeft: this.state.selectedCustomer.id === customer.id ? '5px solid #f8ce45' : '' }} onClick={() => { this.setState({ ...this.state, selectedCustomer: customer }); }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                                        <div style={{ display: 'flex', }}>
                                            <Avatar icon="pi pi-building" className="mr-2" size="xlarge" />
                                            <div style={{ fontWeight: 'bold', fontSize: '22px', paddingLeft: '20px' }}>{customer.name}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px' }}>
                                            <div style={{ fontWeight: 'bold', 'fontSize': '12px', color: '#495057' }}>{customer.state}, {customer.city}</div>
                                            <div style={{ fontWeight: 'bold', 'fontSize': '12px', color: '#495057' }}>{customer.street}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '40px', fontWeight: 'bold', }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
                                            <div style={{ color: '#636363', }}>Total hours worked</div>
                                            <div style={{ paddingTop: '10px' }}>€{customer.totalHoursWorked}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
                                            <div style={{ color: '#636363' }}>Total income</div>
                                            <div style={{ paddingTop: '10px' }}>€{customer.totalIncome}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* CUSTOMER DETAILS */}
                <div style={{ width: '50%', minHeight: '100%', background: '#1f2125' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '50px', paddingLeft: '40px', paddingRight: '40px', borderBottom: '1px solid white' }}>
                        <div style={{ display: 'flex' }}>
                            <i className="pi pi-building" style={{ fontSize: '42px', }}></i>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '42px' }}>{this.state.selectedCustomer && this.state.selectedCustomer.name}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <i className="pi pi-user-edit" id='editCustomerButton' onClick={() => { this.showEditCustomerDialog() }} style={{ fontSize: '42px', alignSelf: 'center', }}></i>
                            <i className="pi pi-trash" id='deleteCustomerButton' onClick={() => { this.showRemoveCustomerDialog() }} style={{ fontSize: '42px', color: '#fc4946', alignSelf: 'center', }}></i>
                        </div>
                    </div>
                    {/* GENERAL INFO */}
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '900px' }}>
                        <div className='customerDetailsCard'>
                            <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>General info</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Name</div>
                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.name}</div>
                                </div>
                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Email</div>
                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.email}</div>
                                </div>
                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Phone</div>
                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.phone}</div>
                                </div>
                            </div>
                        </div>
                        {/* ADDRESS */}
                        <div className='customerDetailsCard'>
                            <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Address</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>State</div>
                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.state}</div>
                                </div>
                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>City</div>
                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.city}</div>
                                </div>
                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Street</div>
                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.street}</div>
                                </div>
                            </div>
                        </div>
                        {/* LOCATIONS */}
                        <div className='customerDetailsCard' style={{ height: '500px', justifyContent: 'flex-start' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>
                                <div >Locations</div>
                                <i className="pi pi-plus" id='addLocationButton' style={{ fontSize: '22px', }} onClick={() => { this.showAddLocationDialog() }}></i>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', }}>
                                <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Location</div>
                                </div>
                                <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>State</div>
                                </div>
                                <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>City</div>
                                </div>
                                <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Street</div>
                                </div>
                                <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Edit</div>
                                </div>
                                <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Delete</div>
                                </div>
                            </div>
                            {
                                this.state.selectedCustomer && this.state.selectedCustomer.locations.map((location) => (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', }}>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div >{this.state.selectedCustomer && location.name}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div >{this.state.selectedCustomer && location.state}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div >{this.state.selectedCustomer && location.city}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div >{this.state.selectedCustomer && location.street}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <i className="pi pi-user-edit" id='editLocationButton' onClick={() => { this.showEditLocationDialog(location.id) }} style={{ fontSize: '22px', width: 'fit-content' }}></i>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <i className="pi pi-trash" id='deleteLocationButton' onClick={() => { this.showRemoveLocationDialog(location.id) }} style={{ fontSize: '22px', color: '#fc4946', width: 'fit-content' }}></i>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* ADD CUSTOMER DIALOG */}
                <Toast ref={(el) => this.addCustomerToast = el} />
                <Dialog header="Add customer" visible={this.state.showAddCustomerDialog} footer={this.renderAddCustomerDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideAddCustomerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={this.state.customerForm.name} onChange={(this.customerNameChange)} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={this.state.customerForm.email} onChange={this.customerEmailChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="phone">Phone</label>
                            <InputText id="phone" value={this.state.customerForm.phone} onChange={this.customerPhoneChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="state">State/Province</label>
                            <InputText id="state" value={this.state.customerForm.state} onChange={this.customerStateChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="city">City</label>
                            <InputText id="city" value={this.state.customerForm.city} onChange={this.customerCityChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">Street</label>
                            <InputText id="street" value={this.state.customerForm.street} onChange={this.customerStreetChange} style={{ marginBottom: '40px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* EDIT CUSTOMER DIALOG */}
                <Toast ref={(el) => this.editCustomerToast = el} />
                <Dialog header="Edit customer" visible={this.state.showEditCustomerDialog} footer={this.renderEditCustomerDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideEditCustomerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={this.state.customerForm.name} onChange={this.customerNameChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={this.state.customerForm.email} onChange={this.customerEmailChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="phone">Phone</label>
                            <InputText id="phone" value={this.state.customerForm.phone} onChange={this.customerPhoneChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="state">State/Province</label>
                            <InputText id="state" value={this.state.customerForm.state} onChange={this.customerStateChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="city">City</label>
                            <InputText id="city" value={this.state.customerForm.city} onChange={this.customerCityChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">Street</label>
                            <InputText id="street" value={this.state.customerForm.street} onChange={this.customerStreetChange} style={{ marginBottom: '40px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* REMOVE DIALOG */}
                <Toast ref={(el) => this.removeCustomerToast = el} />
                <Dialog visible={this.state.showRemoveCustomerDialog} footer={this.renderRemoveCustomerDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideRemoveCustomerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '6vw', color: '#f8ce45' }}></i>
                        <div style={{ fontWeight: 'bold', fontSize: '1vw', marginTop: '50px' }}>Are you sure you want to delete {this.state.selectedCustomer && this.state.selectedCustomer.name} ?</div>
                    </div>
                </Dialog>
                {/* ADD LOCATION DIALOG */}
                <Toast ref={(el) => this.addLocationToast = el} />
                <Dialog header="Add location" visible={this.state.showAddLocationDialog} footer={this.renderAddLocationDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideAddLocationDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={this.state.locationForm.name} onChange={this.locationNameChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">State</label>
                            <InputText id="email" value={this.state.locationForm.state} onChange={this.locationStateChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="city">City</label>
                            <InputText id="city" value={this.state.locationForm.city} onChange={this.locationCityChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">Street</label>
                            <InputText id="street" value={this.state.locationForm.street} onChange={this.locationStreetChange} style={{ marginBottom: '40px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* EDIT LOCATION DIALOG */}
                <Toast ref={(el) => this.editLocationToast = el} />
                <Dialog header="Edit location" visible={this.state.showEditLocationDialog} footer={this.renderEditLocationDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideEditLocationDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={this.state.locationForm.name} onChange={this.locationNameChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">State</label>
                            <InputText id="email" value={this.state.locationForm.state} onChange={this.locationStateChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="city">City</label>
                            <InputText id="city" value={this.state.locationForm.city} onChange={this.locationCityChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">Street</label>
                            <InputText id="street" value={this.state.locationForm.street} onChange={this.locationStreetChange} style={{ marginBottom: '40px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* REMOVE LOCATION DIALOG */}
                <Toast ref={(el) => this.removeLocationToast = el} />
                <Dialog visible={this.state.showRemoveLocationDialog} footer={this.renderRemoveLocationDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideRemoveLocationDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '6vw', color: '#f8ce45' }}></i>
                        <div style={{ fontWeight: 'bold', fontSize: '1vw', marginTop: '50px' }}>Are you sure you want to delete this location ?</div>
                    </div>
                </Dialog>
            </div>
        )
    }
}












