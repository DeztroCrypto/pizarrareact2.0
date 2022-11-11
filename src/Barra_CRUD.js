import Boton_Opcion from "./Boton_Opcion"

const Barra_CRUD = (props) => {
    return(
        <div className="w3-container funciones">
            <label htmlFor="ingresoNombreLienzo">Nombre Lienzo</label>
            <input type="text" id = "ingresoNombreLienzo"/>
            <Boton_Opcion nombre = "Guardar Lienzo" onClick = {props.funcionGuardarLienzo}/>
        </div>
    )
}

export default Barra_CRUD