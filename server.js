const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express() //this calls a function express that I pressume returns an object so the methods and properties can be used

app.listen(3000, function(){
    console.log('listening on port 3000')
})



const connectionString = 'mongodb+srv://niall:niall@cluster0.4twtnve.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    // ========================
    // Middlewares
    // ========================
    // Make sure you place body-parser before your CRUD handlers!
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    //this get method serves the index.html to the browser when it hears the request at '/' endpoint 
    // app.get('/', (req,res)=>{
    //     res.sendFile(__dirname + '/index.html')
    // })

    //display index.ejs with the quotes passed into the file in response to browser request
    //log database to the console is not working
      app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
          .then(results => {
            res.render('index.ejs', { quotes: results })
            console.log(results)
          })
          .catch(/* ... */)
      })

    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
        console.log(req.body)
      })

  })
  .catch(error => console.error(error))

//CRUD C - create (post), R - read (get), U - Update (put) - D delete (delete)
