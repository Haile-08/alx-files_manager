import express from 'express';
import apiRouter from './routes/index';

const port = process.env.PORT || 5000;

const app = express();

apiRouter(app);

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});


export default app;