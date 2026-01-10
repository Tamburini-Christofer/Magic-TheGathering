import { useEffect, useState } from "react";
import { getFavorites, clearFavorites, saveFavorites } from "../utils/favorites";
import Card from "../Components/Card";

const Preferiti = () => {
  const [list, setList] = useState([]);                                                    //* stato locale per la lista delle carte preferite
  const [draggedId, setDraggedId] = useState(null);                                        //* id della carta attualmente trascinata
  const [leftSlotId, setLeftSlotId] = useState(null);                                      //* carta nello slot sinistro di confronto
  const [rightSlotId, setRightSlotId] = useState(null);                                    //* carta nello slot destro di confronto

  useEffect(() => {
    setList(getFavorites());
  }, []);

  const handleDragStart = (id) => (e) => {
    e.stopPropagation();
    setDraggedId(id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      // alcuni browser richiedono almeno un dato per attivare il drag
      e.dataTransfer.setData("text/plain", String(id));
    }
  };

  const handleDragOver = () => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (targetId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedId || draggedId === targetId) return;
    setList((prev) => {
      const updated = [...prev];
      const fromIndex = updated.findIndex((c) => c.id === draggedId);
      const toIndex = updated.findIndex((c) => c.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      saveFavorites(updated);
      return updated;
    });
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleDragOverSlot = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDropOnSlot = (slot) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedId) return;
    if (slot === "left") {
      setLeftSlotId(draggedId);
    } else {
      setRightSlotId(draggedId);
    }
    setDraggedId(null);
  };

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
              <Card
                key={c.id}
                id={c.id}
                className="cards cardPreferitiCont cardPreferitiDraggable"
                forceFavActive={false}
                draggableProps={{
                  draggable: true,
                  onDragStart: handleDragStart(c.id),
                  onDragOver: handleDragOver(),
                  onDrop: handleDrop(c.id),
                  onDragEnd: handleDragEnd,
                  expandOnDrop: true,
                }}
              />
            ))}
          </div>
          <div className="compareArea">
            <div
              className="compareSlot compareSlotLeft"
              onDragOver={handleDragOverSlot}
              onDrop={handleDropOnSlot("left")}
            >
              {leftSlotId ? (
                <Card
                  id={leftSlotId}
                  className="cards cardPreferitiCont compareCard"
                  forceFavActive={false}
                />
              ) : (
                <span className="comparePlaceholder">Trascina una carta qui</span>
              )}
            </div>
            <div
              className="compareSlot compareSlotRight"
              onDragOver={handleDragOverSlot}
              onDrop={handleDropOnSlot("right")}
            >
              {rightSlotId ? (
                <Card
                  id={rightSlotId}
                  className="cards cardPreferitiCont compareCard"
                  forceFavActive={false}
                />
              ) : (
                <span className="comparePlaceholder">Trascina un'altra carta qui</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Preferiti;