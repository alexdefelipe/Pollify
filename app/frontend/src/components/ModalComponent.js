//ModalComponent.js
import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class ModalComponent extends React.Component {
  usernameRef = React.createRef();
  passRef = React.createRef();

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleIniciarSesion = this.handleIniciarSesion.bind(this);
    this.handleRegistro = this.handleRegistro.bind(this);
  }

  handleIniciarSesion(event) {
    event.preventDefault();
    let username = this.usernameRef.current.value;
    let password = this.passRef.current.value;
    this.props.iniciarSesion(username, password);
  }

  handleCancel(event) {
    event.preventDefault();
    this.props.toggleModal();
  }

  handleRegistro() {
    let username = this.usernameRef.current.value;
    let password = this.passRef.current.value;

    axios
      .post("http://localhost:5000/api/register", {
        username: username,
        password: password
      })
      .then(response => {
        let code = response.data.code;

        if (code === 200) {
          toast.success(`¡Registro completado! Iniciando sesión :)`, {
            position: "bottom-center",
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          this.props.iniciarSesion(username, password);
        } else {
          toast.error(
            `No se ha podido completar el registro. Ya existe un usuario con este nombre :(`,
            {
              position: "bottom-center",
              autoClose: 3500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            }
          );
        }
      });
  }

  render() {
    const closeBtn = (
      <button className="close" onClick={this.handleCancel}>
        &times;
      </button>
    );
    return (
      <div>
        <Modal isOpen={this.props.showModal}>
          <form className="mt-3">
            <ModalHeader toggle={this.handleCancel} close={closeBtn}>
              Iniciar sesión o registrarse
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  ref={this.usernameRef}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pass">Contraseña</label>
                <input
                  name="pass"
                  type="password"
                  className="form-control"
                  ref={this.passRef}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleIniciarSesion}>
                Iniciar sesión
              </Button>
              <Button color="primary" onClick={this.handleRegistro}>
                Registrarse
              </Button>
            </ModalFooter>
          </form>
        </Modal>
        <div>
          <ToastContainer
            position="bottom-center"
            autoClose={3500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        </div>
      </div>
    );
  }
}
