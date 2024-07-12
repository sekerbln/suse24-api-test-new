import express from 'express'
import questionRouter from "./router/question.router.js";
import pollsRouter from "./router/polls.router.js";
const app = express()


app.use(express.json())

app.use('/', questionRouter);
app.use('/', pollsRouter);
export default app;
