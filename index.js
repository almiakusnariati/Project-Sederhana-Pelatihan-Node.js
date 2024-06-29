import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import { addUser } from "./route/register.js";
import { login } from "./route/login.js";

import {
  addObat,
  deleteObatById,
  editObatById,
  getAllobat,
  getObatbyid,
} from "./route/obat.js";

const app = express();
const upload = multer({ dest: "public/photos" });

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/register", addUser);
app.use((req, res, next) => {
  console.log(req.path);
  if (req.path.startsWith("/api/login") || req.path.startsWith("/api/register")) {
    next();
  } else {
    let authorized = false;
    
    if (req.cookies.token) {
      try {
        req.me = jwt.verify(req.cookies.token, 'process.env.SECRET_KEY');
        authorized = true;
        console.log(authorized);
      } catch (err) {
        res.setHeader("Cache-Control", "no-store"); // khusus Vercel
        res.clearCookie("token");
      }
    }
    if (authorized) {
      if (req.path.startsWith("/login")) {
        res.redirect("/home");
      } else {
        next();
      }
    } else {
      if (req.path.startsWith("/login") || req.path.startsWith("/register")) {
        next();
      } else {
        if (req.path.startsWith("/api")) {
          res.status(401);
          res.send("Anda harus login terlebih dahulu.");
        } else {
          res.redirect("/login");
        }
      }
    }
  }
});
app.post("/api/login", login);
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/obat", getAllobat);
app.get("/api/obat/:id", getObatbyid);
app.post("/api/obat", upload.single("foto"), addObat);
app.put("/api/obat/:id", upload.single("foto"), editObatById);
app.delete("/api/obat/:id", deleteObatById);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server starts on port ${PORT}.`);
});