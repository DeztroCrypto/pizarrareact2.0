import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";
import cors from "cors";

// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "../client/build")));
var canvasActual
io.on("connection", (socket) => {
  console.log(socket.id);
  if (canvasActual) {
    socket.emit('cargarCanvas', { imgData: canvasActual })
  }
  socket.on('drawing', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('drawing', data)
  })
  socket.on('subirImagen', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('subirImagen', data)
  })
  socket.on('redimensionarImagen', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('redimensionarImagen', data)
  })
  socket.on('limpiarPizarra', (data) =>{
    canvasActual = data.imgData
    socket.broadcast.emit('limpiarPizarra')
  })
});

server.listen(PORT);
console.log('server on port ${PORT}');