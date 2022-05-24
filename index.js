const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akr63.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const laptopCollection =client.db('laptopCams').collection("laptops");
      app.post('/allproducts', async (req, res) => {
        const products = req.body;
        const result = await laptopCollection.insertOne(products);
        res.send(result.acknowledged)
    })
    app.get('/allproducts', async (req, res) => {
        const cursor = laptopCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })
    app.delete('/manage', async (req, res) => {
        const id = req.query.id;
        const query = { _id: ObjectId(id) }
        const result = await laptopCollection.deleteOne(query);
        res.send(result.acknowledged);
    })
     
      console.log('DB Connected');
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})