import Boton_Color from "./Boton_Color"
import "./w3.css"
import {cambiar_color} from "./DrawingCanvas"

const Barra_Colores = (props) => {
    return(
        <div className="w3-container colores">
        <div className="w3-col sec1">
            <Boton_Color className = "w3-button boton_color w3-red" value ="red" onClick = {props.funcionColor}/>
            <Boton_Color className = "w3-button boton_color w3-blue" value ="blue" onClick = {props.funcionColor}/>
        </div>
        <div className="sec2">
            <Boton_Color className = "w3-button boton_color w3-orange" value ="orange" onClick = {props.funcionColor}/>
            <Boton_Color className = "w3-button boton_color w3-yellow" value ="yellow" onClick = {props.funcionColor}/>
        </div>
        
        <div className="sec3">
            <input type="color" class="selector_color" onChange={props.funcionColor} ></input>
        </div>
        
       
        </div>
    )
}

export default Barra_Colores