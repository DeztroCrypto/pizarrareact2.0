
const Boton_Opcion = (props) => {
    return(
        <button class="w3-button w3-margin-left w3-border w3-round-large w3-indigo func"
        onClick={props.onClick}>{props.nombre}{props.input}</button>
    )
}

export default Boton_Opcion