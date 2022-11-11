import Boton_Opcion from "./Boton_Opcion"
import {subir_imagen} from "./DrawingCanvas"

const Barra_Funciones = (props) => {
    return(
        <div className="w3-container funciones">
            <div className="fun">
                <Boton_Opcion nombre = "Borrar" onClick = {props.funcionLimpiar}/>
                <Boton_Opcion nombre = "Subir" input = {<input class="sub" type='file' id="inp"  multiple  onChange={subir_imagen}/>}/>
            </div>
        
        </div>
    )
}

export default Barra_Funciones