import {db} from "../firebase-config"

import {collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc,} from "firebase/firestore"
import homeService from "./home-service"

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
        workIDs) {
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
        this.workIDs = workIDs
    }
}

class EmployeesService {
    constructor() {
        this.customersCollection = collection(db, "Employees")
        this.workCollection = collection(db, "Work")

        this.getEmployeeWithoutWorkById = async (id) => {
            const ref = doc(db, "Employees", id)
            const employeeDoc = await getDoc(ref)
            const employee = employeeDoc.data()
            return employee
        }

        this.getAllEmployeesWithWork = async () => {
            var employees = []
            const ref = await getDocs(this.customersCollection)
            for (let i = 0; i < ref.docs.length; i++) {
                const employee = ref.docs[i].data()
                for (let j = 0; j < employee.workIDs.length; j++) {
                    employee.workIDs[j] = await homeService.getWorkById(employee.workIDs[j])
                }
                employees.push(new Employee(
                    employee.id,
                    employee.name,
                    employee.ssn,
                    employee.birthday,
                    employee.gender,
                    employee.email,
                    employee.phone,
                    employee.state,
                    employee.city,
                    employee.street,
                    employee.zipCode,
                    employee.creditCard,
                    employee.creditCardNumber,
                    employee.creditCardExpire,
                    employee.creditCardCVV,
                    employee.employeeSince,
                    employee.isActive,
                    employee.endDate,
                    employee.totalHoursWorked,
                    employee.totalIncome,
                    employee.totalPayment,
                    employee.vacationDays,
                    employee.workIDs))
            }
            return employees
        }

        this.getAllEmployeesWithoutWork = async () => {
            var employees = []
            const ref = await getDocs(this.customersCollection)
            for (let i = 0; i < ref.docs.length; i++) {
                const employee = ref.docs[i].data()
                employees.push(new Employee(
                    employee.id,
                    employee.name,
                    employee.ssn,
                    employee.birthday,
                    employee.gender,
                    employee.email,
                    employee.phone,
                    employee.state,
                    employee.city,
                    employee.street,
                    employee.zipCode,
                    employee.creditCard,
                    employee.creditCardNumber,
                    employee.creditCardExpire,
                    employee.creditCardCVV,
                    employee.employeeSince,
                    employee.isActive,
                    employee.endDate,
                    employee.totalHoursWorked,
                    employee.totalIncome,
                    employee.totalPayment,
                    employee.vacationDays,
                    employee.workIDs))
            }
            return employees
        }

        // this.getAllWork = async () => {
        //     var works = []
        //     const ref = await getDocs(this.workCollection)
        //     for (let i = 0; i < ref.docs.length; i++) {
        //         const work = ref.docs[i].data()
        //         // GET LOCATION
        //         work.location = await customersService.getLocationById(work.customer, work.location)
        //         // GET CUSTOMER
        //         work.customer = await customersService.getCustomerById(work.customer)
        //         // GET WORKERS
        //         work.workers = await this.getWorkers(work.id)
        //         works.push(new Work(work.id, work.date, work.typeOfWork, work.workHours, work.grossPerHour, work.otherExpenses, work.customer, work.workers, work.location))
        //     }
        //     return works
        // }

        this.addEmployee = (newEmployee) => {
            setDoc(doc(db, "Employees", newEmployee.id), newEmployee) 
        }
        this.updateEmployee = (editedCustomer, id) => {
            const customerDoc = doc(db, "Employees", id)
            return updateDoc(customerDoc, editedCustomer)
        }
        this.deleteEmployee = (id) => {
            const customerDoc = doc(db, "Employees", id)
            return deleteDoc(customerDoc)
        }
        this.getAllEmployees = () => {
            return getDocs(this.customersCollection)
        }
        this.getCustomerById = (id) => {
            const docRef = doc(db, "Customers", id)
            const docSnap = getDoc(docRef)
            return docSnap
        }
        this.getLocationById = (customerID, locationID) => {
            const docRef = doc(db, `Customers/${customerID}/Locations`, locationID)
            const docSnap = getDoc(docRef)
            return docSnap
        }
        this.getCustomer = (id) => {
            const customerDoc = doc(db, "Employees", id)
            return getDocs(customerDoc)
        }
        this.getAllWork = () => {
            return getDocs(this.workCollection)
        }
        this.getWorkersOfWork = (id) => {
            const workersCol = collection(db, "Work", id, "Workers")
            const workersDocs = getDocs(workersCol)
            return workersDocs
        }
    }
}

export default new EmployeesService()

