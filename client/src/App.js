import React from "react";
import logo from "./logo.svg";
//import "./css/boostrap.css";
//import "./css/fontawesome.css";
import "./App.css";
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import { UserContextProvider } from "./context/user-context";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Header />
        <div className="container margin-top">
          <Routes />
        </div>
        <Footer />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
