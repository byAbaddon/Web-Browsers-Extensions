import { db } from '../service/sdk'
import { collection, getDocs, query, orderBy } from '/firebase/firestore'

const getAllRadioStationsFromBase = async () => {
  const radioStations = []
  try {
    const radioCollection = collection(db, 'radioData')
    const sortedRadioCollection = query(radioCollection, orderBy('name'))
    const querySnapshot = await getDocs(sortedRadioCollection)

    querySnapshot.forEach((doc) => {
      let allData = Object.assign({}, { id: doc.id }, doc.data())
      radioStations.push(allData)
     
    })

    console.log('Received data from Firebase:', radioStations)
  } catch (error) {
    console.error('Error fetching data from Firebase:', error)
  }

  return radioStations
}




export { getAllRadioStationsFromBase }