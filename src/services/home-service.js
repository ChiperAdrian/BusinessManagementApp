import { db } from "../firebase-config"
import customersService from "./customers-service"

import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore"
import employeesService from "./employees-service"

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

class HomeService {
    constructor() {
        this.workCollection = collection(db, "Work")
        this.getAllWork = async () => {
            var works = []
            const ref = await getDocs(this.workCollection)
            for (let i = 0; i < ref.docs.length; i++) {
                const work = ref.docs[i].data()
                // GET LOCATION
                work.location = await customersService.getLocationById(work.customer, work.location)
                // GET CUSTOMER
                work.customer = await customersService.getCustomerById(work.customer)
                // GET WORKERS
                work.workers = await this.getWorkers(work.id)
                works.push(new Work(work.id, work.date, work.typeOfWork, work.workHours, work.grossPerHour, work.otherExpenses, work.customer, work.workers, work.location))
            }
            return works
        }
        this.getWorkers = async (workID) => {
            var workers = []
            const workersCollection = collection(db, `Work/${workID}/Workers`)
            const ref = await getDocs(workersCollection)
            for (let i = 0; i < ref.docs.length; i++) {
                const worker = ref.docs[i].data()
                worker.employee = await employeesService.getEmployeeWithoutWorkById(worker.employee)
                workers.push(new Worker(worker.id, worker.employee, worker.paymentPerHour, worker.workHours))
            }
            return workers
        }
        this.getWorkById = async (id) => {
            const ref = doc(db, "Work", id)
            const workDoc = await getDoc(ref)
            const work = workDoc.data()
            work.location = await customersService.getLocationById(work.customer, work.location)
            work.customer = await customersService.getCustomerById(work.customer)
            work.workers = await this.getWorkers(work.id)
            return work
        }
        this.addWork = (newWork) => {
            setDoc(doc(db, "Work", newWork.id), newWork)
        }
        this.updateWork = (updatedWork, id) => {
            const workDoc = doc(db, "Work", id)
            return updateDoc(workDoc, updatedWork)
        }
        this.deleteWork = (id) => {
            const workDoc = doc(db, "Work", id)
            return deleteDoc(workDoc)
        }
        this.addWorker = (workId, newWorker) => {
            setDoc(doc(db, `Work/${workId}/Workers`, newWorker.id), newWorker)
        }
        this.deleteWorker = (workID, workerID) => {
            const workerDoc = doc(db, `Work/${workID}/Workers`, workerID)
            deleteDoc(workerDoc)
        }
        this.updateWorker = (editedWorker, idOfWork, idOfWorker) => {
            const workerDoc = doc(db, `Work/${idOfWork}/Workers`, idOfWorker)
            return updateDoc(workerDoc, editedWorker)
        }

        // this.addEmployee = (newEmployee) => {
        //     setDoc(doc(db, "Employees", newEmployee.id), newEmployee) 
        // }
        // async addEmployee() {
        //     const newEmployee = {
        //         id: uuidv4(),
        //         name: this.state.customerForm.name,
        //         ssn: this.state.customerForm.ssn,
        //         email: this.state.customerForm.email,
        //         phone: this.state.customerForm.phone,
        //         gender: this.state.customerForm.gender,
        //         birthday: this.state.customerForm.birthday,
        //         state: this.state.customerForm.state,
        //         city: this.state.customerForm.city,
        //         street: this.state.customerForm.street,
        //         zipCode: this.state.customerForm.zipCode,
        //         employeeSince: this.getTodayDate(),
        //         totalHoursWorked: 0,
        //         totalIncome: 0,
        //         totalPayment: 0,
        //         endDate: "",
        //         isActive: true,
        //         creditCard: this.state.customerForm.creditCard,
        //         creditCardNumber: this.state.customerForm.creditCardNumber,
        //         creditCardExpire: this.state.customerForm.creditCardExpire,
        //         creditCardCVV: this.state.customerForm.creditCardCVV,
        //         vacationDays: 30,
        //     }
        //     try {
        //         await employeesService.addEmployee(newEmployee)
        //         this.showAddCustomerSuccess()
        //     } catch (err) {
        //         console.log("Failed to add employee:", err.message)
        //     }
        // }



        // this.getCustomerById = async (id) => {
        //     const ref = doc(db, "Customers", id)
        //     const customerDoc = await getDoc(ref)
        //     const customer = customerDoc.data()
        //     customer.locations = await this.getAllLocations(customer.id)
        //     return customer
        // }


        // this.addCustomer = (newCustomer) => {
        //     setDoc(doc(db, "Customers", newCustomer.id), newCustomer) 
        // }

 
        // this.getAllCustomers = () => {
        //     return getDocs(this.customersCollection)
        // }
        // this.getCustomer = (id) => {
        //     const customerDoc = doc(db, "Customers", id)
        //     return getDocs(customerDoc)
        // }

        // this.addLocation = (newLocation, idOfCustomer) => {
        //     setDoc(doc(db, `Customers/${idOfCustomer}/Locations`, newLocation.id), newLocation)
        // }
        // this.updateLocation = (editedLocation, idOfCustomer, idOfLocation) => {
        //     const locationDoc = doc(db, `Customers/${idOfCustomer}/Locations`, idOfLocation)
        //     return updateDoc(locationDoc, editedLocation)
        // }
        // this.deleteLocation = (idOfCustomer, idOfLocation) => {
        //     const locationDoc = doc(db, `Customers/${idOfCustomer}/Locations`, idOfLocation)
        //     deleteDoc(locationDoc)
        // }
        // this.getAllLocations = (idOfCustomer) => {
        //     const locationsCol = collection(db, "Customers", idOfCustomer, "Locations")
        //     const locationsDocs = getDocs(locationsCol)
        //     return locationsDocs
        // }
    }
}

export default new HomeService()