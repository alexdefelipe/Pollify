import React, { Component } from "react";
import ModalComponent from "./ModalComponent";

class Menu extends Component {
  render() {
    return (
      <>
        <div className="App">
          <ModalComponent
            toggleModal={this.props.toggleModal}
            showModal={this.props.showModal}
            iniciarSesion={this.props.iniciarSesion}
          />
        </div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="/">
            Pollify
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/">
                  Inicio <span className="sr-only">(current)</span>
                </a>
              </li>
            </ul>
            <div className="form-inline my-2 my-lg-0">
              {this.props.username === "anonimo" ? (
                <button
                  className="btn btn-sm btn-primary"
                  type="button"
                  // onClick={this.props.iniciarSesion}
                  onClick={this.props.toggleModal}
                >
                  Iniciar sesión
                </button>
              ) : (
                <>
                  <span className="navbar-text mr-4">
                    ¡Bienvenido, {this.props.username}!
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    type="button"
                    onClick={this.props.cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Menu;
