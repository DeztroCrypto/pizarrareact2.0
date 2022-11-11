import Boton_Figura from "./Boton_Figura"
import imagenes from "./imagenes"
const Barra_Figuras = (props) => {
    return (
        <div className="w3-container figuras">
            <div className="w3-col fig">
                <Boton_Figura src={imagenes[3].src} alt={imagenes[3].alt} onClick = {props.funcionFiguraCuadrado}/>
                <Boton_Figura src={imagenes[4].src} alt={imagenes[4].alt} onClick = {props.funcionFiguraTriangulo}/>
                <Boton_Figura src={imagenes[5].src} alt={imagenes[5].alt} onClick = {props.funcionFiguraCirculo}/>
            </div>        
        </div>
    )
}

export default Barra_Figuras