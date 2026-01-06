//! Importo le dipendenze necessarie da React Router e il componente NavBar
import { Outlet } from "react-router-dom";   
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

//todo Creazione del Layout con Header, Main e Footer
const Layout = () => (
  <>
    <header><NavBar /></header>
    <main><Outlet /></main>
    <footer><Footer /></footer>
  </>
);

export default Layout;
