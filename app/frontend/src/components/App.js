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
    username: "anonimo", //TODO Obtener el username del token
    showModal: false,
    expiration: undefined
  };

  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentWillMount() {
    axios.get("http://localhost:5000/api/questions").then(response => {
      this.setState({ preguntas: response.data });
      let storage =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (storage === null) {
        this.setState({ username: "anonimo" });
      } else {
        let date = JSON.parse(storage)[2];
        this.setState({ expiration: date });
        let token = JSON.parse(storage)[0];
        let url = "http://localhost:5000/api/getUsernameFromToken";
        let headers = { "Authorization": `Bearer ${token}` }; //prettier-ignore
        axios.get(url, { headers }).then(response => {
          this.setState({ username: response.data.username });
        });
        // this.lanzarPeticion("get", url, false, headers).then(response => {
        //   this.setState({ username: response.data.username });
        // });
      }
    });
  }

  añadirPregunta = datos_pregunta => {
    let url = `http://localhost:5000/api/questions/${this.state.username}`;
    this.lanzarPeticion("post", url, false, undefined, {
      title: datos_pregunta[0],
      body: datos_pregunta[1]
    }).then(response => {
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
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    this.setState({ username: "anonimo" });
    console.log(this.state);
  };

  iniciarSesion = (username, password, remember) => {
    axios
      .post("http://localhost:5000/api/iniciarSesion", {
        username: username,
        password: password,
        remember: remember
      })
      .then(response => {
        console.log(response);
        let code = response.data.code;
        let payload = response.data.payload;
        console.log(payload);
        if (code === 200) {
          // Obtener fecha de expiración del token
          let fecha = new Date();
          let expiration = 15;
          let fecha_expiration = new Date(
            fecha.getTime() + expiration * 60000
          ).valueOf();

          // Guardarlo en el estado y en el navegador
          this.setState({
            username: payload.username,
            expiration: fecha_expiration
          });

          let dataToSave = [
            response.data.access_token,
            response.data.refresh_token,
            fecha_expiration
          ];
          response.data.remember
            ? localStorage.setItem(
                "token",
                JSON.stringify([...dataToSave, true])
              )
            : sessionStorage.setItem(
                "token",
                JSON.stringify([...dataToSave, false])
              );

          // Lanzar el toast y cerrar el diálogo
          this.lanzarToast(
            "success",
            `¡Sesión iniciada satisfactoriamente :)!`
          );
          this.toggleModal();
          console.log(this.state);
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

  lanzarPeticion = (metodo, url, auth, headers, params) => {
    console.log(this.state);
    console.log(url);
    if (this.state.username !== "anonimo") {
      let fecha_exp = new Date(this.state.expiration).toISOString();
      if (fecha_exp < new Date().toISOString()) {
        console.log("Caducado");
        let storage =
          sessionStorage.getItem("token") || localStorage.getItem("token");
        storage = JSON.parse(storage);
        let token_refresh = storage[1];
        let inLocalStorage = storage[3];
        let headers = { "Authorization": `Bearer ${token_refresh}` }; //prettier-ignore
        axios
          .get("http://localhost:5000/api/tokenRefresh", { headers })
          .then(response => {
            storage[0] = response.data.access_token;
            // Obtener fecha de expiración del token
            let fecha = new Date();
            let expiration = 15;
            let fecha_expiration = new Date(
              fecha.getTime() + expiration * 60000
            ).valueOf();
            storage[2] = fecha_expiration;
            inLocalStorage
              ? localStorage.setItem("token", JSON.stringify(storage))
              : sessionStorage.setItem("token", JSON.stringify(storage));
          });
      }
    }
    switch (metodo.toUpperCase()) {
      case "GET":
        if (headers === undefined) {
          headers = {};
        }
        return axios.get(url, { headers });
      case "POST":
        if (headers === undefined) {
          headers = {};
        }

        if (params === undefined) {
          params = {};
        }

        return axios.post(url, params, { headers: headers });
      default:
        console.log(`Método ${metodo} no soportado`);
    }
  };

  render() {
    return (
      <>
        <Menu
          username={this.state.username}
          cerrarSesion={this.cerrarSesion}
          iniciarSesion={this.iniciarSesion}
          toggleModal={this.toggleModal}
          showModal={this.state.showModal}
        />
        <div className="container-fluid">
          <div className="row mt-5 ml-5">
            <div className="col-sm">
              {/* eslint-disable-next-line */}
              <AñadirPregunta añadirPregunta={this.añadirPregunta} />
            </div>

            <div className="col-sm mr-5">
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
      </>
    );
  }
}

export default App;
