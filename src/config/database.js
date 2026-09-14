import mongoose from "mongoose";

const connectDatabase = async () => {
    let MONGO_URI
    if(process.env.NODE_ENV === 'test'){
        MONGO_URI = process.env.MONGO_URI_DB_TEST
    }
    else{
        MONGO_URI = process.env.MONGO_URI_DB
    }
    try {
        await mongoose.connect(MONGO_URI)
        console.log('database connected')
    } catch (error) {
        console.error('Something went wrong when connecting to the databasse: ', error)
        process.exit(1)
    }
}

export default connectDatabase