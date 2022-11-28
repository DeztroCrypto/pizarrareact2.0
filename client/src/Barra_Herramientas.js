import Boton_Herramienta from "./Boton_Herramienta"
import imagenes from "./imagenes"

const Barra_Herramientas = (props) => {

    return (
        <div className="w3-container herramientas">
            <div className="w3-col herra">
                <Boton_Herramienta src = {imagenes[0].src} alt = {imagenes[0].titulo} onClick = {props.funcionPincel}/>
                <Boton_Herramienta src = {imagenes[1].src} alt = {imagenes[1].titulo} onClick = {props.funcionBorrador}/>
            </div>
        
        </div>
    )
}

export default Barra_Herramientas