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
import employeesService from '../services/employees-service';
import './Employees.css'

class Employee {
    constructor(
        id,
        name,
        ssn,
        birthday,
        gender,
        email,
        phone,
        state,
        city,
        street,
        zipCode,
        creditCard,
        creditCardNumber,
        creditCardExpire,
        creditCardCVV,
        employeeSince,
        isActive,
        endDate,
        totalHoursWorked,
        totalIncome,
        totalPayment,
        vacationDays,
        work) {
        this.id = id
        this.name = name
        this.ssn = ssn
        this.birthday = birthday
        this.gender = gender
        this.email = email
        this.phone = phone
        this.state = state
        this.city = city
        this.street = street
        this.zipCode = zipCode
        this.creditCard = creditCard
        this.creditCardNumber = creditCardNumber
        this.creditCardExpire = creditCardExpire
        this.creditCardCVV = creditCardCVV
        this.employeeSince = employeeSince
        this.isActive = isActive
        this.endDate = endDate
        this.totalHoursWorked = totalHoursWorked
        this.totalIncome = totalIncome
        this.totalPayment = totalPayment
        this.vacationDays = vacationDays
        this.work = work
    }
}

class Work {
    constructor(id, date, type, hours, gross, expenses, customerID, locationID, workers) {
        this.id = id
        this.date = date
        this.typeOfWork = type
        this.workHours = hours
        this.grossPerHour = gross
        this.otherExpenses = expenses
        this.customerID = customerID
        this.locationID = locationID
        this.workers = workers
    }
}
class Worker {
    constructor(id, employeeID, paymentPerHour, workHours) {
        this.id = id
        this.employeeID = employeeID
        this.paymentPerHour = paymentPerHour
        this.workHours = workHours
    }
}

