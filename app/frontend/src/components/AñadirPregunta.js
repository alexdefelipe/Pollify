import React, { Component } from "react";

class AñadirPregunta extends Component {
  tituloRef = React.createRef();
  bodyRef = React.createRef();

  crearPregunta = event => {
    event.preventDefault();
    var datos_pregunta = [
      this.tituloRef.current.value,
      this.bodyRef.current.value
    ];

    this.props.añadirPregunta(datos_pregunta);

    this.mostrarConfirmacion = true;
    this.tituloRef.current.value = "";
    this.bodyRef.current.value = "";
  };
  render() {
    return (
      <div>
        <h2> ¡Haz una pregunta! </h2>
        <form className="mt-3">
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              name="pregunta"
              type="text"
              className="form-control"
              placeholder="Título de la pregunta"
              ref={this.tituloRef}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cuerpo">Pregunta</label>
            <textarea
              name="pregunta"
              type="text"
              className="form-control"
              placeholder="Desarrolla tu pregunta"
              ref={this.bodyRef}
            />
          </div>

          <button onClick={this.crearPregunta} className="btn btn-primary mr-5">
            Añadir pregunta
          </button>
        </form>
      </div>
    );
  }
}

export default AñadirPregunta;
