import './styles.css'
const Boton_Figura = (props) =>{
    return(
    <button className="boton_imagen" onClick={props.onClick}>
        <img className="imagen" src={props.src} alt={props.alt} />
    </button>
    )
}

export default Boton_Figura