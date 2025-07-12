import { MongoClient } from "mongodb"

const uri = "mongodb://localhost:27017" // local MongoDB connection
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise
