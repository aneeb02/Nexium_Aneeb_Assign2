import { MongoClient } from "mongodb"

const uri = "mongodb://localhost:27017" // local MongoDB connection
const options = {}

let client: MongoClient
const clientPromise: Promise<MongoClient> =  global._mongoClientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

export default clientPromise
