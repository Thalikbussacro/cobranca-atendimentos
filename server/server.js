import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./middleware/auth.js";
import clientesRouter from "./routes/clientes.js";
import cobrancasRouter from "./routes/cobrancas.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/cobrancas", cobrancasRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      success: false,
      message: err.message || "Erro interno do servidor",
    });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
