import { config } from "dotenv";
config(); // Load env variables FIRST

import cors from "cors";
import userRouter from "./src/Modules/User/user.routes.js";
import companyRouter from "./src/Modules/Company/company.routes.js";
import dbConnection from "./DB/connection.js";
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js";
import jobRouter from "./src/Modules/Job/job.routes.js";

// Connect to DB immediately when module loads
let dbPromise = dbConnection();

const bootstrap = (app, express) => {
  app.use(cors());
  app.use(express.json());

  // Middleware to ensure DB is connected before handling requests
  app.use(async (req, res, next) => {
    try {
      await dbPromise;
      next();
    } catch (error) {
      next(error);
    }
  });

  app.get('/', (req, res) => {
    res.status(200).json({ message: "Start of API" });
  });

  app.use('/users', userRouter)
  app.use('/companies', companyRouter)
  app.use('/jobs', jobRouter)

  app.use(globalResponse)
}

export default bootstrap;