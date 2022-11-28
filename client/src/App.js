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

function App() {
  useEffect(() => {
    crearBaseDeDatos()
    leerLienzos()
  }, [])

  const [figura, setFigura] = useState("linea")
  const [colorAct, setColor] = useState("black")
  const [grosorAct, setGrosor] = useState(3)
  const [img, setImg] = useState(null)
  const [newImg, setnewImg] = useState(null)
  const [newWidth, setWidth] = useState(200)
  const [newHeight, setHeight] = useState(200)

  let idImg


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
          botonActualizar.className = "botonCRUD"
          botonActualizar.onclick = cargarLienzo
          botonActualizar.id = "actualizarLienzo"
          botonActualizar.dataset.nombre = cursor.value.nombre
          divBotones.appendChild(botonActualizar)
          const botonEliminar = document.createElement("button")
          botonEliminar.textContent = "Eliminar"
          botonEliminar.className = "botonCRUD"
          botonEliminar.onclick = eliminarLienzo
          botonEliminar.dataset.nombre = cursor.value.nombre
          divBotones.appendChild(botonEliminar)
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
        const canvas = document.getElementById('pizarra')
        const context = canvas.getContext("2d")
        const imagen = new Image
        imagen.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(imagen, 0, 0)
        }
        imagen.src = request.result.image
        document.getElementById("ingresoNombreLienzo").value = request.result.nombre
        cambiar_lapiz()
      }
    }
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


  const limpiar_pizarra = () => {
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("resize").style.display = "none";
  }
  const subir_imagen = () => {
    let img = document.createElement('img')
    const file = document.querySelector('#inp').files[0]

    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext('2d')
    let actuImg
    img.src = URL.createObjectURL(file)
    img.id = 'imgSub'
    setWidth(200)
    setHeight(200)
    img.onload = () => {

      actuImg = context.getImageData(0, 0, canvas.width, canvas.height)
      setnewImg(actuImg)
      context.drawImage(img, 0, 0, newWidth, newHeight)
      document.getElementById("resize").style.display = "block";

    }
    console.log(img)


    setFigura('img')

    setImg(img)
    document.querySelector('#inp').addEventListener('onchange', function (e) {
      e.currentTarget.files = null;
    })
  }
  const downloadImg = () =>{
    let enlace = document.createElement('a')
    enlace.download = "lienzo.png"
    const canvas = document.getElementById('pizarra')
    
    enlace.href = canvas.toDataURL();

    enlace.click();
  }
  const resizeImg = () => {

    let img = document.createElement('img')
    const file = document.querySelector('input[type=file]').files[0]
    const canvas = document.getElementById('pizarra')
    const context = canvas.getContext('2d')
    let actuImg
    img.src = URL.createObjectURL(file)
    img.id = 'imgSub'

    const widthImg = document.getElementById('w').value
    const heightImg = document.getElementById('h').value
    setWidth(widthImg)
    setHeight(heightImg)
    img.onload = () => {
      context.putImageData(newImg, 0, 0)
      context.drawImage(img, 0, 0, widthImg, heightImg)
    }
    console.log(img)


    setFigura('img')

    setImg(img)
  }

  return <div className="principal">
    <div className="w3-col guardado">
      <div>
        <Barra_CRUD funcionGuardarLienzo={guardarLienzo} funcionCargarLienzo={cargarLienzo} />
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
      ></DrawingCanvas>
    </div>
    <div className="w3-col tools">
      <div className="w3-col">
        <Barra_Herramientas funcionPincel={cambiar_lapiz} funcionBorrador={cambiar_borrador} />
      </div>
      <div className="w3-col">
        <Barra_Colores funcionColor={cambiar_color} />
      </div>
      <div className="w3-col">
        <Barra_Grosor funcionGrosor={cambiar_grosor} />
      </div>
      <div className="w3-col">
        <Barra_Figuras funcionFiguraCuadrado={dibujarCuadrado} funcionFiguraTriangulo={dibujarTriangulo} funcionFiguraCirculo={dibujarCirculo}/>
      </div>
      <div className="w3-col">
        <Barra_Funciones funcionLimpiar={limpiar_pizarra} funcionFiguraImagen={subir_imagen} funciontamanoImagen={resizeImg} funciondescargaImagen = {downloadImg}/>
      </div>
    </div>

  </div>



}

export default App