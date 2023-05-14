import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_URI}/?retryWrites=true&w=majority";`

export async function dbConnect() {
  return () => mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DB
  })
}
