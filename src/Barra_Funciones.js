import Boton_Opcion from "./Boton_Opcion"

const Barra_Funciones = (props) => {
    return(
        <div className="w3-container funciones" >
            <div className="fun" >
                <div className="w3-col tamImg" id="resize" style={{display : 'none'}}>
                     <div className="w3-col widthImg">
                        <label>W:</label>
                        <input type="text" id="w"/>
                    </div>
                     <div className="w3-col heightImg">
                        <label>H:</label>
                        <input type="text" id="h"/>
                     </div>
                     <div className="w3-col btnResize">
                        <button id="btnR" onClick={props.funciontamanoImagen}>resize</button>
                     </div>
                </div>
                
                
                <Boton_Opcion nombre = "Borrar" onClick = {props.funcionLimpiar}/>
                <Boton_Opcion nombre = "Subir" input = {<input class="sub" type='file' id="inp"  multiple  onChange={props.funcionFiguraImagen} />} />

            </div>
        
        </div>
    )
}

export default Barra_Funciones