import './styles.css'
import { cambiar_color } from "./DrawingCanvas"

const Boton_Herramienta = (props) => {
    return (
        <button class="w3-button boton_imagen" onClick={props.onClick} disabled={props.deshabilitado}>
            <img class="imagen" src={props.src} alt={props.alt}  />
        </button>
    )
}

export default Boton_Herramienta