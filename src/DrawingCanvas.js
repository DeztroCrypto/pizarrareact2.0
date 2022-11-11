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

    const context = canvas.getContext("2d");
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
  },[window.innerHeight,window.innerWidth])

  const startDrawing = ({ nativeEvent }) => {
    if (figura === "linea") {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = grosor;
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      setIsDrawing(true);
      nativeEvent.preventDefault();
    }
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

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
      imdata = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
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

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    contextRef.current.putImageData(imdata, 0, 0)
    contextRef.current.strokeRect(startX.current, startY.current, rectWidth, rectHeight)

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

      imdata = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
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
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    contextRef.current.putImageData(imdata, 0, 0)

    contextRef.current.beginPath()
    contextRef.current.arc(startX.current, startY.current, radioMax, 0, 2 * Math.PI)
    contextRef.current.stroke()

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
      imdata = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
      setDrawingTriangle(true)
    }
  }

  const drawTriangle = ({ nativeEvent }) => {
    if (!isDrawingTriangle) {
      return
    }
    contextRef.current.clearRect(0, 0,canvasRef.current.width, canvasRef.current.height);
    contextRef.current.putImageData(imdata, 0, 0)

    contextRef.current.beginPath();
    contextRef.current.moveTo(startX.current, startY.current);
    contextRef.current.lineTo(nativeEvent.offsetX, nativeEvent.offsetY);
    contextRef.current.lineTo(startX.current * 2 - nativeEvent.offsetX, nativeEvent.offsetY);
    contextRef.current.closePath();
    contextRef.current.stroke();
  }

  const stopDrawTriangle = ({nativeEvent}) => {
    if (!isDrawingTriangle) {
      return
    }
    setDrawingTriangle(false)
  }
  const drawImg = ({nativeEvent}) => {
    if (!isDrawingImg) {
      return
    }
    contextRef.current.clearRect(0, 0,canvasRef.current.width, canvasRef.current.height);
    contextRef.current.putImageData(newImg, 0, 0)
    const offsetX = nativeEvent.offsetX
    const offsetY = nativeEvent.offsetY
    contextRef.current.drawImage(img,offsetX+startX.current, offsetY+ startY.current,newWidth,newHeight)
    
    nativeEvent.preventDefault();

  }
  const startDrawingImg = ({nativeEvent}) => {

    if (figura === "img") {
      startX.current -= nativeEvent.offsetX
      startY.current -= nativeEvent.offsetY
      setDrawingImg(true)
    }    
  }
  const stopDrawImg = ({nativeEvent}) => {
    if (!isDrawingImg) {
      return
    }    
    const { offsetX, offsetY } = nativeEvent;
    startX.current += offsetX
    startY.current += offsetY
    setDrawingImg(false)
  }


  const funcionOnMouseDown = (nativeEvent) => {
    contextRef.current.strokeStyle = color
    contextRef.current.lineWidth = grosor
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