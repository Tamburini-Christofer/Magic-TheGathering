import { useState, useRef, useEffect, useCallback } from "react";
import chalk from "chalk";

function Filter() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [catehorySelected, setCategorySelected] = useState("");
  const [sort, setSort] = useState("");
  const [mana, setMana] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const wrapRef = useRef(null);

  const [openSort, setOpenSort] = useState(false);
  const [sortOrder, setSortOrder] = useState("az");
  const sortRef = useRef(null);
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  const searchTimerRef = useRef(null);
  const manaTimerRef = useRef(null);

  const filterCards = useCallback((searchTerm, categoryValue, manaValue) => {
    const search = (searchTerm || "").toLowerCase().trim();
    const categoryFilter = (categoryValue || "").toLowerCase().trim();
    const manaFilter = manaValue === "" || manaValue === null ? null : Number(manaValue);

    const cards = document.querySelectorAll(".cards");
    cards.forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      const catNode = el.querySelector(".categoryCard h5");
      const catText = (catNode?.textContent || "").toLowerCase();
      const manaNode = el.querySelector(".costMana");
      const manaText = (manaNode?.textContent || "").toString().trim();
      const manaNum = manaText === "" ? null : Number(manaText);

      const matchesSearch = !search || text.includes(search);
      const matchesCategory = !categoryFilter || catText.includes(categoryFilter);
      const matchesMana =
        manaFilter === null || (typeof manaNum === "number" && !Number.isNaN(manaNum) && manaNum === manaFilter);

      el.style.display = matchesSearch && matchesCategory && matchesMana ? "" : "none";
    });
  }, []);

  const applySearch = useCallback((rawValue, categoryValue, manaValue) => {
    filterCards(rawValue, categoryValue ?? catehorySelected, manaValue ?? mana);
  }, [filterCards, catehorySelected, mana]);

  const handleSearchChange = useCallback((e) => {
    const value = (e.target.value ?? e.target.textContent ?? "").toString();
    setSearchValue(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      if (value === "") {
        console.log(`${chalk.yellow("Il filtro generico è stato resettato.")}`);
        applySearch("", catehorySelected, mana);
        return;
      }
      applySearch(value, catehorySelected, mana);
      console.log(`Hai cercato: ${chalk.green(value)} utilizzando la ${chalk.blue("barra di ricerca generica")}`);
    }, 1000);
  }, [applySearch, catehorySelected, mana]);

  const handleCategoryChange = useCallback((e) => {
    const value = (e.target.value ?? "").toString();
    if(value === "") {
      console.log(`${chalk.yellow("Il filtro categoria è stato resettato.")}`)
      return;
    }
    setCategorySelected(value);
    setCategory(value);
    console.log(`Hai cercato la categoria ${chalk.green(value)} utilizzando ${chalk.blue("il filtro categoria")}.`);
    filterCards(searchValue, value, mana);
  }, [filterCards, searchValue, mana]);

  const handleSortChange = useCallback((e) => {
    const value = (e.target.value ?? "").toString();
    if (value === "") {
      console.log(`${chalk.yellow("Il filtro alfabetico è stato resettato.")}`);
      setSortOrder("");
      setSort("");
      return;
    }
    setSortOrder(value);
    setSort(value);
    console.log(`Ordine di ordinamento selezionato: ${chalk.green(value)} usando ${chalk.blue("il filtro alfabetico")}.`);

    const cards = Array.from(document.querySelectorAll(".cards"));
    if (cards.length === 0) return;

    const parent = cards[0].parentElement;
    const sorted = cards.slice().sort((a, b) => {
      const ta = (a.querySelector(".titleCard h4")?.textContent || "").toLowerCase();
      const tb = (b.querySelector(".titleCard h4")?.textContent || "").toLowerCase();

      if (value === "dalla z alla a") {
        return tb.localeCompare(ta);
      }
      // default: dalla a alla z
      return ta.localeCompare(tb);
    });

    sorted.forEach((cardEl) => {
      parent.appendChild(cardEl);
    });
  }, []);

  const handleManaChange = useCallback((e) => {
    const raw = e.target.value;
    setMana(raw);

    if (manaTimerRef.current) {
      clearTimeout(manaTimerRef.current);
    }

    manaTimerRef.current = setTimeout(() => {
      // reset filtro mana se vuoto
      if (raw === "") {
        console.log(`${chalk.yellow("Il filtro costo mana è stato resettato.")}`);
        filterCards(searchValue, catehorySelected, "");
        return;
      }

      const value = Number(raw);
      if (Number.isNaN(value)) {
        filterCards(searchValue, catehorySelected, "");
        return;
      }

      if (value > 15) {
        console.log(`Hai cercato costo mana: ${chalk.green(value)} utilizzando il ${chalk.blue("filtro costo mana")}. Tuttavia i valori superiori a 15 potrebbero far parte di carte ${chalk.red("non ufficiali")}.`);
        filterCards(searchValue, catehorySelected, value);
        return;
      }

      if (value === 0) {
        console.log(`Hai cercato costo mana: ${chalk.green(value)} utilizzando il ${chalk.blue("filtro costo mana")}. Molto probabilmente una terra.`);
        filterCards(searchValue, catehorySelected, value);
        return;
      }

      // 0 < value <= 15
      console.log(`Hai cercato costo mana: ${chalk.green(value)} utilizzando il ${chalk.blue("filtro costo mana")}.`);
      filterCards(searchValue, catehorySelected, value);
    }, 500);
  }, [filterCards, searchValue, catehorySelected]);
  
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
    { value: "", label: "Ordine alfabetico" },
    { value: "dalla a alla z", label: "Dalla A alla Z" },
    { value: "dalla z alla a", label: "Dalla Z alla A" },
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
                    value={searchValue}
                    onClick={() => {
                    setCategory(opt.value)
                    setOpen(false)
                    handleCategoryChange({target: {value: opt.value}})
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
                      handleSortChange({target: {value: opt.value}});
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
                  handleManaChange(e);
                  
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
