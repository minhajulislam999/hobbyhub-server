const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://transcendent-cocada-88d049.netlify.app'
  ]
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ud3uec.mongodb.net/?appName=Cluster0`;
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

// --- Updated Routes Start ---

app.get('/groups', async (req, res) => {
  try {
    await client.connect();
    const email = req.query.email;
    let query = {};
    if (email) {
      query = { userEmail: email };
    }
    const result = await groupsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/groups/:id', async (req, res) => {
  try {
    await client.connect();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await groupsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/groups', async (req, res) => {
  try {
    await client.connect();
    const group = req.body;
    const result = await groupsCollection.insertOne(group);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/groups/:id', async (req, res) => {
  try {
    await client.connect();
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
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/groups/:id', async (req, res) => {
  try {
    await client.connect();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await groupsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// --- Updated Routes End ---

// Vercel বা অন্য সার্ভার হোস্টের জন্য এই লাইনটি গুরুত্বপূর্ণ
module.exports = app;

// লোকাল পোর্টে চালানোর জন্য (Optional)
if (require.main === module) {
  
}
