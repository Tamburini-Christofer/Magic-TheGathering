import { useEffect, useState } from "react";
import { getFavorites, clearFavorites, saveFavorites } from "../utils/favorites";
import Card from "../Components/Card";
import chalk from "chalk";

const Preferiti = () => {
  const [list, setList] = useState([]);                                                    //* stato locale per la lista delle carte preferite
  const [draggedId, setDraggedId] = useState(null);                                        //* id della carta attualmente trascinata
  const [leftSlotId, setLeftSlotId] = useState(null);                                      //* carta nello slot sinistro di confronto
  const [rightSlotId, setRightSlotId] = useState(null);                                    //* carta nello slot destro di confronto
  const [returningIds, setReturningIds] = useState([]);                                    //* carte che stanno animando il ritorno in griglia
  const [leftCardData, setLeftCardData] = useState(null);                                  //* dati carta nello slot sinistro
  const [rightCardData, setRightCardData] = useState(null);                                //* dati carta nello slot destro
  const [allCardData, setAllCardData] = useState({});                                      //* dati di tutte le carte preferite (per statistiche)

  useEffect(() => {
    setList(getFavorites());
  }, []);

  // aggiorna la mappa con i dati completi di una carta (usato per le statistiche globali)
  const handleCardLoadedForStats = (data) => {
    if (!data || !data.id) return;
    setAllCardData((prev) => {
      if (prev[data.id] && prev[data.id] === data) return prev;
      return { ...prev, [data.id]: data };
    });
  };

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
    // se nello slot c'è già una carta, la facciamo "tornare" in griglia
    if (slot === "left" && leftSlotId) {
      const prevId = leftSlotId;
      setReturningIds((prev) => (prev.includes(prevId) ? prev : [...prev, prevId]));
      setTimeout(() => {
        setReturningIds((prev) => prev.filter((id) => id !== prevId));
      }, 450);
    }
    if (slot === "right" && rightSlotId) {
      const prevId = rightSlotId;
      setReturningIds((prev) => (prev.includes(prevId) ? prev : [...prev, prevId]));
      setTimeout(() => {
        setReturningIds((prev) => prev.filter((id) => id !== prevId));
      }, 450);
    }
    if (slot === "left") {
      setLeftSlotId(draggedId);
      setLeftCardData(null);
    } else {
      setRightSlotId(draggedId);
      setRightCardData(null);
    }
    setDraggedId(null);
  };

  function handleClear() {
    if (!confirm("Vuoi svuotare tutte le carte preferite?")) return;                       //todo conferma l'azione di svuotamento preferiti     
    clearFavorites();
    setList([]);                                                                            //* svuota la lista locale
    setDraggedId(null);                                                                    //* nessuna carta in drag
    setLeftSlotId(null);                                                                   //* svuota slot sinistro di confronto
    setRightSlotId(null);                                                                  //* svuota slot destro di confronto
    setLeftCardData(null);                                                                 //* rimuove dati carta sinistra
    setRightCardData(null);                                                                //* rimuove dati carta destra
    setAllCardData({});                                                                    //* azzera dati globali per statistiche
    window.dispatchEvent(new CustomEvent("favoritesChanged"));   
    console.log(chalk.yellow("Preferiti svuotati"));                         //* notifica le altre parti dell'app (es. NavBar)
  }

  // calcola differenze per i due slot (sinistra - destra)
  const compareDiffs = (() => {
    if (!leftCardData || !rightCardData) return { left: null, right: null };

    const toNumber = (val) => {
      if (val === null || typeof val === "undefined") return null;
      const n = Number(val);
      return Number.isNaN(n) ? null : n;
    };

    const manaLNum = toNumber(leftCardData.manaCost);
    const manaRNum = toNumber(rightCardData.manaCost);
    const manaDiff = manaLNum !== null && manaRNum !== null ? manaLNum - manaRNum : null;

    const powerDiff =
      typeof leftCardData?.power === "number" && typeof rightCardData?.power === "number"
        ? leftCardData.power - rightCardData.power
        : null;

    const toughDiff =
      typeof leftCardData?.toughness === "number" && typeof rightCardData?.toughness === "number"
        ? leftCardData.toughness - rightCardData.toughness
        : null;

    const rarityOrder = {
      "comune": 1,
      "non comune": 2,
      "rara": 3,
      "mitica": 4,
      "mitica rara": 4,
    };
    const rL = leftCardData?.rarity?.toString().toLowerCase() ?? "";
    const rR = rightCardData?.rarity?.toString().toLowerCase() ?? "";
    const rankL = rarityOrder[rL] ?? null;
    const rankR = rarityOrder[rR] ?? null;
    const rarityDiff = rankL !== null && rankR !== null ? rankL - rankR : null;

    const left = { mana: manaDiff, power: powerDiff, toughness: toughDiff, rarity: rarityDiff };
    const right = {
      mana: manaDiff !== null ? -manaDiff : null,
      power: powerDiff !== null ? -powerDiff : null,
      toughness: toughDiff !== null ? -toughDiff : null,
      rarity: rarityDiff !== null ? -rarityDiff : null,
    };

    console.log(chalk.green("Differenza calculated:"), {left, right});  //todo log differenze calcolate

    return { left, right };
  })();

  return (
    <>
      <div className="preferitiPage">
        <div className="contenitorePage">
          <div>
            <button className="btn btn--danger" onClick={handleClear}>Svuota preferiti</button>
          </div>
          <h2>Preferiti ({list.length})</h2>
          {list.length === 0 ? (
            <div className="emptyFavoritesWrapper">
              <div className="emptyFavoritesCard">
                <h3 className="emptyFavoritesTitle">Nessuna carta tra i preferiti</h3>
              </div>
            </div>
          ) : (
            <>
              <div className="ContCardsPref">
                {list.map((c) => {
                  const isInCompare = c.id === leftSlotId || c.id === rightSlotId;
                  const isReturning = returningIds.includes(c.id);
                  const classes = [
                    "cards",
                    "cardPreferitiCont",
                    "cardPreferitiDraggable",
                    isInCompare && !isReturning ? "cardPreferitiHidden" : "",
                    isReturning ? "cardPreferitiReturning" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <Card
                      key={c.id}
                      id={c.id}
                      className={classes}
                      forceFavActive={false}
                      onDataLoaded={handleCardLoadedForStats}
                      draggableProps={{
                        draggable: true,
                        onDragStart: handleDragStart(c.id),
                        onDragOver: handleDragOver(),
                        onDrop: handleDrop(c.id),
                        onDragEnd: handleDragEnd,
                        expandOnDrop: true,
                      }}
                    />
                  );
                })}
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
                      className="cards compareCard"
                      forceFavActive={false}
                      onDataLoaded={(data) => { setLeftCardData(data); handleCardLoadedForStats(data); }}
                      compareDiff={compareDiffs.left}
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
                      className="cards compareCard"
                      forceFavActive={false}
                      onDataLoaded={(data) => { setRightCardData(data); handleCardLoadedForStats(data); }}
                      compareDiff={compareDiffs.right}
                    />
                  ) : (
                    <span className="comparePlaceholder">Trascina un'altra carta qui</span>
                  )}
                </div>
              </div>

              {leftCardData && rightCardData && (
                <div className="compareStats">
                  <div className="compareStatsContent">
              <table className="compareTable">
                <thead>
                  <tr>
                    <th>Proprietà</th>
                    <th>Sx</th>
                    <th>Dx</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const manaL = leftCardData.manaCost ?? "-";
                    const manaR = rightCardData.manaCost ?? "-";
                    const numManaL = Number(manaL);
                    const numManaR = Number(manaR);
                    const manaLeftBetter = !Number.isNaN(numManaL) && !Number.isNaN(numManaR) && numManaL > numManaR;
                    const manaRightBetter = !Number.isNaN(numManaL) && !Number.isNaN(numManaR) && numManaR > numManaL;
                    const manaDiff = !Number.isNaN(numManaL) && !Number.isNaN(numManaR) ? numManaL - numManaR : null;

                    const powerL = leftCardData.power ?? "-";
                    const powerR = rightCardData.power ?? "-";
                    const powLeftBetter = typeof leftCardData.power === "number" && typeof rightCardData.power === "number" && leftCardData.power > rightCardData.power;
                    const powRightBetter = typeof leftCardData.power === "number" && typeof rightCardData.power === "number" && rightCardData.power > leftCardData.power;
                    const powerDiff = typeof leftCardData.power === "number" && typeof rightCardData.power === "number"
                      ? leftCardData.power - rightCardData.power
                      : null;

                    const toughL = leftCardData.toughness ?? "-";
                    const toughR = rightCardData.toughness ?? "-";
                    const toughLeftBetter = typeof leftCardData.toughness === "number" && typeof rightCardData.toughness === "number" && leftCardData.toughness > rightCardData.toughness;
                    const toughRightBetter = typeof leftCardData.toughness === "number" && typeof rightCardData.toughness === "number" && rightCardData.toughness > leftCardData.toughness;
                    const toughDiff = typeof leftCardData.toughness === "number" && typeof rightCardData.toughness === "number"
                      ? leftCardData.toughness - rightCardData.toughness
                      : null;

                    const rarityL = leftCardData.rarity || "-";
                    const rarityR = rightCardData.rarity || "-";

                    const rarityOrder = {
                      "comune": 1,
                      "non comune": 2,
                      "rara": 3,
                      "mitica": 4,
                      "mitica rara": 4,
                    };
                    const rankL = rarityOrder[rarityL?.toString().toLowerCase()] ?? null;
                    const rankR = rarityOrder[rarityR?.toString().toLowerCase()] ?? null;
                    const rarityDiff = rankL !== null && rankR !== null ? rankL - rankR : null;

                    const diffLabelClass = (diff) => {
                      if (diff === null) return "diffLabel diffLabel--neutral";
                      if (diff > 0) return "diffLabel diffLabel--positive";
                      if (diff < 0) return "diffLabel diffLabel--negative";
                      return "diffLabel diffLabel--equal";
                    };

                    const formatDiff = (diff) => {
                      if (diff === null) return "n/d";
                      if (diff > 0) return `+${diff}`;
                      if (diff < 0) return `${diff}`;
                      return "0";
                    };

                    return (
                      <>
                        <tr>
                          <td>Mana</td>
                          <td className={manaLeftBetter ? "better" : ""}>
                            {manaL}
                            <span className={diffLabelClass(manaDiff)}>{formatDiff(manaDiff)}</span>
                          </td>
                          <td className={manaRightBetter ? "better" : ""}>
                            {manaR}
                            <span className={diffLabelClass(manaDiff !== null ? -manaDiff : null)}>
                              {formatDiff(manaDiff !== null ? -manaDiff : null)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Forza</td>
                          <td className={powLeftBetter ? "better" : ""}>
                            {powerL}
                            <span className={diffLabelClass(powerDiff)}>{formatDiff(powerDiff)}</span>
                          </td>
                          <td className={powRightBetter ? "better" : ""}>
                            {powerR}
                            <span className={diffLabelClass(powerDiff !== null ? -powerDiff : null)}>
                              {formatDiff(powerDiff !== null ? -powerDiff : null)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Difesa</td>
                          <td className={toughLeftBetter ? "better" : ""}>
                            {toughL}
                            <span className={diffLabelClass(toughDiff)}>{formatDiff(toughDiff)}</span>
                          </td>
                          <td className={toughRightBetter ? "better" : ""}>
                            {toughR}
                            <span className={diffLabelClass(toughDiff !== null ? -toughDiff : null)}>
                              {formatDiff(toughDiff !== null ? -toughDiff : null)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Rarità</td>
                          <td>
                            {rarityL}
                            <span className={diffLabelClass(rarityDiff)}>{formatDiff(rarityDiff)}</span>
                          </td>
                          <td>
                            {rarityR}
                            <span className={diffLabelClass(rarityDiff !== null ? -rarityDiff : null)}>
                              {formatDiff(rarityDiff !== null ? -rarityDiff : null)}
                            </span>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>

              {(() => {
                const statsCards = list
                  .map((c) => allCardData[c.id])
                  .filter((c) => !!c);

                if (!statsCards.length) return null;

                const colorMap = new Map();
                const typeMap = new Map();
                const rarityMap = new Map();

                const normalize = (str) =>
                  str && typeof str === "string" ? str.trim() : null;

                const colorLabelFrom = (raw) => {
                  if (!raw) return "Altro";
                  const txt = raw.toString().toLowerCase();
                  if (txt.includes("bianco") || txt.includes("white")) return "Bianco";
                  if (txt.includes("blu") || txt.includes("blue")) return "Blu";
                  if (txt.includes("nero") || txt.includes("black")) return "Nero";
                  if (txt.includes("rosso") || txt.includes("red")) return "Rosso";
                  if (txt.includes("verde") || txt.includes("green")) return "Verde";
                  return "Altro";
                };

                statsCards.forEach((card) => {
                  const colorKey = colorLabelFrom(card.colors);
                  colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);

                  const typeKey = normalize(card.category) || "Senza tipologia";
                  typeMap.set(typeKey, (typeMap.get(typeKey) || 0) + 1);

                  const rarityKey = normalize(card.rarity) || "Senza rarità";
                  rarityMap.set(rarityKey, (rarityMap.get(rarityKey) || 0) + 1);
                });

                return (
                  <div className="favoritesSummary">
                    <div className="favoritesSummaryGrid">
                      <div className="favoritesSummaryCol">
                        <h5>Colori mana</h5>
                        {[...colorMap.entries()].map(([k, v]) => {
                          let icon = "";
                          if (k === "Bianco") icon = "/mana/sun.png";
                          else if (k === "Blu") icon = "/mana/water.png";
                          else if (k === "Nero") icon = "/mana/swamp.png";
                          else if (k === "Rosso") icon = "/mana/mountains.png";
                          else if (k === "Verde") icon = "/mana/three.png";
                          else icon = "/mana/nocolor.webp";
                          return (
                            <div className="favoritesSummaryItem" key={k}>
                              <img className="favoritesSummaryIcon" src={icon} alt={k} />
                              <span className="favoritesSummaryLabel">{k}</span>
                              <span className="favoritesSummaryCount">{v}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="favoritesSummaryCol">
                        <h5>Rarità</h5>
                        {[...rarityMap.entries()].map(([k, v]) => {
                          const key = k.toString().toLowerCase();
                          let icon = "";
                          if (key.includes("comune") && !key.includes("non")) icon = "/rarity/comuns.png";
                          else if (key.includes("non comune")) icon = "/rarity/silver.png";
                          else if (key.includes("rara") && !key.includes("mitica")) icon = "/rarity/rare.png";
                          else if (key.includes("mitica")) icon = "/rarity/mitic.png";
                          return (
                            <div className="favoritesSummaryItem" key={k}>
                              {icon && (
                                <img className="favoritesSummaryIcon" src={icon} alt={k} />
                              )}
                              <span className="favoritesSummaryLabel">{k}</span>
                              <span className="favoritesSummaryCount">{v}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="favoritesSummaryCol">
                        <h5>Tipologie</h5>
                        {[...typeMap.entries()].map(([k, v]) => (
                          <div className="favoritesSummaryItem" key={k}>
                            <span className="favoritesSummaryLabel">{k}</span>
                            <span className="favoritesSummaryCount">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Preferiti;