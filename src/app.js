import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import env from 'dotenv'

env.config()

import bookRoutes from './routes/book.routes.js'

//Se usa express para middleware
const app = express();
app.use(bodyParser.json()) //Parseador de Bodies

//Se conecta la bsae de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/books', bookRoutes)


const port = process.env.PORT || 3000

app.listen(port, () => {
    
})