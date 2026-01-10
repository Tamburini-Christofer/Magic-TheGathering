import { useState, useRef, useEffect, useCallback } from "react";
import chalk from "chalk";

function Filter() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const wrapRef = useRef(null);

  const [openSort, setOpenSort] = useState(false);
  const [sortOrder, setSortOrder] = useState("az");
  const sortRef = useRef(null);
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  const searchTimerRef = useRef(null);

  const applySearch = useCallback((rawValue) => {
    const search = rawValue.toLowerCase().trim();
    const cards = document.querySelectorAll(".cards");
    cards.forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      if (!search || text.includes(search)) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = (e.target.value ?? e.target.textContent ?? "").toString();
    setSearchValue(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      if(value === "") {
      console.log(`${chalk.yellow("Ricerca vuota, nessun filtro applicato.")}`)
        applySearch(""); 
        return;
      }
      applySearch(value);
      console.log(`Hai cercato: ${chalk.green(value)} utilizzando la ${chalk.blue("barra di ricerca generica")}`);
    }, 1000);
  }, [applySearch]);

  const options = [
    { value: "", label: "Tutte le categorie" },
    { value: "terra", label: "Terra" },
    { value: "creatura", label: "Creatura" },
    { value: "incantesimo", label: "Incantesimo" },
    { value: "artefatto", label: "Artefatto" },
    { value: "stregoneria", label: "Stregoneria" },
    { value: "istantaneo", label: "Istantaneo" },
    { value: "planeswalker", label: "Planeswalker" },
    { value: "battaglia", label: "Battaglia" },
  ];

  const sortOptions = [
    { value: "az", label: "Dalla A alla Z" },
    { value: "za", label: "Dalla Z alla A" },
  ];

  const currentLabel =
    options.find((o) => o.value === category)?.label || "Tutte le categorie";
  const currentSortLabel =
    sortOptions.find((s) => s.value === sortOrder)?.label || "Dalla A alla Z";

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target))
        setOpenSort(false);
      if (countRef.current && !countRef.current.contains(e.target)) {
        // nessuna azione per ora
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  return (
    <><div>
      <form action="" className="filterContainer">
        <div className="inputCont">
          <input
            className="searchBar"
            type="text"
            placeholder="Cerca carte, set, edizioni..."
            value={searchValue}
            onChange={handleSearchChange}
          />

          <div className="customSelect" ref={wrapRef}>
            <button
              type="button"
              className="customSelectBtn"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
            >
              <span className="customSelectLabel">{currentLabel}</span>
            </button>

            {open && (
              <ul className="customOptions">
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    className="Option"
                    role="option"
                    onClick={() => {
                      setCategory(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="customSelect" ref={sortRef}>
            <button
              type="button"
              className="customSelectBtn"
              onClick={() => setOpenSort((s) => !s)}
              aria-expanded={openSort}
            >
              <span className="customSelectLabel">{currentSortLabel}</span>
            </button>

            {openSort && (
              <ul className="customOptions customOptionsAlfabethic">
                {sortOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className="Option"
                    onClick={() => {
                      setSortOrder(opt.value);
                      setOpenSort(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="costoSymbols">
            <span>Costo in mana</span>
            <div className="numericInputWrap" ref={countRef}>
              <input
                type="number"
                className="numericInput manaCost"
                value={count}
                onChange={(e) => {
                  const v = e.target.value;
                  setCount(v === "" ? 0 : parseInt(v, 10));
                }}
                aria-label="Costo mana"
                min={0}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="raritySymbols">
            <img src="/rarity/comuns.png" alt="" />
            <img src="/rarity/silver.png" alt="" />
            <img src="/rarity/rare.png" alt="" />
            <img src="/rarity/mitic.png" alt="" />
          </div>
          <div className="manaSymbols">
            <img src="/mana/water.png" alt="" />
            <img src="/mana/sun.png" alt="" />
            <img src="/mana/mountains.png" alt="" />
            <img src="/mana/swamp.png" alt="" />
            <img src="/mana/three.png" alt="" />
            <img src="/mana/nocolor.webp" alt="" />
          </div>
        </div>
      </form>
    </div></>
  );
}

export default Filter;
