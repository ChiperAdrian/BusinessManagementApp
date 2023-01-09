import {db} from "../firebase-config"

import {collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc} from "firebase/firestore"

class CustomersService {
    constructor() {
        this.customersCollection = collection(db, "Customers")

        this.getAllCustomers = async () => {
            const customers = []
            const ref = await getDocs(this.customersCollection)
            for (let i = 0; i < ref.docs.length; i++) {
                customers.push(ref.docs[i].data())
                customers[i].locations = await this.getAllLocations(customers[i].id)
            }
            return customers
        }

        this.getCustomerById = async (id) => {
            const ref = doc(db, "Customers", id)
            const customerDoc = await getDoc(ref)
            const customer = customerDoc.data()
            customer.locations = await this.getAllLocations(customer.id)
            return customer
        }

        this.getAllLocations = async (idOfCustomer) => {
            const locationsCollection = collection(db, "Customers", idOfCustomer, "Locations")
            const locations = []
            const ref = await getDocs(locationsCollection)
            for (let i = 0; i < ref.docs.length; i++) {
                locations.push(ref.docs[i].data())
            }

            return locations
        }

        this.getLocationById = async (customerID, locationID) => {
            const ref = doc(db, `Customers/${customerID}/Locations`, locationID)
            const locationDoc = await getDoc(ref)
            const location = locationDoc.data()
            return location
        }









        this.addCustomer = (newCustomer) => {
            setDoc(doc(db, "Customers", newCustomer.id), newCustomer) 
        }
        this.updateCustomer = (editedCustomer, id) => {
            const customerDoc = doc(db, "Customers", id)
            return updateDoc(customerDoc, editedCustomer)
        }
        this.deleteCustomer = (id) => {
            const customerDoc = doc(db, "Customers", id)
            return deleteDoc(customerDoc)
        }


        this.addLocation = (newLocation, idOfCustomer) => {
            setDoc(doc(db, `Customers/${idOfCustomer}/Locations`, newLocation.id), newLocation)
        }
        this.updateLocation = (editedLocation, idOfCustomer, idOfLocation) => {
            const locationDoc = doc(db, `Customers/${idOfCustomer}/Locations`, idOfLocation)
            return updateDoc(locationDoc, editedLocation)
        }
        this.deleteLocation = (idOfCustomer, idOfLocation) => {
            const locationDoc = doc(db, `Customers/${idOfCustomer}/Locations`, idOfLocation)
            deleteDoc(locationDoc)
        }


    }
}

export default new CustomersService()