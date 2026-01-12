//! Importo le dipendenze necessarie da React Router e il componente NavBar
import { Outlet, useLocation } from "react-router-dom";   
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

//todo Creazione del Layout con Header, Main e Footer
const Layout = () => {
  const location = useLocation();

  return (
    <>
      <header><NavBar /></header>
      <main>
        <div key={location.pathname} className="pageTransition">
          <Outlet />
        </div>
      </main>
      <footer><Footer /></footer>
    </>
  );
};

export default Layout;
