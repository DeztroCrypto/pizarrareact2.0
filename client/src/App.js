import React, { useState } from "react";
import DrawingCanvas, { subir_imagen } from "./DrawingCanvas";
import { obtenerId } from "./DrawingCanvas";
import Barra_Herramientas from "./Barra_Herramientas";
import Barra_Colores from "./Barra_Colores"
import Barra_Grosor from "./Barra_Grosor";
import Barra_Funciones from "./Barra_Funciones";
import "./styles.css"
import "./w3.css"
import Barra_Figuras from "./Barra_Figuras";
import { useEffect } from "react";
import Barra_CRUD from "./Barra_CRUD";

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const crearBaseDeDatos = () => {
  if (!indexedDB) {
    console.log("IndexedDB no soportado")
    return
  }
  const request = indexedDB.open("Pizarra-DB", 1)
  request.onsuccess = () => {
    const bd = request.result
  }

  request.onupgradeneeded = () => {
    const bd = request.result
    bd.createObjectStore("lienzosGuardados", { keyPath: "nombre" })
  }
  request.onerror = (e) => {
    console.log("Error", e)
    console.log("An error occurred with IndexedDB")
  }
}
var actuImg
function App(props) {
  useEffect(() => {
    crearBaseDeDatos()
    leerLienzos()
  }, [])
  const socket = props.socket
  const [figura, setFigura] = useState("linea")
  const [colorAct, setColor] = useState("black")
  const [grosorAct, setGrosor] = useState(3)
  const [img, setImg] = useState(null)
  const [newImg, setnewImg] = useState(null)
  const [newWidth, setWidth] = useState(200)
  const [newHeight, setHeight] = useState(200)
  const [deshabilitado, setDeshabilitado] = useState(true)
  const [listaUsuarios, setListaUsuarios] = useState(null)
  useEffect(() => {
    leerLienzos()
  }, [deshabilitado])
  const cambiar_color = (element) => {
    setColor(element.target.value)
  }

  const cambiar_grosor = (element) => {
    setGrosor(element.target.value)
  }

  const cambiar_lapiz = () => {
    setFigura("linea")
    if (colorAct === "#ffffff") {
      setColor("black")
    }
    document.getElementById("resize").style.display = "none";
  }

  const cambiar_borrador = () => {
    setFigura("linea")
    setColor("#ffffff")
    document.getElementById("resize").style.display = "none";
  }

  const dibujarCuadrado = () => {
    setFigura("cuadrado")
    if (colorAct === "#ffffff") {
      setColor("black")
    }
    document.getElementById("resize").style.display = "none";
  }


  const dibujarTriangulo = () => {
    setFigura("triangulo")
    if (colorAct === "#ffffff") {
      setColor("black")

    }
    document.getElementById("resize").style.display = "none";
  }


  const dibujarCirculo = () => {
    setFigura("circulo")
    if (colorAct === "#ffffff") {
      setColor("black")

    }
    document.getElementById("resize").style.display = "none";
  }

  const guardarLienzo = () => {
    const dbPromise = indexedDB.open("Pizarra-DB", 1)
    dbPromise.onsuccess = () => {
      const bd = dbPromise.result
      let ingresoTexto = document.getElementById("ingresoNombreLienzo")
      if (ingresoTexto.value) {
        const transaction = bd.transaction(["lienzosGuardados"], "readwrite")
        const lienzoStore = transaction.objectStore("lienzosGuardados")
        const canvas = document.getElementById('pizarra')
        var image = canvas.toDataURL();
        var nombre = ingresoTexto.value

        const transactionRead = bd.transaction(["lienzosGuardados"], "readonly")
        const lienzoRead = transactionRead.objectStore("lienzosGuardados")
        const requestRead = lienzoRead.get(nombre)
        requestRead.onsuccess = () => {
          const newtransaction = bd.transaction(["lienzosGuardados"], "readwrite")
          const newlienzoStore = newtransaction.objectStore("lienzosGuardados")
          if (requestRead.result) {
            const requestAdd = newlienzoStore.put({
              nombre,
              image
            })
            alert(`Lienzo ${nombre} actualizado`)
            ingresoTexto.value = ""
          } else {
            const requestAdd = newlienzoStore.add({
              nombre,
              image
            })
            alert(`Lienzo guardado con el nombre ${ingresoTexto.value}`)
            ingresoTexto.value = ""
          }
          leerLienzos()
        }

      } else {
        alert("Ingrese un nombre al lienzo porfavor")
      }
    }
  }

  const leerLienzos = () => {
    const dbPromise = indexedDB.open("Pizarra-DB", 1)
    dbPromise.onsuccess = () => {
      const bd = dbPromise.result
      const lienzos = document.getElementById("lienzos")
      const transaction = bd.transaction(["lienzosGuardados"], "readonly")
      const lienzoStore = transaction.objectStore("lienzosGuardados")
      const request = lienzoStore.openCursor()
      const fragment = document.createDocumentFragment()

      request.onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
          const img = document.createElement("img")
          const nombrePizarra = document.createElement("label")
          img.src = cursor.value.image
          img.id = "lienzoGuardado"
          nombrePizarra.innerHTML = cursor.value.nombre
          const elementoLienzo = document.createElement("div")
          elementoLienzo.id = "elementoLienzo"
          elementoLienzo.appendChild(nombrePizarra)
          elementoLienzo.appendChild(img)
          const divBotones = document.createElement("div")
          divBotones.id = "botonesLienzoGuardado"
          const botonActualizar = document.createElement("button")
          botonActualizar.textContent = "Cargar"
          botonActualizar.id = "botonCRUD"
          botonActualizar.className = "botonCRUD"
          botonActualizar.onclick = cargarLienzo
          botonActualizar.id = "botonCRUD"
          botonActualizar.dataset.nombre = cursor.value.nombre
          divBotones.appendChild(botonActualizar)
          const botonEliminar = document.createElement("button")
          botonEliminar.textContent = "Eliminar"
          botonEliminar.id = "botonCRUD"
          botonEliminar.className = "botonCRUD"
          botonEliminar.onclick = eliminarLienzo
          botonEliminar.dataset.nombre = cursor.value.nombre
          divBotones.appendChild(botonEliminar)
          if (deshabilitado) {
            botonActualizar.disabled = true
            botonEliminar.disabled = true
          }
          elementoLienzo.appendChild(divBotones)
          fragment.appendChild(elementoLienzo)
          cursor.continue()
        } else {
          lienzos.textContent = ""
          lienzos.appendChild(fragment)
        }
      }
    }
  }

  const cargarLienzo = (e) => {
    const key = e.target.dataset.nombre
    const dbPromise = indexedDB.open("Pizarra-DB", 1)
    dbPromise.onsuccess = () => {
      const bd = dbPromise.result
      const transaction = bd.transaction(["lienzosGuardados"], "readonly")
      const lienzoStore = transaction.objectStore("lienzosGuardados")
      const request = lienzoStore.get(key)
      request.onsuccess = () => {
        socketCargarLienzo(request.result.image,true)
        document.getElementById("ingresoNombreLienzo").value = request.result.nombre
        cambiar_lapiz()
      }
    }
  }

  function cargarLienzoSocket(data){
      socketCargarLienzo(data.lienzo)
  }

  const socketCargarLienzo = (lienzo,emit) => {
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext("2d")
    const imagen = new Image
    imagen.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(imagen, 0, 0)
      const imgData = canvas.toDataURL()
      if(!emit){
        return
      }
      socket.emit('cargarLienzo',{
        lienzo,
        imgData
      })
    }
    imagen.src = lienzo
  }

  const eliminarLienzo = (e) => {
    const key = e.target.dataset.nombre
    const dbPromise = indexedDB.open("Pizarra-DB", 1)
    dbPromise.onsuccess = () => {
      const bd = dbPromise.result
      const transaction = bd.transaction(["lienzosGuardados"], "readwrite")
      const lienzoStore = transaction.objectStore("lienzosGuardados")
      const request = lienzoStore.delete(key)
      request.onsuccess = () => {
        leerLienzos()
        alert(`El lienzo ${key} se eliminará`)
      }
    }
  }

  //////
  socket.on('subirImagen', subirImagen)
  socket.on('redimensionarImagen', redimensionarImagen)
  socket.on('cargarLienzo',cargarLienzoSocket)
  socket.on('limpiarPizarra', limpiarPizarra)
  socket.on('envioUsuariosActuales', recargarListaUsuarios)
  socket.on('actualizarLista', recargarListaUsuarios)
  socket.on('levantarMano', levantarManoUsuario)
  socket.on('bajarMano', bajarManoUsuario)
  socket.on('brindarEdicionUsuarioHabilitado', habilitarEdicion)
  socket.on('pasarEdicion', pasarEdicionUsuario)
  /////

  function habilitarEdicion(data) {
    if (data.usuarioHabilitadoDibujar === socket.id) {
      setDeshabilitado(false)
    }
  }

  function recargarListaUsuarios(data) {
    const fragment = document.createDocumentFragment()
    const sectorUsuarios = document.getElementById("sectorListaUsuarios")
    sectorUsuarios.innerHTML = ""
    let listaUsuarios = data.lista
    setListaUsuarios(listaUsuarios)
    for (let indice in listaUsuarios) {
      const divUsuario = document.createElement("div")
      divUsuario.className = "usuario"
      const labelUsuario = document.createElement("label")
      labelUsuario.innerHTML = listaUsuarios[indice].nombre
      const botonPasarEdicion = document.createElement("button")
      botonPasarEdicion.textContent = "Pasar lápiz"
      botonPasarEdicion.className = "botonUsuario"
      botonPasarEdicion.id = listaUsuarios[indice].id
      botonPasarEdicion.onclick = pasarEdicion
      botonPasarEdicion.dataset.id = listaUsuarios[indice].id
      botonPasarEdicion.style.visibility = "hidden"

      divUsuario.appendChild(labelUsuario)
      divUsuario.appendChild(botonPasarEdicion)
      fragment.appendChild(divUsuario)
    }
    sectorUsuarios.appendChild(fragment)
    if (!data.emit) {
      return
    }
    socket.emit('ingresoUsuario', { lista: listaUsuarios })
  }

  const pasarEdicion = (event) => {
    const idNuevoUsuarioHabilitado = event.target.dataset.id
    if (socket.id !== idNuevoUsuarioHabilitado) {
      setDeshabilitado(true)
      socketPasarEdicion(idNuevoUsuarioHabilitado, true)
    }else{
      alert("No tienes permiso para hacer eso")
    }
  }

  function pasarEdicionUsuario(data) {
    socketPasarEdicion(data.id)
  }

  const socketPasarEdicion = (id, emit) => {
    if (socket.id === id) {
      setDeshabilitado(false)
    }
    if (!emit) {
      return
    }
    socket.emit('pasarEdicion', {
      id
    })
  }

  const levantarMano = () => {
    const botonLevantarMano = document.getElementById("botonLevantarMano")
    botonLevantarMano.style.visibility = "hidden"
    const botonBajarMano = document.getElementById("botonBajarMano")
    botonBajarMano.style.visibility = "visible"
    socketLevantarMano(socket.id, true)
  }

  function levantarManoUsuario(data) {
    socketLevantarMano(data.id)
  }

  const socketLevantarMano = (id, emit) => {
    const botonRespectivoUsuario = document.getElementById(id)
    botonRespectivoUsuario.style.visibility = "visible"
    if (!emit) {
      return
    }
    socket.emit('levantarMano', {
      id
    })
  }

  const bajarMano = () => {
    const botonBajarMano = document.getElementById("botonBajarMano")
    botonBajarMano.style.visibility = "hidden"
    const botonLevantarMano = document.getElementById("botonLevantarMano")
    botonLevantarMano.style.visibility = "visible"
    socketBajarMano(socket.id, true)
  }

  function bajarManoUsuario(data) {
    socketBajarMano(data.id)
  }

  const socketBajarMano = (id, emit) => {
    const botonRespectivoUsuario = document.getElementById(id)
    botonRespectivoUsuario.style.visibility = "hidden"
    if (!emit) {
      return
    }
    socket.emit('bajarMano', {
      id
    })
  }

  function limpiarPizarra() {
    socketLimpiarPizarra()
  }

  const limpiar_pizarra = () => {
    socketLimpiarPizarra(true)
    document.getElementById("resize").style.display = "none";
  }

  const socketLimpiarPizarra = (emit) => {
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    let imgData = canvas.toDataURL()
    if (!emit) {
      return
    }
    socket.emit('limpiarPizarra', {
      imgData
    })
  }

  const subir_imagen = () => {
    const file = document.querySelector('#inp').files[0]
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext('2d')
    actuImg = canvas.toDataURL()
    setnewImg(actuImg)

    setWidth(200)
    setHeight(200)
    const src = URL.createObjectURL(file)
    setImg(src)
    socketSubirImagen(src, newWidth, newHeight, true)
    setFigura('img')
    document.querySelector('#inp').addEventListener('onchange', function (e) {
      e.currentTarget.files = null;
    })
  }

  const socketSubirImagen = (src, newWidth, newHeight, emit) => {
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext('2d')
    let img = document.createElement('img')
    var imgData
    img.id = 'imgSub'
    img.src = src
    img.onload = () => {
      context.drawImage(img, 0, 0, newWidth, newHeight)
      document.getElementById("resize").style.display = "block";
      imgData = canvas.toDataURL()
      if (!emit) {
        return
      }
      socket.emit('subirImagen', {
        src,
        newWidth,
        newHeight,
        imgData
      })
    }
  }
  function subirImagen(data) {
    socketSubirImagen(data.src, data.newWidth, data.newHeight)
  }

  const downloadImg = () => {
    let enlace = document.createElement('a')
    enlace.download = "lienzo.png"
    const canvas = document.getElementById('pizarra')

    enlace.href = canvas.toDataURL();
    enlace.click();
  }


  const resizeImg = () => {
    const file = document.querySelector('input[type=file]').files[0]
    const src = URL.createObjectURL(file)
    const widthImg = document.getElementById('w').value
    const heightImg = document.getElementById('h').value
    setWidth(widthImg)
    setHeight(heightImg)
    socketResizeImg(src, widthImg, heightImg, actuImg, true)
    setFigura('img')
  }

  function redimensionarImagen(data) {
    socketResizeImg(data.src, data.newWidth, data.newHeight, data.actuImg)
  }

  const socketResizeImg = (src, newWidth, newHeight, actuImg, emit) => {
    let img = new Image
    let BGImg = new Image
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext('2d')
    BGImg.src = actuImg
    img.src = src
    img.id = 'imgSub'
    var imgData
    BGImg.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(BGImg, 0, 0)
    }
    img.onload = () => {
      context.drawImage(img, 0, 0, newWidth, newHeight)
      imgData = canvas.toDataURL()
      if (!emit) {
        return
      }
      socket.emit('redimensionarImagen', {
        src,
        newWidth,
        newHeight,
        actuImg,
        imgData
      })
    }

  }


  return <>
    <div className="principal">
      <div className="w3-col guardado">
        <div>
          <Barra_CRUD funcionGuardarLienzo={guardarLienzo} funcionCargarLienzo={cargarLienzo} deshabilitado={deshabilitado} />
        </div>
        <div id="contenedorLienzos">
          <div id="lienzos"></div>
        </div>
      </div>
      <div className="w3-col pizarra">
        <DrawingCanvas
          color={colorAct}
          grosor={grosorAct}
          figura={figura}
          img={img}
          newImg={newImg}
          newWidth={newWidth}
          newHeight={newHeight}
          socket={socket}
          deshabilitado={deshabilitado}
        ></DrawingCanvas>
      </div>
      <div className="w3-col tools">
        <div className="w3-col">
          <Barra_Herramientas funcionPincel={cambiar_lapiz} funcionBorrador={cambiar_borrador} deshabilitado={deshabilitado} />
        </div>
        <div className="w3-col">
          <Barra_Colores funcionColor={cambiar_color} deshabilitado={deshabilitado} />
        </div>
        <div className="w3-col">
          <Barra_Grosor funcionGrosor={cambiar_grosor} deshabilitado={deshabilitado} />
        </div>
        <div className="w3-col">
          <Barra_Figuras funcionFiguraCuadrado={dibujarCuadrado} funcionFiguraTriangulo={dibujarTriangulo} funcionFiguraCirculo={dibujarCirculo} deshabilitado={deshabilitado} />
        </div>
        <div className="w3-col">
          <Barra_Funciones funcionLimpiar={limpiar_pizarra} funcionFiguraImagen={subir_imagen} funciontamanoImagen={resizeImg} funciondescargaImagen={downloadImg} deshabilitado={deshabilitado} />
        </div>
      </div>
    </div>
    <div className="divUsuarios">
      <div className="contenedorUsuarios">
        <h1>Usuarios</h1>
        <div id="sectorListaUsuarios" className="listaUsuarios"></div>
      </div>
      <div className="botonesLevantarBajar">
        <button id="botonLevantarMano" className="botonLevantar" onClick={levantarMano}>Levantar la Mano</button>
        <button id="botonBajarMano" className="botonBajar" onClick={bajarMano} >Bajar la Mano</button>
      </div>
    </div>
  </>


}

export default App