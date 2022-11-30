import { click } from '@testing-library/user-event/dist/click'
import { useEffect, useRef, useState } from 'react'
import './styles.css'
import './w3.css'
var imdata

const DrawingCanvas = (props) => {
  let color = props.color
  let grosor = props.grosor
  let figura = props.figura
  let img = props.img
  let newImg = props.newImg
  let socket = props.socket

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

  socket.on('drawing', onDrawingEvent)

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
      imdata = canvasRef.current.toDataURL()
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
    socketDrawCuadrado(startX.current, startY.current, rectWidth, rectHeight, color, grosor, imdata, true)
  }

  const socketDrawCuadrado = (x0, y0, x1, y1, color, grosor, imgData, emit) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = grosor;
    const imagen = new Image
    imagen.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.current.drawImage(imagen, 0, 0)
      contextRef.current.strokeRect(x0, y0, x1, y1)
    }
    imagen.src = imgData
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
      imdata = canvasRef.current.toDataURL()
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
    socketDrawCicrulo(startX.current, startY.current, radioMax, color, grosor, imdata, true)
  }

  const socketDrawCicrulo = (x0, y0, radio, color, grosor, imgData, emit) => {
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
    imagen.src = imgData
    if (!emit) {
      return
    }
    socket.emit('drawing', {
      x0,
      y0,
      radio,
      color,
      grosor,
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
      imdata = canvasRef.current.toDataURL()
      setDrawingTriangle(true)
    }
  }

  const drawTriangle = ({ nativeEvent }) => {
    if (!isDrawingTriangle) {
      return
    }
    const vertice = startX.current * 2 - nativeEvent.offsetX
    socketDrawTriangulo(startX.current, startY.current, nativeEvent.offsetX, vertice, nativeEvent.offsetY, color, grosor, imdata, true)

  }

  const socketDrawTriangulo = (x0, y0, x1, x2, altura, color, grosor, imgData, emit) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = grosor;
    const imagen = new Image
    imagen.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.current.drawImage(imagen, 0, 0)
      contextRef.current.beginPath();
      contextRef.current.moveTo(x0, y0);
      console.log(x0)
      console.log(y0)
      contextRef.current.lineTo(x1, altura);
      contextRef.current.lineTo(x2, altura);
      contextRef.current.closePath();
      contextRef.current.stroke();
    }
    imagen.src = imgData
    if (!emit) {
      return
    }
    socket.emit('drawing', {
      x0,
      y0,
      x1,
      x2,
      altura,
      color,
      grosor,
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
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.putImageData(newImg, 0, 0)
    const offsetX = nativeEvent.offsetX
    const offsetY = nativeEvent.offsetY
    contextRef.current.drawImage(img, offsetX + startX.current, offsetY + startY.current, newWidth, newHeight)

    nativeEvent.preventDefault();
  }

  const socketDrawImage = () => {

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
    const { offsetX, offsetY } = nativeEvent;
    startX.current += offsetX
    startY.current += offsetY
    setDrawingImg(false)
  }

  function onDrawingEvent(data) {
    console.log(data.figura)
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
    }
  }

  const funcionOnMouseDown = (nativeEvent) => {
    startDrawing(nativeEvent)
    startDrawRectangle(nativeEvent)
    startDrawCircle(nativeEvent)
    startDrawTriangle(nativeEvent)
    startDrawingImg(nativeEvent)
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