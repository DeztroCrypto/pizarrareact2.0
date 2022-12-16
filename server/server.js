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
  //cors: {
  // origin: "http://localhost:3000",
  //},
});
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "../client/build")));
var canvasActual
let usuariosConectados = []
let id = 1
let usuarioHabilitadoDibujar
io.on("connection", (socket) => {
  console.log(socket.id);
  if (!usuarioHabilitadoDibujar) {
    usuarioHabilitadoDibujar = socket.id
  }
  usuariosConectados.push({ id: socket.id, nombre: `Usuario ${id}` })
  id++
  if (canvasActual) {
    socket.emit('cargarCanvas', { imgData: canvasActual })
  }
  socket.emit('brindarEdicionUsuarioHabilitado', { usuarioHabilitadoDibujar })
  socket.emit('envioUsuariosActuales', { lista: usuariosConectados, emit: true })
  socket.on('drawing', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('drawing', data)
  })
  socket.on('cargarLienzo', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('cargarLienzo', data)
  })
  socket.on('subirImagen', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('subirImagen', data)
  })
  socket.on('redimensionarImagen', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('redimensionarImagen', data)
  })
  socket.on('limpiarPizarra', (data) => {
    canvasActual = data.imgData
    socket.broadcast.emit('limpiarPizarra')
  })
  socket.on('ingresoUsuario', (data) => {
    socket.broadcast.emit('actualizarLista', data)
  })
  socket.on('pasarEdicion', (data) => {
    socket.broadcast.emit('pasarEdicion', data)
  })
  socket.on('levantarMano', (data) => {
    socket.broadcast.emit('levantarMano', data)
  })
  socket.on('bajarMano', (data) => {
    socket.broadcast.emit('bajarMano', data)
  })
});

server.listen(PORT);
console.log(`server on port ${PORT}`);