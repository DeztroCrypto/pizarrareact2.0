import './styles.css'
const Boton_Figura = (props) =>{
    return(
    <button className="w3-button boton_imagen" onClick={props.onClick} disabled = {props.deshabilitado}>
        <img className="imagen" src={props.src} alt={props.alt} />
    </button>
    )
}

export default Boton_Figura