import { useEffect, useState } from "react";
import { getFavorites, clearFavorites } from "../utils/favorites";
import Cards from "../Components/Cards";

const Preferiti = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(getFavorites());
  }, []);

  function handleClear() {
    if (!confirm("Vuoi svuotare tutte le carte preferite?")) return;
    clearFavorites();
    setList([]);
  }

  function handleReload() {
    setList(getFavorites());
  }

  return (
    <>
      <div className="preferitiPage">
        <div className="contenitorePage">
          <div className="preferitiActions" style={{display: 'flex', justifyContent: 'flex-end', gap: 12}}>
            <button className="btn btn--danger" onClick={handleClear}>Svuota preferiti</button>
          </div>
          <h2>Preferiti ({list.length})</h2>
          <div className="ContCardsPref">
          </div>
        </div>
      </div>
    </>
  );
};
export default Preferiti;