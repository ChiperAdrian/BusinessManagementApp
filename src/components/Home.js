import React, { Component, Suspense } from 'react'
import './Home.css'
import homeService from '../services/home-service'
import customersService from '../services/customers-service'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { uuidv4 } from '@firebase/util'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber';
import employeesService from '../services/employees-service'

class Work {
    constructor(id, date, type, hours, gross, expenses, customer, workers, location) {
        this.id = id
        this.date = date
        this.typeOfWork = type
        this.workHours = hours
        this.grossPerHour = gross
        this.otherExpenses = expenses
        this.customer = customer
        this.workers = workers
        this.location = location
    }
}
class Worker {
    constructor(id, employeeID, paymentPerHour, workHours) {
        this.id = id
        this.employee = employeeID
        this.paymentPerHour = paymentPerHour
        this.workHours = workHours
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.tax = 0.01
        this.state = {
            selectedMonth: "jan",
            selectedWork: null,
            selectedWorker: null,
            work: [],
            customers: [],
            employees: [],
            showAddWorkDialog: false,
            showEditWorkDialog: false,
            showDeleteWorkDialog: false,
            showAddWorkerDialog: false,
            showEditWorkerDialog: false,
            showDeleteWorkerDialog: false,
            workForm: {
                customer: "",
                date: "",
                grossPerHour: 0,
                id: "",
                location: "",
                workHours: 0,
                otherExpenses: 0,
                typeOfWork: "",
                workers: []
            },
            workerForm: {
                workHours: 0,
                paymentPerHour: 0,
                id: "",
                employee: ""
            },
            express: "Not fetched"
        }
        this.getCustomers()
        this.getEmployees()
        ////////////////// ADD WORK FORM UTIL //////////////////
        this.changeCustomer = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, customer: e.target.value } })
        }
        this.changeDate = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, date: e.target.value } })
        }
        this.changeGrossPerHour = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, grossPerHour: e.value } })
        }
        this.changeLocation = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, location: e.target.value } })
        }
        this.changeWorkHours = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, workHours: e.value } })
        }
        this.changeOtherExpenses = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, otherExpenses: e.value } })
        }
        this.changeTypeOfWork = (e) => {
            this.setState({ ...this.state, workForm: { ...this.state.workForm, typeOfWork: e.target.value } })
        }
        this.showAddWorkDialog = () => {
            this.setState({ ...this.state, showAddWorkDialog: true })
        }
        this.hideAddWorkDialog = () => {
            this.setState({ ...this.state, showAddWorkDialog: false })
        }
        this.showEditWorkDialog = () => {
            this.setState({
                ...this.state, showEditWorkDialog: true, workForm: {
                    customer: this.state.selectedWork.customer,
                    date: new Date(parseInt(this.state.selectedWork.date.substring(6, 10)), parseInt(this.state.selectedWork.date.substring(3, 5)) - 1, parseInt(this.state.selectedWork.date.substring(0, 2)),),
                    grossPerHour: this.state.selectedWork.grossPerHour,
                    id: this.state.selectedWork.id,
                    location: this.state.selectedWork.location,
                    workHours: this.state.selectedWork.workHours,
                    otherExpenses: this.state.selectedWork.otherExpenses,
                    typeOfWork: this.state.selectedWork.typeOfWork,
                    workers: {
                        id: "",
                        employee: "",
                        paymentPerHour: 0,
                        workHours: 0,
                    }
                },
            })
        }
        this.hideEditWorkDialog = () => {
            this.setState({
                ...this.state, showEditWorkDialog: false, workForm: {
                    customer: "",
                    date: "",
                    grossPerHour: 0,
                    id: "",
                    location: "",
                    workHours: 0,
                    otherExpenses: 0,
                    typeOfWork: "",
                    workers: {
                        id: "",
                        employee: "",
                        paymentPerHour: 0,
                        workHours: 0,
                    }
                },
            })
        }
        this.showRemoveWorkDialog = () => {
            this.setState({ ...this.state, showRemoveWorkDialog: true })
        }
        this.hideRemoveWorkDialog = () => {
            this.setState({ ...this.state, showRemoveWorkDialog: false })
        }
        this.showAddWorkSuccess = () => {
            this.addWorkToast.show({ severity: 'success', summary: 'Success', detail: 'Work successfully edited', life: 3000 });
        }
        this.showEditWorkSuccess = () => {
            this.editWorkToast.show({ severity: 'success', summary: 'Success', detail: 'Work successfully edited', life: 3000 });
        }
        this.showRemoveWorkSuccess = () => {
            this.removeWorkToast.show({ severity: 'success', summary: 'Success', detail: 'Work successfully deleted', life: 3000 });
        }

        ////////////////// ADD WORKERS FORM UTIL //////////////////
        this.changeWorkerWorkHours = (e) => {
            this.setState({ ...this.state, workerForm: { ...this.state.workerForm, workHours: e.value } })
        }
        this.changePayment = (e) => {
            this.setState({ ...this.state, workerForm: { ...this.state.workerForm, paymentPerHour: e.value } })
        }
        this.changeEmployee = (e) => {
            this.setState({ ...this.state, workerForm: { ...this.state.workerForm, employee: e.value } })
        }
        this.showAddWorkerSuccess = () => {
            this.addWorkerToast.show({ severity: 'success', summary: 'Success', detail: 'Worker successfully edited', life: 3000 });
        }
        this.showEditWorkerSuccess = () => {
            this.editWorkerToast.show({ severity: 'success', summary: 'Success', detail: 'Worker successfully edited', life: 3000 });
        }
        this.showRemoveWorkerSuccess = () => {
            this.removeWorkerToast.show({ severity: 'success', summary: 'Success', detail: 'Worker successfully deleted', life: 3000 });
        }


        this.showAddWorkerDialog = () => {
            this.setState({ ...this.state, showAddWorkerDialog: true })
        }
        this.hideAddWorkerDialog = () => {
            this.setState({ ...this.state, showAddWorkerDialog: false })
        }


        this.showDeleteWorkerDialog = (worker) => {
            this.setState((currentState, currentProps) => {
                return {
                    ...currentState,
                    showDeleteWorkerDialog: true,
                    selectedWorker: worker
                }
            })
            console.log(this.state)
        }
        this.hideDeleteWorkerDialog = () => {
            this.setState((currentState, currentProps) => {
                return {
                    ...currentState,
                    showDeleteWorkerDialog: false
                }
            })
        }


        this.showEditWorkerDialog = (worker) => {
            this.setState({
                ...this.state, showEditWorkerDialog: true, selectedWorker: worker, workerForm: {
                    workHours: "",
                    paymentPerHour: 0,
                    id: worker.id,
                    employee: ""
                }
            })
        }
        this.hideEditWorkerDialog = () => {
            this.setState({
                ...this.state, showEditWorkerDialog: false, workerForm: {
                    workHours: 0,
                    paymentPerHour: 0,
                    id: "",
                    employee: ""
                }
            })
        }
    }

    /////////////////////////////  COMPONENT WILL MOUNT /////////////////////////// 

    componentWillMount() {
        this.fetchWorkWithCustomerLocationWorkers()
    }
    fetchWorkWithCustomerLocationWorkers() {
        fetch("http://localhost:3001/getAllWorkWithCustomerLocationWorkers")
            .then(res => res.text())
            .then(res => {
                const data = JSON.parse(res)
                var works = []
                data.forEach(work => {
                    works.push(new Work(
                        work.id,
                        work.date,
                        work.typeOfWork,
                        work.workHours,
                        work.grossPerHour,
                        work.otherExpenses,
                        work.customer,
                        work.workers,
                        work.location
                    ))
                })
                this.setState({ ...this.state, work:works, selectedWork: works[0] })
            })

    }
    /////////////////////////////  WORK CRUD OPERATIONS /////////////////////////// 
    // async getAllWork() {
    //     const work = await homeService.getAllWork()
    //     this.setState({ ...this.state, work: work, selectedWork: work[0] })
    // }
    getNetIncome(id) {
        var net = 0
        this.state.work.forEach((work) => {
            if (work.id === id) {
                var gross = work.grossPerHour * work.workHours
                var workers = 0
                work.workers.forEach((worker) => {
                    workers += worker.paymentPerHour * worker.workHours
                })
                net = gross - (gross * this.tax) - workers - work.otherExpenses
            }
        })
        return net
    }
    getSelectedWorkNetIncome() {
        var net = 0
        var gross = this.state.selectedWork.grossPerHour * this.state.selectedWork.workHours
        var workers = 0
        this.state.selectedWork.workers.forEach((worker) => {
            workers += worker.paymentPerHour * worker.workHours
        })
        net = gross - (gross * this.tax) - workers - this.state.selectedWork.otherExpenses
        return net
    }
    getSelectedWorkWorkersPayment() {
        var pay = 0
        this.state.selectedWork.workers.forEach((worker) => {
            pay += worker.paymentPerHour * worker.workHours
        })
        return pay
    }

    async addWork() {
        const newWork = {
            id: uuidv4(),
            typeOfWork: this.state.workForm.typeOfWork,
            date: this.state.workForm.date.toLocaleDateString(),
            customer: this.state.workForm.customer.id,
            location: this.state.workForm.location.id,
            grossPerHour: this.state.workForm.grossPerHour,
            otherExpenses: this.state.workForm.otherExpenses,
            workHours: this.state.workForm.workHours,
        }
        try {
            await homeService.addWork(newWork)
            this.showAddWorkSuccess()
        } catch (err) {
            console.log("Failed to add customer:", err.message)
        }
    }
    async updateWork() {
        const editedWork = {
            id: this.state.workForm.id,
            customer: this.state.workForm.customer.id,
            date: this.state.workForm.date.toLocaleDateString(),
            grossPerHour: this.state.workForm.grossPerHour,
            location: this.state.workForm.location.id,
            otherExpenses: this.state.workForm.otherExpenses,
            typeOfWork: this.state.workForm.typeOfWork,
            workHours: this.state.workForm.workHours
        }
        try {
            await homeService.updateWork(editedWork, this.state.selectedWork.id)
            this.showEditWorkSuccess()
        } catch (err) {
            console.log("Error updating work:", err.message)
        }
    }

    async deleteWork() { // DELETE WORKERS COLLECTION ALSO!!!!!!
        try {
            await homeService.deleteWork(this.state.selectedWork.id)
            this.showRemoveWorkSuccess()
        } catch (err) {
            console.log("Error deleting work:", err.message)
        }
    }
    changeMonth(month) {
        this.setState({ ...this.state, selectedMonth: month })
    }

    /////////////////////////////  WORKER CRUD OPERATIONS /////////////////////////// 
    async addWorker() {
        const newWorker = {
            id: uuidv4(),
            workHours: this.state.workerForm.workHours,
            paymentPerHour: this.state.workerForm.paymentPerHour,
            employee: this.state.workerForm.employee.id
        }
        try {
            await homeService.addWorker(this.state.selectedWork.id, newWorker)
            this.showAddWorkerSuccess()
        } catch (err) {
            console.log("Failed to add worker:", err.message)
        }
    }
    async updateWorker() {// workerForm.employee CONTINE EMPLOYEE OBJECT. TREBUIE SA CONTINA ID. 
        this.setState((state, props) => {
            return {
                ...state,
                workerForm: {
                    ...state.workerForm,
                    employee: this.state.selectedWorker.employee.id
                }
            }
        })
        console.log(this.state)
        console.log(this.state.workerForm.employee)
        // try {
        //     await homeService.updateWorker(this.state.workerForm, this.state.selectedWork.id, this.selectedWorker.id)
        //     this.showEditWorkerSuccess()
        // } catch (err) {
        //     console.log("Error updating worker:", err.message)
        // }
    }

    deleteWorker() {
        try {
            homeService.deleteWorker(this.state.selectedWork.id, this.state.selectedWorker.id)
            this.showRemoveWorkerSuccess()
        } catch (err) {
            console.log("Error deleting worker")
        }
    }


    // ADD WORK FOOTERS
    renderAddWorkDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideAddWorkDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.addWork(); this.hideAddWorkDialog(); }}></Button>
            </div>
        )
    }
    renderEditWorkDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideEditWorkDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.updateWork(); this.hideEditWorkDialog(); }}></Button>
            </div>
        )
    }
    renderRemoveWorkDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideRemoveWorkDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.deleteWork(); this.hideRemoveWorkDialog(); }}></Button>
            </div>
        )
    }

    // ADD WORKER FOOTERS
    renderAddWorkerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideAddWorkerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.addWorker(); this.hideAddWorkerDialog(); }}></Button>
            </div>
        )
    }
    renderEditWorkerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideEditWorkerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.updateWorker(); this.hideEditWorkerDialog(); }}></Button>
            </div>
        )
    }
    renderDeleteWorkerDialogFooter() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={() => { this.hideDeleteWorkerDialog() }}></Button>
                <Button className="p-button-success" label="Submit" icon="pi pi-check" onClick={() => { this.deleteWorker(); this.hideDeleteWorkerDialog(); }}></Button>
            </div>
        )
    }
    /////////////////////////// GET CUSTOMERS AND EMPLOYEES /////////////////////////// 
    async getCustomers() {
        const customers = await customersService.getAllCustomers()
        this.setState({ ...this.state, customers: customers })
    }
    async getEmployees() {
        const employees = await employeesService.getAllEmployeesWithoutWork()
        this.setState({ ...this.state, employees: employees })
    }

    /////////////////////////// RENDER /////////////////////////// 
    render() {
        return (
            <div style={{ display: 'flex', width: '100%', minHeight: '100%', color: '#cfcccd' }}>
                {/* WORK LIST */}
                <div style={{ width: '50%', minHeight: '100%', paddingTop: '50px', }}>
                    <div style={{ display: 'flex', height: '1100px', flexDirection: 'column', gap: '30px', overflow: 'auto' }}>
                        <div style={{ display: 'flex', gap: '50px', borderBottom: '1px solid white' }}>
                            <div style={{ paddingLeft: '40px', display: 'flex', alignItems: 'center', color: '#cfcccd', fontSize: '42px', }}>
                                <i className="pi pi-calendar" style={{ fontSize: '42px', paddingRight: '20px', }} ></i>
                                <div style={{ fontWeight: 'bold', }}> 2022 </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '30px', color: '#75736e', fontWeight: 'bold', marginLeft: '40px', marginRight: '40px', fontSize: '18px', borderBottom: '1px solid #75736e' }}>
                            <div style={{ color: this.state.selectedMonth === 'jan' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('jan') }}>Jan</div>
                            <div style={{ color: this.state.selectedMonth === 'feb' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('feb') }}>Feb</div>
                            <div style={{ color: this.state.selectedMonth === 'mar' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('mar') }}>Mar</div>
                            <div style={{ color: this.state.selectedMonth === 'apr' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('apr') }}>Apr</div>
                            <div style={{ color: this.state.selectedMonth === 'may' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('may') }}>May</div>
                            <div style={{ color: this.state.selectedMonth === 'jun' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('jun') }}>Jun</div>
                            <div style={{ color: this.state.selectedMonth === 'jul' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('jul') }}>Jul</div>
                            <div style={{ color: this.state.selectedMonth === 'aug' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('aug') }}>Aug</div>
                            <div style={{ color: this.state.selectedMonth === 'sep' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('sep') }}>Sep</div>
                            <div style={{ color: this.state.selectedMonth === 'oct' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('oct') }}>Oct</div>
                            <div style={{ color: this.state.selectedMonth === 'nov' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('nov') }}>Nov</div>
                            <div style={{ color: this.state.selectedMonth === 'dec' ? '#f8ce45' : '#75736e', }} onClick={() => { this.changeMonth('dec') }}>Dec</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='monthSummaryCard'>
                                <i className="pi pi-money-bill" style={{ fontSize: '42px', paddingTop: '0.7vh' }}></i>
                                <div style={{ width: '100%', textAlign: 'center', fontSize: '22px' }}>Gross Income</div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#495057', paddingBottom: '1vh' }}>January 2022</div>
                                <div style={{ fontWeight: 'bold', fontSize: '22px', paddingBottom: '0.7vh' }}>€1800</div>

                            </div>
                            <div className='monthSummaryCard'>
                                <i className="pi pi-percentage" style={{ fontSize: '42px', paddingTop: '0.7vh', color: '#fc4946' }}></i>
                                <div style={{ width: '100%', textAlign: 'center', fontSize: '22px', color: '#fc4946' }}>Gross Income</div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#495057', paddingBottom: '1vh' }}>January 2022</div>
                                <div style={{ fontWeight: 'bold', fontSize: '22px', paddingBottom: '0.7vh', color: '#fc4946' }}>€1800</div>

                            </div>
                            <div className='monthSummaryCard'>
                                <i className="pi pi-wallet" style={{ fontSize: '42px', paddingTop: '0.7vh', color: '#2dc36a' }}></i>
                                <div style={{ width: '100%', textAlign: 'center', fontSize: '22px', color: '#2dc36a' }}>Gross Income</div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#495057', paddingBottom: '1vh' }}>January 2022</div>
                                <div style={{ fontWeight: 'bold', fontSize: '22px', paddingBottom: '0.7vh', color: '#2dc36a' }}>€1800</div>
                            </div>
                        </div>
                        <div className='workTable'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid white', }}>
                                <div style={{ textAlign: 'start', fontSize: '22px', alignSelf: 'flex-end', paddingBottom: '5px', }}>Work</div>
                                <i className="pi pi-plus" onClick={() => { this.showAddWorkDialog() }} style={{ fontSize: '28px', paddingBottom: '10px', paddingRight: '20px' }}></i>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', paddingTop: '20px', color: '#636363', marginBottom: '20px', }}>
                                <div style={{ minWidth: '100px', }}>Date</div>
                                <div style={{ minWidth: '100px', }}>Customer</div>
                                <div style={{ minWidth: '100px' }}>Location</div>
                                <div style={{ minWidth: '100px' }}>Hours</div>
                                <div style={{ minWidth: '100px' }}>Gross/h</div>
                                <div style={{ minWidth: '100px' }}>Gross Income</div>
                                <div style={{ minWidth: '100px' }}>Net Income</div>

                            </div>
                            {
                                this.state.work.length && this.state.work.map((work) => (
                                    <div className='workTableRow' onClick={() => { this.setState({ ...this.state, selectedWork: work }) }} style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', paddingTop: '10px', paddingBottom: '10px', background: this.state.selectedWork.id === work.id ? "#2c2a25" : "", borderLeft: this.state.selectedWork.id === work.id ? "5px solid #f8ce45" : "" }}>
                                        <div style={{ minWidth: '100px', alignSelf: 'center' }}>{work.date}</div>
                                        <div style={{ minWidth: '100px' }}>{work.customer.name}</div>
                                        <div style={{ minWidth: '100px' }}>{work.location.name}</div>
                                        <div style={{ minWidth: '100px' }}>{work.workHours}h</div>
                                        <div style={{ minWidth: '100px' }}>€{work.grossPerHour}</div>
                                        <div style={{ minWidth: '100px' }}>€{work.workHours * work.grossPerHour}</div>
                                        <div style={{ minWidth: '100px' }}>€{this.getNetIncome(work.id)}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* WORK INFO */}
                {/* HEADER */}
                <div style={{ width: '50%', minHeight: '100%', background: '#1f2125', paddingTop: '50px', }}>
                    <div style={{ paddingLeft: '40px', borderBottom: '1px solid white', display: 'flex', justifyContent: 'space-between', color: '#cfcccd', fontSize: '42px', }}>
                        <div style={{ display: 'flex', }}>
                            <i className="pi pi-building" style={{ fontSize: '42px', paddingRight: '10px', marginBottom: '4px' }} ></i>
                            <div style={{ fontWeight: 'bold', }}> {this.state.selectedWork && this.state.selectedWork.customer.name} </div>
                            <div style={{ fontWeight: 'bold', fontSize: '22px', marginLeft: '10px', alignSelf: 'flex-end', marginBottom: '4px' }}> {this.state.selectedWork && this.state.selectedWork.location.name} </div>
                        </div>
                        <div style={{ display: 'flex', marginRight: '20px', gap: '20px' }}>
                            <i className="pi pi-user-edit" id='editCustomerButton' onClick={() => { this.showEditWorkDialog() }} style={{ fontSize: '42px', alignSelf: 'center', }}></i>
                            <i className="pi pi-trash" id='deleteCustomerButton' onClick={() => { this.showRemoveWorkDialog() }} style={{ fontSize: '42px', color: '#fc4946', alignSelf: 'center', }}></i>
                        </div>
                    </div>
                    {/* ADDRESS INFO */}
                    <div className='customerDetailsCard'>
                        <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>General info</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Date</div>
                                <div >{this.state.selectedWork && this.state.selectedWork.date}</div>
                            </div>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>State</div>
                                <div >{this.state.selectedWork && this.state.selectedWork.location.state}</div>
                            </div>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>City</div>
                                <div >{this.state.selectedWork && this.state.selectedWork.location.city}</div>
                            </div>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Street</div>
                                <div >{this.state.selectedWork && this.state.selectedWork.location.street}</div>
                            </div>
                        </div>
                    </div>
                    {/* WORK INFO */}
                    <div className='customerDetailsCard'>
                        <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Work info</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Type of work</div>
                                <div >{this.state.selectedWork && this.state.selectedWork.typeOfWork}</div>
                            </div>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Hours</div>
                                <div >{this.state.selectedWork && this.state.selectedWork.workHours}h</div>
                            </div>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Gross/h</div>
                                <div >€{this.state.selectedWork && this.state.selectedWork.grossPerHour}</div>
                            </div>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Total Gross Inc.</div>
                                <div >€{this.state.selectedWork && this.state.selectedWork.grossPerHour * this.state.selectedWork.workHours}</div>
                            </div>
                        </div>
                    </div>
                    {/* WORKERS */}
                    <div className='workTable' style={{ height: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid white', }}>
                            <div style={{ textAlign: 'start', fontSize: '22px', alignSelf: 'flex-end', paddingBottom: '5px', }}>Workers</div>
                            <i className="pi pi-plus" onClick={this.showAddWorkerDialog} style={{ fontSize: '28px', paddingBottom: '10px', paddingRight: '20px' }}></i>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', paddingTop: '20px', color: '#636363', marginBottom: '20px', }}>
                            <div style={{ width: '14%' }}>Name</div>
                            <div style={{ width: '14%' }}>Email</div>
                            <div style={{ width: '14%' }}>Hours</div>
                            <div style={{ width: '14%' }}>Payment/h</div>
                            <div style={{ width: '14%' }}>Total</div>
                            <div style={{ width: '14%' }}>Edit</div>
                            <div style={{ width: '14%' }}>Delete</div>
                        </div>
                        {
                            this.state.selectedWork && this.state.selectedWork.workers.map((worker) => (
                                <div style={{ textAlign: 'start', display: 'flex', justifyContent: 'space-between', gap: '30px', paddingTop: '10px', paddingBottom: '10px' }}>
                                    <div style={{ width: '14%' }}>{worker.employee.name}</div>
                                    <div style={{ width: '14%' }}>{worker.employee.email}</div>
                                    <div style={{ width: '14%' }}>{worker.workHours}h</div>
                                    <div style={{ width: '14%' }}>€{worker.paymentPerHour}</div>
                                    <div style={{ width: '14%' }}>€{worker.workHours * worker.paymentPerHour}</div>
                                    <div style={{ width: '14%' }}>
                                        <i className="pi pi-user-edit" id='editCustomerButton' onClick={() => { this.showEditWorkerDialog(worker) }} style={{ width: 'fit-content', fontSize: '22px', alignSelf: 'center', }}></i>
                                    </div>
                                    <div style={{ width: '14%' }}>
                                        <i className="pi pi-trash" id='deleteCustomerButton' onClick={() => { this.showDeleteWorkerDialog(worker) }} style={{ width: 'fit-content', fontSize: '22px', color: '#fc4946', alignSelf: 'center', }}></i>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* SUMMARY */}
                    <div className='customerDetailsCard'>
                        <div style={{ borderBottom: '1px solid white', width: '100%', textAlign: 'start', fontSize: '22px' }}>Summary</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* <div style={{ width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', paddingBottom: '10px' }}>Gross Income</div>
                                <div >2200</div>
                            </div> */}
                            <div style={{ color: '#fc4946', width: 'fit-content', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ color: '#636363', display: 'flex', paddingBottom: '10px' }}>
                                    <i className="pi pi-money-bill" style={{ alignSelf: 'center', fontSize: '20px', marginRight: '5px', }}></i>
                                    Gross Income
                                </div>
                                <div style={{ alignSelf: 'center', color: '#cfcccd' }}>€{this.state.selectedWork && this.state.selectedWork.grossPerHour * this.state.selectedWork.workHours}</div>
                            </div>
                            <div style={{ color: '#fc4946', width: 'fit-content', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                    <i className="pi pi-percentage" style={{ fontSize: '15px', marginRight: '5px', }}></i>
                                    Workers payment
                                </div>
                                <div style={{ alignSelf: 'center', }}>€{this.state.selectedWork && this.getSelectedWorkWorkersPayment()}</div>
                            </div>
                            <div style={{ color: '#fc4946', width: 'fit-content', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                    <i className="pi pi-percentage" style={{ fontSize: '15px', marginRight: '5px', }}></i>
                                    Other expenses
                                </div>
                                <div style={{ alignSelf: 'center', }}>€{this.state.selectedWork && this.state.selectedWork.otherExpenses}</div>
                            </div>
                            <div style={{ color: '#fc4946', width: 'fit-content', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                    <i className="pi pi-percentage" style={{ fontSize: '15px', marginRight: '5px', }}></i>
                                    Tax
                                </div>
                                <div style={{ alignSelf: 'center', }}>€{this.state.selectedWork && this.state.selectedWork.grossPerHour * this.state.selectedWork.workHours * this.tax}</div>
                            </div>
                            <div style={{ color: '#2dc36a', width: 'fit-content', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                    <i className="pi pi-wallet" style={{ alignSelf: 'center', fontSize: '20px', marginRight: '5px', }}></i>
                                    Net Income
                                </div>
                                <div style={{ alignSelf: 'center', }}>€{this.state.selectedWork && this.getSelectedWorkNetIncome()}</div>
                            </div>
                            {/* <div style={{ color: '#2dc36a', width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', alignItems:'center', marginBottom:'5px', }}>
                                    <i className="pi pi-percentage" style={{ fontSize: '15px', marginRight:'5px', }}></i>
                                    Other Expenses
                                </div>
                                <div style={{paddingLeft:'50px'}}>€1500</div>
                            </div>
                            <div style={{ color: '#2dc36a', width: '25%', display: 'flex', flexDirection: 'column', textAlign: 'start', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', alignItems:'center', marginBottom:'5px', }}>
                                    <i className="pi pi-money-bill" style={{ fontSize: '22px', marginRight:'5px'}}></i>
                                    Profit
                                </div>
                                <div style={{paddingLeft:'20px'}}>€1500</div>
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* ADD WORK DIALOG */}
                <Toast ref={(el) => this.addWorkToast = el} />
                <Dialog header="Add location" visible={this.state.showAddWorkDialog} footer={this.renderAddWorkDialogFooter()} style={{ width: '30vw', height: '55vh' }} onHide={() => this.hideAddWorkDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Date</label>
                            <Calendar dateFormat="dd/mm/yy" id="icon" value={this.state.workForm.date} onChange={this.changeDate} showIcon style={{ marginBottom: '45px' }} />
                            <label htmlFor="email">Customer</label>
                            <Dropdown value={this.state.workForm.customer} options={this.state.customers} onChange={this.changeCustomer} optionLabel="name" placeholder="Select customer" style={{ width: '250px', marginBottom: '25px' }} />
                            <label htmlFor="email">Location</label>
                            <Dropdown value={this.state.workForm.location} options={this.state.workForm.customer.locations} onChange={this.changeLocation} optionLabel="name" placeholder="Select location" style={{ width: '250px', marginBottom: '25px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Type of work</label>
                            <InputText id="name" value={this.state.workForm.typeOfWork} onChange={this.changeTypeOfWork} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">Work hours</label>
                            <InputNumber value={this.state.workForm.workHours} onChange={this.changeWorkHours} style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Gross per hour</label>
                            <InputNumber inputId='currency-germany' mode="currency" currency='EUR' locale='de-DE' value={this.state.workForm.grossPerHour} onChange={this.changeGrossPerHour} style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Other expenses</label>
                            <InputNumber inputId='currency-germany' mode="currency" currency='EUR' locale='de-DE' value={this.state.workForm.otherExpenses} onChange={this.changeOtherExpenses} style={{ width: '250px', marginBottom: '45px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* EDIT WORK DIALOG */}
                <Toast ref={(el) => this.editWorkToast = el} />
                <Dialog header="Edit work" visible={this.state.showEditWorkDialog} footer={this.renderEditWorkDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideEditWorkDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Date</label>
                            <Calendar dateFormat="dd/mm/yy" id="icon" value={this.state.workForm.date} onChange={this.changeDate} showIcon style={{ marginBottom: '45px' }} />
                            <label htmlFor="email">Customer</label>
                            <Dropdown value={this.state.workForm.customer} options={this.state.customers} onChange={this.changeCustomer} optionLabel="name" placeholder="Select customer" style={{ width: '250px', marginBottom: '25px' }} />
                            <label htmlFor="email">Location</label>
                            <Dropdown value={this.state.workForm.location} options={this.state.workForm.customer.locations} onChange={this.changeLocation} optionLabel="name" placeholder="Select location" style={{ width: '250px', marginBottom: '25px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="name">Type of work</label>
                            <InputText id="name" value={this.state.workForm.typeOfWork} onChange={this.changeTypeOfWork} style={{ marginBottom: '40px' }} />
                            <label htmlFor="email">Work hours</label>
                            <InputNumber value={this.state.workForm.workHours} onChange={this.changeWorkHours} style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Gross per hour</label>
                            <InputNumber inputId='currency-germany' mode="currency" currency='EUR' locale='de-DE' value={this.state.workForm.grossPerHour} onChange={this.changeGrossPerHour} style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Other expenses</label>
                            <InputNumber inputId='currency-germany' mode="currency" currency='EUR' locale='de-DE' value={this.state.workForm.otherExpenses} onChange={this.changeOtherExpenses} style={{ width: '250px', marginBottom: '45px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* REMOVE WORK DIALOG */}
                <Toast ref={(el) => this.removeWorkToast = el} />
                <Dialog visible={this.state.showRemoveWorkDialog} footer={this.renderRemoveWorkDialogFooter()} style={{ width: '30vw', height: '55vh' }} onHide={() => this.hideRemoveWorkDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '6vw', color: '#f8ce45' }}></i>
                        <div style={{ fontWeight: 'bold', fontSize: '1vw', marginTop: '50px' }}>Are you sure you want to delete {this.state.selectedCustomer && this.state.selectedCustomer.name} ?</div>
                    </div>
                </Dialog>
                {/* ADD WORKER DIALOG */}
                <Toast ref={(el) => this.addWorkerToast = el} />
                <Dialog header="Add worker" visible={this.state.showAddWorkerDialog} footer={this.renderAddWorkerDialogFooter()} style={{ width: '30vw', height: '55vh', }} onHide={() => this.hideAddWorkerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="email">Employee</label>
                            <Dropdown value={this.state.workerForm.employee} options={this.state.employees} onChange={this.changeEmployee} optionLabel="name" placeholder="Select customer" style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Work hours</label>
                            <InputNumber value={this.state.workerForm.workHours} onChange={this.changeWorkerWorkHours} style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Payment per hour</label>
                            <InputNumber inputId='currency-germany' mode="currency" currency='EUR' locale='de-DE' value={this.state.workerForm.paymentPerHour} onChange={this.changePayment} style={{ width: '250px', marginBottom: '45px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* EDIT WORKER DIALOG */}
                <Toast ref={(el) => this.editWorkerToast = el} />
                <Dialog header="Edit work" visible={this.state.showEditWorkerDialog} footer={this.renderEditWorkerDialogFooter()} style={{ width: '30vw', height: '50vh' }} onHide={() => this.hideEditWorkerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '50px', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="email">Employee</label>
                            <Dropdown value={this.state.workerForm.employee} options={this.state.employees} onChange={this.changeEmployee} optionLabel="name" placeholder="Select customer" style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Work hours</label>
                            <InputNumber value={this.state.workerForm.workHours} onChange={this.changeWorkerWorkHours} style={{ width: '250px', marginBottom: '45px' }} />
                            <label htmlFor="email">Payment per hour</label>
                            <InputNumber inputId='currency-germany' mode="currency" currency='EUR' locale='de-DE' value={this.state.workerForm.paymentPerHour} onChange={this.changePayment} style={{ width: '250px', marginBottom: '45px' }} />
                        </div>
                    </div>
                </Dialog>
                {/* REMOVE WORKER DIALOG */}
                <Toast ref={(el) => this.removeWorkerToast = el} />
                <Dialog visible={this.state.showDeleteWorkerDialog} footer={this.renderDeleteWorkerDialogFooter()} style={{ width: '30vw', height: '55vh' }} onHide={() => this.hideDeleteWorkerDialog()} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '6vw', color: '#f8ce45' }}></i>
                        <div style={{ fontWeight: 'bold', fontSize: '1vw', marginTop: '50px' }}>Are you sure you want to delete?</div>
                    </div>
                </Dialog>
            </div >
        )
    }
}

{/* <i className="pi pi-money-bill" style={{ fontSize: '42px', paddingTop: '0.7vh', }}></i> */ }
{/* <i className="pi pi-percentage" style={{ fontSize: '42px', paddingTop: '0.7vh', color: '#d1193e' }}></i>
<i className="pi pi-percentage" style={{ fontSize: '42px', paddingTop: '0.7vh', color: '#ee3e38' }}></i> */}

{/* <div style={{ color: '#fc4946', fontSize: '26px', }}> 
    <i className="pi pi-percentage" style={{ fontSize: '42px', paddingTop: '0.7vh',  }}></i>
    <div>Expenses</div>
    <div style={{marginTop:'10px'}}>€1800</div>
</div> */}