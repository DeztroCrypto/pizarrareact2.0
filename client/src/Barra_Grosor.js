import {cambiar_grosor} from "./DrawingCanvas"
import './styles.css'

const Barra_Grosor = (props) => {
    return(
        <div className="w3-container grosor">
            <div className="gros">
                 <input type="range"  id = "vol"  name="vol" min="1" max="10" defaultValue={1} class="selector_color"
                     onChange={props.funcionGrosor} >          
                  </input>
            </div>
              
        </div>
    )
}

export default Barra_Grosor