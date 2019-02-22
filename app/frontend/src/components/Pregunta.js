import React, { Component } from "react";

class Pregunta extends Component {
  render() {
    // eslint-disable-next-line
    const { id, title, body, author, timestamp } = this.props.detalle;
    return (
      <div className="card">
        <div className="card-head bg-primary text-white">
          <h5 className="card-title">{title}</h5>{" "}
          <h6 className="card-subtitle mb-2 text-muted">
            Preguntado el{" "}
            {new Date(timestamp).toLocaleString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit"
            })}
          </h6>
        </div>
        <div className="card-body">{body}</div>
        <div className="card-footer text-muted">
          Autor:{" "}
          <a href={`http://localhost:5000/api/questions/${author}`}>{author}</a>
        </div>
      </div>
    );
  }
}

export default Pregunta;
