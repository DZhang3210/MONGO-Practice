const express = require('express')
const { getDb, connectToDb } = require('./db')
const { ObjectId } = require('mongodb')
const app = express();
app.use(express.json())

let db


connectToDb((err) => {
  if(!err){
    app.listen('3000', () => {
      console.log('app listening on port 3000')
    })
    db = getDb()
  }
})


app.get("/", async (req, res) => {
  let collection = await db.collection("recipes");
  let list = []
  //let query = {_id: new ObjectId(req.params.id)};
  let query = {}
  //let result = await collection.findOne(query);
  let result = await collection.find().forEach(d => list.push(d))
  if (!list) res.send("Not found").status(404);
  else res.send(list).status(200);
});

app.delete('/:id', async (req, res) => {
  if(ObjectId.isValid(req.params.id)){
    let collection = await db.collection("recipes");
    let query = {_id : new ObjectId(req.params.id)}
    //let query = {name: "loco moco"}
    let result = await collection.deleteOne(query)
    if (!result)res.status(404).send("Data not found")
    else res.status(200).send("Successfully Deleted")
  }else{
    res.status(500).json({error: "invalid id"})
  }
})

app.post('/', async (req, res) => {
  let collection = db.collection('recipes')
  let data = req.body
  //{"name":"patatas bravas","ingredients":["potato","tomato","olive oil","onion","garlic","paprika"],"prepTimeInMinutes":{"$numberInt":"72"}}
  let result = await collection.insertOne(data)
  if(!result){res.status(404).send("Data not found")}
  else{res.status(200).json(data)}
})

app.patch('/:id', async(req, res) =>{
  if (ObjectId.isValid(req.params.id)){
    let collection = db.collection('recipes')
    let filter = {_id : new ObjectId(req.params.id)}
    let changes= {name:"hello"}
    let result = await collection.updateOne(filter, {$set: changes})
    if(!result) res.status(404).send("No Matching Data")
    else res.status(200).send("Successful Patch")
  }else{
    res.status(500).send("Invalid ID")
  }
})
