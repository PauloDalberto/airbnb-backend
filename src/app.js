import express from 'express';
import routes from './routes'
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

class App {

  constructor(){
    this.server = express();

    require('dotenv').config();

    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    this.middlewares();
    this.routes();
  }
  
  middlewares() {
    this.server.use(cors())
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    )

    this.server.use(express.json())
  }

  routes() {  
    this.server.use(routes)
  }
}

export default new App().server;