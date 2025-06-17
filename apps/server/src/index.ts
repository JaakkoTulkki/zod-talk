import express from 'express';
import {BodySchema, foo, QuerySchema} from 'shared'; 
import { validate } from './validate.ts';

const app = express()
const port = 3000



app.get('/user/:id/', validate({
  query: QuerySchema,
  body: BodySchema,
}), (req, res) => {
  console.log(foo())
  console.log(req.params);
  const query = req.query;
  const body = req.body;
  res.status(200).send({foo: 'cssry'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})