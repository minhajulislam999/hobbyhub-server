const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://mm01882390860_db_user:0tySj1gPr6e96LJn@cluster0.7ud3uec.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const groupsCollection = client.db('hobbyhub').collection('groups');

app.get('/', (req, res) => {
  res.send('HobbyHub Server is running!');
});

app.get('/groups', async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = { userEmail: email };
  }
  const result = await groupsCollection.find(query).toArray();
  res.send(result);
});

app.get('/groups/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await groupsCollection.findOne(query);
  res.send(result);
});

app.post('/groups', async (req, res) => {
  const group = req.body;
  const result = await groupsCollection.insertOne(group);
  res.send(result);
});

app.put('/groups/:id', async (req, res) => {
  const id = req.params.id;
  const updatedGroup = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      groupName: updatedGroup.groupName,
      category: updatedGroup.category,
      description: updatedGroup.description,
      meetingLocation: updatedGroup.meetingLocation,
      maxMembers: updatedGroup.maxMembers,
      startDate: updatedGroup.startDate,
      imageURL: updatedGroup.imageURL,
    }
  };
  const result = await groupsCollection.updateOne(filter, updateDoc);
  res.send(result);
});

app.delete('/groups/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await groupsCollection.deleteOne(query);
  res.send(result);
});

client.connect().then(() => {
  
}).catch(console.dir);

module.exports = app;