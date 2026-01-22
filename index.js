import { config } from 'dotenv';
import express from 'express'


import userRouter from './src/Modules/User/user.routes.js';
import companyRouter from './src/Modules/Company/company.routes.js'
import dbConnection from './DB/connection.js';
import { globalResponse } from './src/Middlewares/error-handle.middleware.js';
import jobRouter from './src/Modules/Job/job.routes.js';

config();
const app = express();
app.use(express.json());

app.use('/users', userRouter)
app.use('/companies', companyRouter)
app.use('/jobs', jobRouter)

let port = process.env.PORT;
dbConnection()

app.use(globalResponse)


app.listen(port, () => console.log(`Server is running on port: ${port}`))