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


function App() {
    const [figura,setFigura] = useState("linea")
    const [colorAct,setColor] = useState("black")
    const [grosorAct,setGrosor] = useState(3)
    const [img,setImg] = useState(null)
    const [newImg,setnewImg] = useState(null)
    const [newWidth,setWidth] = useState(200)
    const [newHeight,setHeight] = useState(200)

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
        img.onload=() =>{
            
            actuImg = context.getImageData(0,0,canvas.width,canvas.height)
            setnewImg(actuImg)
            context.drawImage(img,0,0,newWidth,newHeight)
            document.getElementById("resize").style.display = "block";
            
        }
        console.log(img)
        
        
        setFigura('img')
        
        setImg(img)
        document.querySelector('#inp').addEventListener('onchange', function  (e){
            e.currentTarget.files = null;
        })
      }

      const resizeImg = () =>{
        
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
        img.onload=() =>{       
            context.putImageData(newImg, 0, 0)  
            context.drawImage(img,0,0,widthImg,heightImg)
        }
        console.log(img)
        
        
        setFigura('img')

        setImg(img)
      }
    
    return <div className="w3-container principal">
        <div className="w3-containe guardado">
            
            </div>
        <div className ="w3-col pizarra">
            <DrawingCanvas 
                color = {colorAct}
                grosor = {grosorAct}
                figura = {figura}
                img = {img}
                newImg = {newImg}
                newWidth = {newWidth}
                newHeight = {newHeight}
            ></DrawingCanvas>
        </div>
        <div className="w3-col tools">
            <div className="w3-col">
            <Barra_Herramientas funcionPincel = {cambiar_lapiz} funcionBorrador = {cambiar_borrador}/>
            </div>
            <div className="w3-col">
                <Barra_Colores funcionColor = {cambiar_color}/>
            </div>
            <div className="w3-col">
                <Barra_Grosor funcionGrosor = {cambiar_grosor}/>
            </div>
            <div className="w3-col">
                <Barra_Figuras funcionFiguraCuadrado = {dibujarCuadrado} funcionFiguraTriangulo = {dibujarTriangulo}/>
            </div>
            <div className="w3-col">
                <Barra_Funciones funcionLimpiar = {limpiar_pizarra} funcionFiguraImagen = {subir_imagen} funciontamanoImagen = {resizeImg}/>
            </div>          
        </div>
        
    </div>  

        

}

export default App