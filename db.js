const { MongoClient } = require('mongodb')
require('dotenv').config();

let dbConnection
module.exports = {
  connectToDb: async (cb) => {
    const client = await new MongoClient(process.env.ATLAS_URI)
    let conn
    try{
      conn = await client.connect();
    }catch(e){
      console.error(e)
    }
    dbConnection = conn.db("myDatabase")
    return cb()
  },
  getDb: () => dbConnection
}