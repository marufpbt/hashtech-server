const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const { ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edbhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

	const serviceCollection = client.db("hashtech").collection("services");
	const adminCollection = client.db("hashtech").collection("admins");
	const orderCollection = client.db("hashtech").collection("orders");
	const reviewCollection = client.db("hashtech").collection("reviews");

	//Create
	app.post('/addService', (req, res) => {
		const service = req.body;
		serviceCollection.insertOne(service)
			.then(result => {
				res.redirect('/')
			})
	})
	//Create
	app.post('/addAdmin', (req, res) => {
		const admin = req.body;
		adminCollection.insertOne(admin)
			.then(result => {
				res.redirect('/')
			})
	})
	//Read Services
	app.get('/services', (req, res) => {
		serviceCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})
	//Delete Service
	app.delete('/delete/:id', (req, res) => {
		serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
			.then(result => {
				res.send(result.deletedCount > 0)
			})
	})
	//Read
	app.get('/services/:id', (req, res) => {
		serviceCollection.find({ _id: ObjectId(req.params.id) })
			.toArray((err, documents) => {
				res.send(documents[0]);
			})
	})
	//Post
	app.post('/isAdmin', (req, res) => {
		const email = req.body.email;
		adminCollection.find({ email: email })
			.toArray((err, admins) => {
				res.send(admins.length > 0)
			})

	})
	//addOrder
	app.post('/addOrder', (req, res) => {
		const order = req.body;
		orderCollection.insertOne(order)
			.then(result => {
				res.redirect('/')
			})
	})
	//Read Order
	app.get('/orders', (req, res) => {
		orderCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})
	//Read Order Indivisual
	app.get('/orderItems', (req, res) => {
		orderCollection.find({ email: req.query.email })
			.toArray((err, documents) => {
				res.send(documents)
			})
	})
	//Update Order
	app.patch('/update/:id', (req, res) => {
		orderCollection.updateOne({_id: ObjectId(req.params.id)},
		{
		  $set: {status: req.body.value}
		})
		.then (result => {
		  res.send(result.modifiedCount > 0)
		})
	  })
	//Create Review
	app.post('/addReview', (req, res) => {
		const review = req.body;
		reviewCollection.insertOne(review)
			.then(result => {
				res.redirect('/')
			})
	})
	//Read Review
	app.get('/reviews', (req, res) => {
		reviewCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})

	//Create
	// app.post('/addDoctor', (req, res) => {
	// 	const admin = req.body;
	// 	adminCollection.insertOne(admin)
	// 		.then(result => {
	// 			console.log("data added succesfully", result);
	// 			res.redirect('/')
	// 		})
	// })
	//Read
	// app.get('/appointments', (req, res) => {
	// 	serviceCollection.find({})
	// 		.toArray((err, documents) => {
	// 			res.send(documents);
	// 		})
	// })
	//Read
	// app.get('/doctors', (req, res) => {
	// 	adminCollection.find({})
	// 		.toArray((err, documents) => {
	// 			res.send(documents);
	// 		})
	// })
	//Post
	// app.post('/appointmentsByDate', (req, res) => {
	// 	const date = req.body;
	// 	const email = req.body.email;
	// 	adminCollection.find({ email: email })
	// 		.toArray((err, doctors) => {
	// 			const filter = { date: date.date }
	// 			if (doctors.length === 0) {
	// 				filter.email = email;
	// 			}
	// 			serviceCollection.find(filter)
	// 				.toArray((err, documents) => {
	// 					res.send(documents)
	// 				})
	// 		})

	// })
	//Post
	// app.post('/isDoctor', (req, res) => {
	// 	const email = req.body.email;
	// 	adminCollection.find({ email: email})
	// 		.toArray((err, doctors) => {
	// 			res.send(doctors.length > 0)
	// 		})

	// })


});

app.listen(port)
