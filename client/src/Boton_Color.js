import {cambiar_color} from "./DrawingCanvas"

const Boton_Color = (props) =>{
    return (
        <button className={props.className} onClick={props.onClick} value={props.value} disabled={props.deshabilitado}></button>
    )
}

export default Boton_Color