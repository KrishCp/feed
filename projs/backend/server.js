/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import data from './data';
import config from './config';
// eslint-disable-next-line import/extensions
// import userRouter from './routers/userRouter';

// import { config } from 'dotenv';

const app = express();
app.use(cors());
// app.use('/api/users', userRouter);
app.get('/api/paypal/clientId',(req ,res) => {
  res.send({clientId: config.PAYPAL_CLIENT_ID});
});
app.get("/api/donations" , (req, res) => {
  res.send(data.donations); 
});
app.get('/api/donations/:id', (req,res)=> {
  // eslint-disable-next-line no-underscore-dangle
  const donation = data.donations.find((x) => x._id === req.params.id );
  if(donation){
    res.send(donation);
  }else {
    res.status(404).send({message: 'Product Not Found '}); 
  }
    
});

app.listen(5000, () => {
    console.log("server at http://localhost:5000");
});