
const Boton_Opcion = (props) => {
    return(
        <button class="w3-button w3-margin-left w3-border w3-round-large w3-indigo func"
        onClick={props.onClick} disabled = {props.deshabilitado}>{props.nombre}{props.input}</button>
    )
}

export default Boton_Opcion