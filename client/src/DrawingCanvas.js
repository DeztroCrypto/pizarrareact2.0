import { click } from '@testing-library/user-event/dist/click'
import { useEffect, useRef, useState } from 'react'
import './styles.css'
import './w3.css'
var imDataBG
var imgData
const DrawingCanvas = (props) => {
  let color = props.color
  let grosor = props.grosor
  let figura = props.figura
  let img = props.img
  let newImg = props.newImg
  let socket = props.socket
  let deshabilitado = props.deshabilitado

  let newWidth = props.newWidth
  let newHeight = props.newHeight

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const startX = useRef(0)
  const startY = useRef(0)

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingRect, setDrawingRect] = useState(false);
  const [isDrawingCircle, setDrawingCircle] = useState(false);
  const [isDrawingTriangle, setDrawingTriangle] = useState(false);
  const [isDrawingImg, setDrawingImg] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    let imInit = contextRef.current.getImageData(0, 0, canvas.width, canvas.height)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    contextRef.current.putImageData(imInit, 0, 0)
  }, [window.innerHeight, window.innerWidth])

  ///
  socket.on('drawing', onDrawingEvent)
  socket.on('cargarCanvas', cargarCanvas)
  ///
  
  function cargarCanvas(data) {
    const imagen = new Image
    imagen.onload = () => {
      contextRef.current.drawImage(imagen, 0, 0)
    }
    imagen.src = data.imgData
  }

  const startDrawing = ({ nativeEvent }) => {
    if (figura === "linea") {
      const { offsetX, offsetY } = nativeEvent;
      startX.current = offsetX;
      startY.current = offsetY
      setIsDrawing(true);
      nativeEvent.preventDefault();
    }
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    socketDrawLine(startX.current, startY.current, offsetX, offsetY, color, grosor, true)
    startX.current = offsetX
    startY.current = offsetY
    nativeEvent.preventDefault();
  };

  const socketDrawLine = (x0, y0, x1, y1, color, grosor, emit) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = grosor;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0)
    contextRef.current.lineTo(x1, y1)
    contextRef.current.stroke()
    contextRef.current.closePath()
    const imgData = canvasRef.current.toDataURL()
    if (!emit) {
      return
    }
    socket.emit('drawing', {
      x0,
      y0,
      x1,
      y1,
      color,
      grosor,
      imgData,
      figura
    })
  }

  const stopDrawing = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const startDrawRectangle = ({ nativeEvent }) => {
    if (figura === "cuadrado") {
      startX.current = nativeEvent.offsetX
      startY.current = nativeEvent.offsetY
      imDataBG = canvasRef.current.toDataURL()
      setDrawingRect(true)
    }
  }

  const drawRectangle = ({ nativeEvent }) => {
    if (!isDrawingRect) {
      return
    }
    const newPosX = nativeEvent.offsetX
    const newPosY = nativeEvent.offsetY
    const rectWidth = newPosX - startX.current
    const rectHeight = newPosY - startY.current
    socketDrawCuadrado(startX.current, startY.current, rectWidth, rectHeight, color, grosor, imDataBG, true)
  }

  const socketDrawCuadrado = (x0, y0, x1, y1, color, grosor, imDataBG, emit) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = grosor;
    const imagen = new Image
    imagen.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.current.drawImage(imagen, 0, 0)
      contextRef.current.strokeRect(x0, y0, x1, y1)
    }
    imagen.src = imDataBG
    if (!emit) {
      return
    }
    imgData = canvasRef.current.toDataURL()
    socket.emit('drawing', {
      x0,
      y0,
      x1,
      y1,
      color,
      grosor,
      imDataBG,
      imgData,
      figura
    })
  }

  const stopDrawRect = ({ nativeEvent }) => {
    if (!isDrawingRect) {
      return
    }
    setDrawingRect(false)
  }

  const startDrawCircle = ({ nativeEvent }) => {
    if (figura === "circulo") {
      startX.current = nativeEvent.offsetX
      startY.current = nativeEvent.offsetY
      imDataBG = canvasRef.current.toDataURL()
      setDrawingCircle(true)
    }
  }

  const drawCircle = ({ nativeEvent }) => {
    if (!isDrawingCircle) {
      return
    }
    const newPosX = nativeEvent.offsetX
    const newPosY = nativeEvent.offsetY
    const radioX = Math.abs(newPosX - startX.current)
    const radioY = Math.abs(newPosY - startY.current)
    const radioMax = Math.max(radioX, radioY)
    socketDrawCicrulo(startX.current, startY.current, radioMax, color, grosor, imDataBG, true)
  }

  const socketDrawCicrulo = (x0, y0, radio, color, grosor, imDataBG, emit) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = grosor;
    const imagen = new Image
    imagen.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.current.drawImage(imagen, 0, 0)
      contextRef.current.beginPath()
      contextRef.current.arc(x0, y0, radio, 0, 2 * Math.PI)
      contextRef.current.stroke()

    }
    imagen.src = imDataBG
    if (!emit) {
      return
    }
    imgData = canvasRef.current.toDataURL()
    socket.emit('drawing', {
      x0,
      y0,
      radio,
      color,
      grosor,
      imDataBG,
      imgData,
      figura
    })
  }

  const stopDrawCircle = ({ nativeEvent }) => {
    if (!isDrawingCircle) {
      return
    }
    setDrawingCircle(false)
  }

  const startDrawTriangle = ({ nativeEvent }) => {
    if (figura === "triangulo") {
      startX.current = nativeEvent.offsetX
      startY.current = nativeEvent.offsetY
      imDataBG = canvasRef.current.toDataURL()
      setDrawingTriangle(true)
    }
  }

  const drawTriangle = ({ nativeEvent }) => {
    if (!isDrawingTriangle) {
      return
    }
    const vertice = startX.current * 2 - nativeEvent.offsetX
    socketDrawTriangulo(startX.current, startY.current, nativeEvent.offsetX, vertice, nativeEvent.offsetY, color, grosor, imDataBG, true)

  }

  const socketDrawTriangulo = (x0, y0, x1, x2, altura, color, grosor, imDataBG, emit) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = grosor;
    const imagen = new Image
    imagen.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.current.drawImage(imagen, 0, 0)
      contextRef.current.beginPath();
      contextRef.current.moveTo(x0, y0);
      contextRef.current.lineTo(x1, altura);
      contextRef.current.lineTo(x2, altura);
      contextRef.current.closePath();
      contextRef.current.stroke();
    }
    imagen.src = imDataBG
    if (!emit) {
      return
    }
    imgData = canvasRef.current.toDataURL()
    socket.emit('drawing', {
      x0,
      y0,
      x1,
      x2,
      altura,
      color,
      grosor,
      imDataBG,
      imgData,
      figura
    })
  }

  const stopDrawTriangle = ({ nativeEvent }) => {
    if (!isDrawingTriangle) {
      return
    }
    setDrawingTriangle(false)
  }

  const drawImg = ({ nativeEvent }) => {
    if (!isDrawingImg) {
      return
    }
    const offsetX = nativeEvent.offsetX
    const offsetY = nativeEvent.offsetY
    const x0 = offsetX + startX.current
    const y0 = offsetY + startY.current
    socketDrawImage(img, x0, y0, newWidth, newHeight, newImg, true)
    nativeEvent.preventDefault();
  }

  const socketDrawImage = (img, x0, y0, newWidth, newHeight, srcNewImg, emit) => {
    const BGimage = new Image
    const image = new Image
    BGimage.src = srcNewImg
    BGimage.onload = () => {
      image.src = img
      image.onload = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        contextRef.current.drawImage(BGimage, 0, 0, canvasRef.current.width, canvasRef.current.height)
        contextRef.current.drawImage(image, x0, y0, newWidth, newHeight)
      }
    }

    if (!emit) {
      return
    }
    imgData = canvasRef.current.toDataURL()
    socket.emit('drawing', {
      img,
      x0,
      y0,
      newWidth,
      newHeight,
      srcNewImg,
      imgData,
      figura
    })
  }

  const startDrawingImg = ({ nativeEvent }) => {

    if (figura === "img") {
      startX.current -= nativeEvent.offsetX
      startY.current -= nativeEvent.offsetY
      setDrawingImg(true)
    }
  }
  const stopDrawImg = ({ nativeEvent }) => {
    if (!isDrawingImg) {
      return
    }
    startX.current += nativeEvent.offsetX
    startY.current += nativeEvent.offsetY
    setDrawingImg(false)
  }

  function onDrawingEvent(data) {
    switch (data.figura) {
      case 'linea':
        socketDrawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.grosor);
        break;
      case 'cuadrado':
        socketDrawCuadrado(data.x0, data.y0, data.x1, data.y1, data.color, data.grosor, data.imgData)
        break;
      case 'circulo':
        socketDrawCicrulo(data.x0, data.y0, data.radio, data.color, data.grosor, data.imgData)
        break;
      case 'triangulo':
        socketDrawTriangulo(data.x0, data.y0, data.x1, data.x2, data.altura, data.color, data.grosor, data.imgData)
        break;
      case 'img':
        socketDrawImage(data.img, data.x0, data.y0, data.newWidth, data.newHeight, data.srcNewImg)
        break;
    }
  }

  const funcionOnMouseDown = (nativeEvent) => {
    if(!deshabilitado){
      startDrawing(nativeEvent)
      startDrawRectangle(nativeEvent)
      startDrawCircle(nativeEvent)
      startDrawTriangle(nativeEvent)
      startDrawingImg(nativeEvent)
    }
  }

  const functionOnMouseMove = (nativeEvent) => {
    draw(nativeEvent)
    drawRectangle(nativeEvent)
    drawCircle(nativeEvent)
    drawTriangle(nativeEvent)
    drawImg(nativeEvent)
  }

  const functionOnMouseUp = (nativeEvent) => {
    stopDrawing(nativeEvent)
    stopDrawRect(nativeEvent)
    stopDrawCircle(nativeEvent)
    stopDrawTriangle(nativeEvent)
    stopDrawImg(nativeEvent)
  }

  const functionOnMouseOut = (nativeEvent) => {
    stopDrawing(nativeEvent)
    stopDrawRect(nativeEvent)
    stopDrawCircle(nativeEvent)
    stopDrawTriangle(nativeEvent)
  }

  return (
    <canvas className="canvas-container" id='pizarra'
      ref={canvasRef}
      onMouseDown={funcionOnMouseDown}
      onMouseMove={functionOnMouseMove}
      onMouseUp={functionOnMouseUp}
      onMouseOut={functionOnMouseOut}
    >
    </canvas>
  )
}

export default DrawingCanvas