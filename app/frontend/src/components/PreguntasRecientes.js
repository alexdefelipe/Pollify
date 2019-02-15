import React, { Component } from "react";
import Pregunta from "./Pregunta";

class PreguntasRecientes extends Component {
  render() {
    return (
      <div className="preguntas_recientes">
        {Object.keys(this.props.preguntas).map(key => (
          <Pregunta key={key} detalle={this.props.preguntas[key]}>
            key
          </Pregunta>
        ))}
      </div>
    );
  }
}

export default PreguntasRecientes;
