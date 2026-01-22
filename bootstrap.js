import { config } from "dotenv";
import cors from "cors";
import userRouter from "./src/Modules/User/user.routes.js";
import companyRouter from "./src/Modules/Company/company.routes.js";
import dbConnection from "./DB/connection.js";
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js";
import jobRouter from "./src/Modules/Job/job.routes.js";

const bootstrap = (app, express) => {
  config();
  const port = process.env.PORT || 3000;
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({ message: "Start of API" });
  });

  app.use('/users', userRouter)
  app.use('/companies', companyRouter)
  app.use('/jobs', jobRouter)

  dbConnection()

  app.use(globalResponse)

  app.listen(port, () => console.log(`Server is running on port: ${port}`));
}

export default bootstrap;