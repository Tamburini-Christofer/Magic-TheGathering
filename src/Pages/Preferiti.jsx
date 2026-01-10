import { useEffect, useState } from "react";
import { getFavorites, clearFavorites } from "../utils/favorites";
import Card from "../Components/Card";

const Preferiti = () => {
  const [list, setList] = useState([]);                                                    //* stato locale per la lista delle carte preferite

  useEffect(() => {
    setList(getFavorites());
  }, []);

  function handleClear() {
    if (!confirm("Vuoi svuotare tutte le carte preferite?")) return;                       //todo conferma l'azione di svuotamento preferiti     
    clearFavorites();
    setList([]);
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
            {list.map((c) => (
              <Card key={c.id} id={c.id} 
              className="cards cardPreferitiCont" forceFavActive={false} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Preferiti;