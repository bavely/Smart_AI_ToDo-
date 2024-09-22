import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options: any = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow for global `var` declarations to avoid TypeScript errors
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve MongoClient across hot reloading
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  clientPromise.then(() => console.log('Connected to MongoDB'));
}

// Export the promise to be used in the app
export default clientPromise;
