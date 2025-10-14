const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:5001';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

let dbClient;
let plansCollection;

async function initDb(){
  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    const db = dbClient.db('smartplanner');
    plansCollection = db.collection('plans');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

app.post('/api/generate', async (req, res) => {
  try{
    if (!req.body.goal) {
      return res.status(400).json({error: 'Goal is required'});
    }
    const resp = await axios.post(`${AI_ENGINE_URL}/generate_plan`, req.body);
    const plan = resp.data;
    // store in db
    if (plansCollection) {
      const r = await plansCollection.insertOne({plan, createdAt: new Date()});
      return res.json({id: r.insertedId, plan});
    } else {
      return res.json({id: null, plan});
    }
  }catch(e){
    console.error('Generate plan error:', e.message);
    return res.status(500).json({error: 'Failed to generate plan: ' + e.message});
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const doc = await plansCollection.findOne({_id: new (require('mongodb').ObjectId)(id)});
    if(!doc) return res.status(404).json({error:'not found'});
    return res.json(doc);
  }catch(e){
    console.error(e);
    res.status(500).json({error: e.toString()});
  }
});

app.post('/api/export/pdf', async (req, res) => {
  try{
    const resp = await axios.post(`${AI_ENGINE_URL}/export/pdf`, req.body, {responseType: 'arraybuffer'});
    res.set('Content-Type', 'application/pdf');
    res.send(Buffer.from(resp.data, 'binary'));
  }catch(e){
    console.error(e.toString());
    res.status(500).json({error: e.toString()});
  }
});

initDb().then(()=>{
  app.listen(PORT, ()=> console.log(`Backend listening on http://localhost:${PORT}`));
}).catch(err=>{
  console.error('DB init failed:', err.message);
  console.log('Starting server without database connection...');
  app.listen(PORT, ()=> console.log(`Backend listening on http://localhost:${PORT} (no DB)`));
});
