const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yw8lqr5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri);
const run = async () => {

    try {
        const ServiceCollection = client.db("servise11").collection("services");
        const reviewCollection = client.db("servise11").collection("reviews");

        app.get('/services3', async (req, res) => {
            const query = {};
            const cursor = ServiceCollection.find(query);

            const results = await cursor.limit(3).toArray();
            res.send(results);
        })

        app.post('/services', async (req, res) => {
            const review = req.body;

            const results = await ServiceCollection.insertOne(review);
            res.send(results);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = ServiceCollection.find(query);

            const results = await cursor.toArray();
            res.send(results);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await ServiceCollection.findOne(query);
            res.send(service);
        })

        app.get('/reviews', async (req, res) => {
            let query = {};
            const serviceId = req.query.serviceId;
            const qEmail = req.query.email;
            if (serviceId) {
                query = {
                    serviceId: serviceId
                }
            } else if (qEmail) {
                query = {
                    email: qEmail
                }
            }

            const cursor = reviewCollection.find(query);
            const results = await cursor.toArray();

            res.send(results);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;

            const results = await reviewCollection.insertOne(review);
            res.send(results);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) }
            // console.log(query);

            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally { };
};
run();


app.get('/', (req, res) => {
    res.send('Welcome to assignment 11 server');
});

app.listen(port, () => {
    console.log('Assignment 11 server running on port ' + port);
});