export default class Customers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customersFetched: false,
            customers: [],
            selectedCustomer: null,
            selectedInfoTab: 'personalInfo',
            selectedLocationId: null,
            showAddCustomerDialog: false,
            showEditCustomerDialog: false,
            showRemoveCustomerDialog: false,
            showAddLocationDialog: false,
            showEditLocationDialog: false,
            showRemoveLocationDialog: false,
            customerForm: {
                name: "",
                birthday: "",
                email: "",
                ssn: "",
                gender: "",
                phone: "",
                state: "",
                city: "",
                street: "",
                zipCode: "",
                creditCard: "",
                creditCardNumber: "",
                creditCardExpire: "",
                creditCardCVV: "",
            },
            locationForm: {
                name: "",
                state: "",
                city: "",
                street: ""
            },
            employees: "Not fetched",
            employeesFetched: false,

        }

        // ----------------------------CUSTOMER FORM----------------------------
        this.customerNameChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, name: e.target.value } })
        }
        this.customerBirthdayChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, birthday: e.target.value } })
        }
        this.customerSSNChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, ssn: e.target.value } })
        }
        this.customerGenderChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, gender: e.target.value } })
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
        this.customerZipCodeChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, zipCode: e.target.value } })
        }
        this.customerCreditCardChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, creditCard: e.target.value } })
        }
        this.customerCreditCardNumberChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, creditCardNumber: e.target.value } })
        }
        this.customerCreditCardExpireChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, creditCardExpire: e.target.value } })
        }
        this.customerCreditCardCVVChange = (e) => {
            this.setState({ ...this.state, customerForm: { ...this.state.customerForm, creditCardCVV: e.target.value } })
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

    // componentDidMount() {
    //     this.getEmployees()
    // }
    /////////////////////////////  COMPONENT WILL MOUNT /////////////////////////// 

    componentWillMount() {
        this.fetchEmployeesWithWork()
    }
    fetchEmployees() {
        fetch("http://localhost:3001/getEmployeesFB")
            .then(res => res.text())
            .then(res => {
                const data = JSON.parse(res)
                var employees = []
                data.forEach(employee => {
                    employees.push(new Employee(
                        employee.id,
                        employee.name,
                        employee.ssn ,
                        employee.birthday, 
                        employee.gender ,
                        employee.email ,
                        employee.phone ,
                        employee.state ,
                        employee.city ,
                        employee.street ,
                        employee.zipCode ,
                        employee.creditCard, 
                        employee.creditCardNumber, 
                        employee.creditCardExpire ,
                        employee.creditCardCVV ,
                        employee.employeeSince,
                        employee.isActive,
                        employee.endDate ,
                        employee.totalHoursWorked ,
                        employee.totalIncome ,
                        employee.totalPayment ,
                        employee.vacationDays ,
                        employee.work
                    ))
                })
                this.setState({ ...this.state, employees: employees, employeesFetched: true, selectedCustomer: employees[0]})
            })
    }
    fetchEmployeesWithWork() {
        fetch("http://localhost:3001/getAllEmployeesWithWork")
            .then(res => res.text())
            .then(res => {
                const data = JSON.parse(res)
                var employees = []
                data.forEach(employee => {
                    employees.push(new Employee(
                        employee.id,
                        employee.name,
                        employee.ssn ,
                        employee.birthday, 
                        employee.gender ,
                        employee.email ,
                        employee.phone ,
                        employee.state ,
                        employee.city ,
                        employee.street ,
                        employee.zipCode ,
                        employee.creditCard, 
                        employee.creditCardNumber, 
                        employee.creditCardExpire ,
                        employee.creditCardCVV ,
                        employee.employeeSince,
                        employee.isActive,
                        employee.endDate ,
                        employee.totalHoursWorked ,
                        employee.totalIncome ,
                        employee.totalPayment ,
                        employee.vacationDays ,
                        employee.workIDs
                    ))
                })
                this.setState({ ...this.state, employees: employees, employeesFetched: true, selectedCustomer: employees[0]})
            })
    }
   

    // ---------------------------- EMPLOYEES CRUD ----------------------------
    // async getEmployees() {
    //     var employees = await employeesService.getAllEmployeesWithWork()
    //     this.setState((currentState, currentprops) => {
    //         return {
    //             ...currentState,
    //             customers: employees,
    //             customersFetched: true,
    //             selectedCustomer: employees[0]
    //         }
    //     })
    // }
    async addEmployee() {
        const newEmployee = {
            id: uuidv4(),
            name: this.state.customerForm.name,
            ssn: this.state.customerForm.ssn,
            email: this.state.customerForm.email,
            phone: this.state.customerForm.phone,
            gender: this.state.customerForm.gender,
            birthday: this.state.customerForm.birthday,
            state: this.state.customerForm.state,
            city: this.state.customerForm.city,
            street: this.state.customerForm.street,
            zipCode: this.state.customerForm.zipCode,
            employeeSince: this.getTodayDate(),
            totalHoursWorked: 0,
            totalIncome: 0,
            totalPayment: 0,
            endDate: "",
            isActive: true,
            creditCard: this.state.customerForm.creditCard,
            creditCardNumber: this.state.customerForm.creditCardNumber,
            creditCardExpire: this.state.customerForm.creditCardExpire,
            creditCardCVV: this.state.customerForm.creditCardCVV,
            vacationDays: 30,
        }
        try {
            await employeesService.addEmployee(newEmployee)
            this.showAddCustomerSuccess()
        } catch (err) {
            console.log("Failed to add employee:", err.message)
        }
    }
    async updateEmployee() {
        try {
            await employeesService.updateEmployee(this.state.customerForm, this.state.selectedCustomer.id)
            this.showEditCustomerSuccess()
        } catch (err) {
            console.log("Error updating employee:", err.message)
        }
    }
    async deleteEmployee() {
        try {
            await employeesService.deleteEmployee(this.state.selectedCustomer.id)
            this.showRemoveCustomerSuccess()
        } catch (err) {
            console.log("Error deleting employee:", err.message)
        }
    }

    // ---------------------------- CUSTOMER FORM ----------------------------

    renderAddCustomerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideAddCustomerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.addEmployee(); this.hideAddCustomerDialog(); }}></Button>
            </div>
        )
    }
    renderEditCustomerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideEditCustomerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.updateEmployee(); this.hideEditCustomerDialog(); }}></Button>
            </div>
        )
    }
    renderRemoveCustomerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideRemoveCustomerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.deleteEmployee(); this.hideRemoveCustomerDialog(); }}></Button>
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
                gender: this.state.selectedCustomer.gender,
                birthday: this.state.selectedCustomer.birthday,
                ssn: this.state.selectedCustomer.ssn,
                email: this.state.selectedCustomer.email,
                phone: this.state.selectedCustomer.phone,
                state: this.state.selectedCustomer.state,
                city: this.state.selectedCustomer.city,
                street: this.state.selectedCustomer.street,
                zipCode: this.state.selectedCustomer.zipCode,
                creditCard: this.state.selectedCustomer.creditCard,
                creditCardNumber: this.state.selectedCustomer.creditCardNumber,
                creditCardExpire: this.state.selectedCustomer.creditCardExpire,
                creditCardCVV: this.state.selectedCustomer.creditCardCVV
            }
        })
    }
    hideEditCustomerDialog() {
        this.setState({
            ...this.state, showEditCustomerDialog: false, customerForm: {
                name: "",
                gender: "",
                birthday: "",
                ssn: "",
                email: "",
                phone: "",
                state: "",
                city: "",
                street: "",
                zipCode: "",
                creditCard: "",
                creditCardNumber: "",
                creditCardExpire: "",
                creditCardCVV: ""
            }
        })

    }
    showRemoveCustomerDialog() {
        this.setState({ ...this.state, showRemoveCustomerDialog: true })
    }
    hideRemoveCustomerDialog() {
        this.setState({ ...this.state, showRemoveCustomerDialog: false })
    }

    // ---------------------------- WORK FORM ----------------------------
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

    // UTILS
    async getCustomerByID(id) {
        const data = await employeesService.getCustomerById(id)
        const name = data.data().name
        return name
    }
    // getLocationByID(customerId, locationId) {
    //     const data = employeesService.getLocationByid(customerId, locationId)
    //     console.log(data)
    // }

    render() {
        return (
            <div style={{ display: 'flex', width: '100%', minHeight: '100%', color: '#cfcccd', textAlignLast: 'left', textAlign: 'left' }}>

                {/* CUSTOMERS LIST */}
                <div style={{ width: '50%', minHeight: '100%', paddingTop: '50px', }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '950px', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid white' }}>
                            <div style={{ fontSize: '42px', fontWeight: 'bold', paddingLeft: '40px', }}>Employees</div>
                            <i className="pi pi-plus" id="addCustomerButton" onClick={() => { this.showAddCustomerDialog() }} style={{ fontSize: '42px', color: '#cfcccd', paddingRight: '20px' }}></i>
                        </div>
                        {
                            this.state.employeesFetched && this.state.employees.map((customer) => (
                                <div className='customerCard' style={{ background: this.state.selectedCustomer.id === customer.id ? '#2c2a25' : '#17171b', borderLeft: this.state.selectedCustomer.id === customer.id ? '5px solid #f8ce45' : '' }} onClick={() => { this.setState({ ...this.state, selectedCustomer: customer }); }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                                        <div style={{ display: 'flex', }}>
                                            <Avatar icon="pi pi-user" className="mr-2" size="xlarge" />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '22px', paddingLeft: '20px' }}>{customer.name}</div>
                                                <div style={{ textAlign: 'start', paddingLeft: '20px', fontWeight: 'bold', 'fontSize': '10px', color: customer.isActive ? '#3db371' : '#a22c2a' }}>{customer.isActive ? "Active" : "Inactive"}</div>

                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px' }}>
                                            <div style={{ fontWeight: 'bold', 'fontSize': '12px', color: '#495057' }}>{customer.email}</div>
                                            <div style={{ fontWeight: 'bold', 'fontSize': '12px', color: '#495057' }}>{customer.phone}</div>
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
                                        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
                                            <div style={{ color: '#636363' }}>Total payment</div>
                                            <div style={{ paddingTop: '10px' }}>€{customer.totalPayment}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/* EMPLOYEE DETAILS */}
                <div style={{ width: '50%', minHeight: '100%', background: '#1f2125' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '50px', paddingLeft: '40px', paddingRight: '40px', borderBottom: '1px solid white' }}>
                        <div style={{ display: 'flex' }}>
                            <i className="pi pi-user" style={{ fontSize: '42px', paddingRight: '20px' }}></i>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '42px' }}>{this.state.selectedCustomer && this.state.selectedCustomer.name}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <i className="pi pi-user-edit" id='editCustomerButton' onClick={() => { this.showEditCustomerDialog() }} style={{ fontSize: '42px', alignSelf: 'center', }}></i>
                            <i className="pi pi-trash" id='deleteCustomerButton' onClick={() => { this.showRemoveCustomerDialog() }} style={{ fontSize: '42px', color: '#fc4946', alignSelf: 'center', }}></i>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '900px' }}>
                        {/* TABS */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='customerDetailsCard' id="personalInfo" style={{ textAlign: 'center', textAlignLast: 'center', background: this.state.selectedInfoTab === 'personalInfo' ? '#2c2a25' : '#17171b', borderLeft: this.state.selectedInfoTab === 'personalInfo' ? '5px solid #f8ce45' : '', minWidth: '200px' }} onClick={() => { this.setState({ ...this.state, selectedInfoTab: 'personalInfo' }) }}>
                                <i className="pi pi-id-card" style={{ fontSize: '32px' }}></i>
                                <div style={{ width: '100%', textAlign: 'center', fontSize: '22px' }}>Personal info</div>
                            </div>
                            <div className='customerDetailsCard' id="employmentInfo" style={{ textAlign: 'center', textAlignLast: 'center', minWidth: '200px', background: this.state.selectedInfoTab === 'employmentInfo' ? '#2c2a25' : '#17171b', borderLeft: this.state.selectedInfoTab === 'employmentInfo' ? '5px solid #f8ce45' : '', }} onClick={() => { this.setState({ ...this.state, selectedInfoTab: 'employmentInfo' }) }}>
                                <i className="pi pi-briefcase" style={{ fontSize: '32px' }}></i>
                                <div style={{ width: '100%', textAlign: 'center', fontSize: '22px' }}>Employment info</div>
                            </div>
                        </div>
                        {
                            this.state.selectedInfoTab === 'personalInfo' &&
                            <>
                                {/* GENERAL INFO */}
                                <div className='customerDetailsCard'>
                                    <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>General info</div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                                            <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                <div style={{ color: '#636363', paddingBottom: '10px' }}>SSN</div>
                                                <div >{this.state.selectedCustomer && this.state.selectedCustomer.ssn}</div>
                                            </div>
                                            <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Gender</div>
                                                <div >{this.state.selectedCustomer && this.state.selectedCustomer.gender}</div>
                                            </div>
                                            <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Birthday</div>
                                                <div >{this.state.selectedCustomer && this.state.selectedCustomer.birthday}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* ADDRESS */}
                                <div className='customerDetailsCard'>
                                    <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Address</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
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
                                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Zip Code</div>
                                            <div >{this.state.selectedCustomer && this.state.selectedCustomer.zipCode}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* FINANCE INFO */}
                                <div className='customerDetailsCard'>
                                    <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Finance info</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Card</div>
                                            <div >{this.state.selectedCustomer && this.state.selectedCustomer.creditCard}</div>
                                        </div>
                                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Credit card number</div>
                                            <div >{this.state.selectedCustomer && this.state.selectedCustomer.creditCardNumber}</div>
                                        </div>
                                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Expiration date</div>
                                            <div >{this.state.selectedCustomer && this.state.selectedCustomer.creditCardExpire}</div>
                                        </div>
                                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>CVV</div>
                                            <div >{this.state.selectedCustomer && this.state.selectedCustomer.creditCardCVV}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            ||

                            /* EMPLOYMENT INFO */
                            this.state.selectedInfoTab === 'employmentInfo' &&
                            <>
                                {/* CONTRACT INFO */}
                                <div className='customerDetailsCard'>
                                    <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Contract info</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                                        {
                                            this.state.selectedCustomer && this.state.selectedCustomer.isActive &&
                                            <>
                                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Active</div>
                                                    <i className="pi pi-check" style={{ fontWeight: 'bold', color: '#3db371' }}></i>
                                                </div>
                                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Employee since</div>
                                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.employeeSince}</div>
                                                </div>
                                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Vacation days</div>
                                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.vacationDays}</div>
                                                </div>
                                            </>
                                            ||
                                            this.state.selectedCustomer && !this.state.selectedCustomer.isActive &&
                                            <>
                                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Active</div>
                                                    <i className="pi pi-times" style={{ fontWeight: 'bold', color: '#fc4946' }}></i>
                                                </div>
                                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>Start date</div>
                                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.employeeSince}</div>
                                                </div>
                                                <div style={{ width: '33%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                                    <div style={{ color: '#636363', paddingBottom: '10px' }}>End date</div>
                                                    <div >{this.state.selectedCustomer && this.state.selectedCustomer.endDate}</div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                {/* WORK */}
                                <div className='workCard'>
                                    <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Work</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', paddingTop: '20px', color: '#636363' }}>
                                        <div style={{ minWidth: '100px' }}>Date</div>
                                        <div style={{ minWidth: '100px' }}>Customer</div>
                                        <div style={{ minWidth: '100px' }}>Location</div>
                                        <div style={{ minWidth: '100px' }}>Hours</div>
                                        <div style={{ minWidth: '100px' }}>Pay/h</div>
                                        <div style={{ minWidth: '100px' }}>Total</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {
                                            this.state.selectedCustomer && this.state.selectedCustomer.work.map((work) => (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', paddingTop: '20px', }}>
                                                    <div style={{ minWidth: '100px' }}>{work.date}</div>
                                                    <div style={{ minWidth: '100px' }}>{work.customer.name}</div>
                                                    <div style={{ minWidth: '100px' }}>{work.location.name}</div>
                                                    <div style={{ minWidth: '100px' }}>{work.workHours}</div>
                                                    <div style={{ minWidth: '100px' }}>{work.grossPerHour}</div>
                                                    <div style={{ minWidth: '100px' }}>{work.workHours * work.grossPerHour}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        }
                        {/* LOCATIONS */}
                        {/* <div className='customerDetailsCard' style={{ height: '500px', justifyContent: 'flex-start' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>
                                <div >Locations</div>
                                <i className="pi pi-plus" id='addLocationButton' style={{ fontSize: '22px', }} onClick={() => { this.showAddLocationDialog() }}></i>
                            </div>
                            {
                                this.state.selectedCustomer && this.state.selectedCustomer.locations.map((location) => (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', }}>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Location</div>
                                            <div >{this.state.selectedCustomer && location.name}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>State</div>
                                            <div >{this.state.selectedCustomer && location.state}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>City</div>
                                            <div >{this.state.selectedCustomer && location.city}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Street</div>
                                            <div >{this.state.selectedCustomer && location.street}</div>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Edit</div>
                                            <i className="pi pi-user-edit" id='editLocationButton' onClick={() => { this.showEditLocationDialog(location.id) }} style={{ fontSize: '22px', width: 'fit-content' }}></i>
                                        </div>
                                        <div style={{ width: '16.6%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                            <div style={{ color: '#636363', paddingBottom: '10px' }}>Delete</div>
                                            <i className="pi pi-trash" id='deleteLocationButton' onClick={() => { this.showRemoveLocationDialog(location.id) }} style={{ fontSize: '22px', color: '#fc4946', width: 'fit-content' }}></i>
                                        </div>
                                    </div>
                                ))
                            }
                        </div> */}
                    </div>
                </div>
                {/* ADD CUSTOMER DIALOG */}
                <Toast ref={(el) => this.addCustomerToast = el} />
                <Dialog header="Add employee" visible={this.state.showAddCustomerDialog} footer={this.renderAddCustomerDialogFooter()} style={{ width: '50vw', height: '60vh', maxWidth: '1050px', maxHeight: '600px' }} onHide={() => this.hideAddCustomerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '50px', gap: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Full name</label>
                            <InputText id="name" value={this.state.customerForm.name} onChange={(this.customerNameChange)} style={{ marginBottom: '40px' }} />
                            <label htmlFor="ssn">Gender</label>
                            <InputText id="ssn" value={this.state.customerForm.gender} onChange={this.customerGenderChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">Birthday</label>
                            <InputText id="email" value={this.state.customerForm.birthday} onChange={this.customerBirthdayChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="ssn">SSN</label>
                            <InputText id="ssn" value={this.state.customerForm.ssn} onChange={this.customerSSNChange} style={{ marginBottom: '40px' }} />
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
                            <label htmlFor="street">Zip code</label>
                            <InputText id="street" value={this.state.customerForm.zipCode} onChange={this.customerZipCodeChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="state">Card</label>
                            <InputText id="state" value={this.state.customerForm.creditCard} onChange={this.customerCreditCardChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="city">Credit card number</label>
                            <InputText id="city" value={this.state.customerForm.creditCardNumber} onChange={this.customerCreditCardNumberChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">Expiration date</label>
                            <InputText id="street" value={this.state.customerForm.creditCardExpire} onChange={this.customerCreditCardExpireChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">CVV</label>
                            <InputText id="street" value={this.state.customerForm.creditCardCVV} onChange={this.customerCreditCardCVVChange} style={{ marginBottom: '40px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* EDIT CUSTOMER DIALOG */}
                <Toast ref={(el) => this.editCustomerToast = el} />
                <Dialog header="Edit customer" visible={this.state.showEditCustomerDialog} footer={this.renderEditCustomerDialogFooter()} style={{ width: '50vw', height: '60vh', maxWidth: '1050px', maxHeight: '600px' }} onHide={() => this.hideEditCustomerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '50px', gap: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Full name</label>
                            <InputText id="name" value={this.state.customerForm.name} onChange={(this.customerNameChange)} style={{ marginBottom: '40px' }} />
                            <label htmlFor="ssn">Gender</label>
                            <InputText id="ssn" value={this.state.customerForm.gender} onChange={this.customerGenderChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">Birthday</label>
                            <InputText id="email" value={this.state.customerForm.birthday} onChange={this.customerBirthdayChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="ssn">SSN</label>
                            <InputText id="ssn" value={this.state.customerForm.ssn} onChange={this.customerSSNChange} style={{ marginBottom: '40px' }} />
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
                            <label htmlFor="street">Zip code</label>
                            <InputText id="street" value={this.state.customerForm.zipCode} onChange={this.customerZipCodeChange} style={{ marginBottom: '40px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="state">Card</label>
                            <InputText id="state" value={this.state.customerForm.creditCard} onChange={this.customerCreditCardChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="city">Credit card number</label>
                            <InputText id="city" value={this.state.customerForm.creditCardNumber} onChange={this.customerCreditCardNumberChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">Expiration date</label>
                            <InputText id="street" value={this.state.customerForm.creditCardExpire} onChange={this.customerCreditCardExpireChange} style={{ marginBottom: '40px' }} />
                            <label htmlFor="street">CVV</label>
                            <InputText id="street" value={this.state.customerForm.creditCardCVV} onChange={this.customerCreditCardCVVChange} style={{ marginBottom: '40px' }} />
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












