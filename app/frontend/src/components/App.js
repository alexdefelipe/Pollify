import React, { Component } from "react";
import PreguntasRecientes from "./PreguntasRecientes";
import AñadirPregunta from "./AñadirPregunta";
import axios from "axios";
import Menu from "./Menu.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    preguntas: {},
    username: "anonimo",
    showModal: false
  };

  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    axios.get("http://localhost:5000/api/questions").then(response => {
      this.setState({ preguntas: response.data });
    });
  }

  añadirPregunta = datos_pregunta => {
    axios
      .post("http://localhost:5000/api/questions/" + this.state.username, {
        title: datos_pregunta[0],
        body: datos_pregunta[1]
      })
      .then(response => {
        console.log(response);
        let code = response.data.code;
        let payload = response.data.payload;
        if (code === 200) {
          const preguntas = { ...this.state.preguntas };
          preguntas[`${Object.keys(preguntas).length}`] = payload;
          this.setState({ preguntas: preguntas });
          this.lanzarToast("success", `Pregunta añadida satisfactoriamente :)`);
        } else {
          this.lanzarToast(
            "error",
            `No se ha podido añadir la pregunta. Se ha producido un error ${code}  :(`
          );
        }
      });
  };

  cerrarSesion = () => {
    this.setState({ username: "anonimo" });
    console.log(this.state);
  };

  iniciarSesion = (username, password) => {
    console.log(`iniciar sesion ${username} ${password}`);
    axios
      .post("http://localhost:5000/api/iniciarSesion", {
        username: username,
        password: password
      })
      .then(response => {
        console.log(response);
        let code = response.data.code;
        let payload = response.data.payload;

        if (code === 200) {
          this.setState({ username: payload.username });
          this.lanzarToast(
            "success",
            `¡Sesión iniciada satisfactoriamente :)!`
          );
          this.toggleModal();
        } else {
          this.lanzarToast(
            "error",
            `Error al iniciar la sesión :( El usuario y la contraseña no coinciden`
          );
        }
      });
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  lanzarToast = (tipo, mensaje) => {
    if (tipo === "success") {
      toast.success(mensaje, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else if (tipo === "error") {
      toast.error(mensaje, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  render() {
    return (
      <div className="container pt-5">
        <Menu
          username={this.state.username}
          cerrarSesion={this.cerrarSesion}
          iniciarSesion={this.iniciarSesion}
          toggleModal={this.toggleModal}
          showModal={this.state.showModal}
        />
        <div className="row mt-5">
          <div className="col-sm">
            {/* eslint-disable-next-line */}
            <AñadirPregunta añadirPregunta={this.añadirPregunta} />
          </div>

          <div className="col-sm">
            <PreguntasRecientes preguntas={this.state.preguntas} />
          </div>
        </div>

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

export default App;
