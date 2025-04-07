import express, {  Request, Response } from "express";
import adminRouter from "./routes/admin.router";
import userRouter from "./routes/user.router";
import { errorHandler } from "./utils/error";
import HttpStatus from "http-status-codes";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Routes
app.use("/api", [adminRouter, userRouter]);

// Handle method not allowed
app.use(function METHOD_NOT_ALLOWED(req: Request, res: Response) {
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
    error: {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      message: HttpStatus.getStatusText(HttpStatus.METHOD_NOT_ALLOWED),
    },
  });
});

// Global error handler
app.use(errorHandler);

export default app;
