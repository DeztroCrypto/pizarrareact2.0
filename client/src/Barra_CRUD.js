import Boton_Opcion from "./Boton_Opcion"

const Barra_CRUD = (props) => {
    return(
        <div className="w3-container funciones">
            <label htmlFor="ingresoNombreLienzo">Nombre Lienzo</label>
            <input type="text" id = "ingresoNombreLienzo" disabled={props.deshabilitado}/>
            <Boton_Opcion nombre = "Guardar Lienzo" onClick = {props.funcionGuardarLienzo} deshabilitado={props.deshabilitado}/>
        </div>
    )
}

export default Barra_CRUD