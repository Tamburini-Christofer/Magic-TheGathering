//! le dipendenze da React e Chalk
import { useState, useRef, useEffect, useCallback } from "react";
import chalk from "chalk";
//!

//! Inizio funzione Filter
function Filter() {

  //! Definizione degli stati e dei riferimenti
  //? Riferimenti per i timer di ricerca e costo mana

  const searchTimerRef = useRef(null);                                                         //* riferimento per il timer della ricerca generica
  const manaTimerRef = useRef(null);                                                           //* riferimento per il timer del filtro costo mana                         
  const countRef = useRef(null);                                                               //* riferimento per il wrapper del filtro costo mana 
  const sortRef = useRef(null);                                                                //* riferimento per il wrapper del filtro ordine alfabetico
  const wrapRef = useRef(null);                                                                //* riferimento per il wrapper del filtro categoria carta

    //? Stato per il valore di ricerca
  const [searchValue, setSearchValue] = useState("");                                          //* stato per il valore di ricerca generica

    //? Stati per gestire l'apertura dei menu a tendina
  const [open, setOpen] = useState(false);                                                     //* stato per l'apertura del menu a tendina categoria carta              
  const [category, setCategory] = useState("");                                                //* stato per la categoria selezionata
  const [catehorySelected, setCategorySelected] = useState("");                                //* stato per la categoria selezionata da usare nei filtri

    //? Stati per gestire l'ordinamento alfabetico
  const [openSort, setOpenSort] = useState(false);                                             //* stato per l'apertura del menu a tendina ordine alfabetico
  const [sort, setSort] = useState("");                                                        //* stato per l'ordine di ordinamento selezionato
  const [sortOrder, setSortOrder] = useState("az");                                            //* stato per l'ordine di ordinamento selezionato da usare nei filtri
  //? Stati per il filtro costo mana                                                                      
  const [mana, setMana] = useState("");                                                        //* stato per il costo mana selezionato

  //? Stato per il filtro colore mana e costo
  const [colorFilter, setColorFilter] = useState("");                                          //* stato per il filtro colore mana selezionato
  const [count, setCount] = useState(0);                                                       //* stato per il valore numerico del costo mana
  //!

  //! Funzione per filtrare le carte
  const filterCards = useCallback((searchTerm, categoryValue, manaValue, colorValue) => {
    const search = (searchTerm || "").toLowerCase().trim();                                   //* filtro di ricerca converte in minuscolo e toglie gli spazi
    const categoryFilter = (categoryValue || "").toLowerCase().trim();                        //* filtro categoria converte in minuscolo e toglie gli spazi            
    const manaFilter = manaValue === "" || manaValue === null ? null : Number(manaValue);     //* filtro mana converte in numero o null se vuoto
    const colorFilterLocal = (colorValue || "").toLowerCase().trim();                         //* filtro colore converte in minuscolo e toglie gli spazi  
    const cards = document.querySelectorAll(".cards");                                        //* seleziona tutte le carte presenti nel DOM     
    cards.forEach((el) => {
      const text = (el.textContent || "").toLowerCase();                                      //* testo completo della carta in minuscolo
      const catNode = el.querySelector(".categoryCard h5");                                   //* nodo categoria della carta
      const catText = (catNode?.textContent || "").toLowerCase();                             //* testo categoria in minuscolo
      const manaNode = el.querySelector(".costMana");                                         //* nodo costo mana della carta
      const manaText = (manaNode?.textContent || "").toString().trim();                       //* testo costo mana in stringa e senza spazi
      const manaNum = manaText === "" ? null : Number(manaText);                              //* costo mana convertito in numero o null se vuoto
      const colorNode = el.querySelector(".colorHidden");                                     //* nodo colore della carta 
      const colorText = (colorNode?.textContent || "").toLowerCase();                         //* testo colore in minuscolo
      const matchesSearch = !search || text.includes(search);                                 //* verifica se il testo della carta include il termine di ricerca
      const matchesCategory = !categoryFilter || catText.includes(categoryFilter);            //* verifica se la categoria della carta include il filtro categoria
      const matchesColor = !colorFilterLocal || colorText.includes(colorFilterLocal);         //* verifica se il colore della carta include il filtro colore
      const matchesMana =
        manaFilter === null || (typeof manaNum === "number" && !Number.isNaN(manaNum) && manaNum === manaFilter);
      el.style.display = matchesSearch && matchesCategory && matchesMana && matchesColor ? "" : "none";
    });
  }, []);  
  //!                                                                                         //* Esegui una volta sola

  //! Funzioni di gestione degli eventi
  const applySearch = useCallback((rawValue, categoryValue, manaValue, colorValue) => {
    filterCards(
      rawValue,
      categoryValue ?? catehorySelected,
      manaValue ?? mana,
      colorValue ?? colorFilter
    );
  }, [filterCards, catehorySelected, mana, colorFilter]);
  //!

  //! Gestore del cambiamento nella barra di ricerca

  const handleSearchChange = useCallback((e) => {
    const value = (e.target.value ?? e.target.textContent ?? "").toString();
    setSearchValue(value);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      if (value === "") {
        console.log(`${chalk.yellow("Il filtro generico è stato resettato.")}`);                                      //todo Console Log di reset filtro generico                     
        applySearch("", catehorySelected, mana, colorFilter);
        return;
      }
      applySearch(value, catehorySelected, mana, colorFilter);
      console.log(`Hai cercato: ${chalk.green(value)} utilizzando la ${chalk.blue("barra di ricerca generica")}`);    //* Console Log di ricerca filtro generico
    }, 1000);
  }, [applySearch, catehorySelected, mana, colorFilter]);
  //!

  //! Filtri selezione
  //* Gestore del cambiamento nelfiltro categoria

  const handleCategoryChange = useCallback((e) => {
    const value = (e.target.value ?? "").toString();
    if(value === "") {
      console.log(`${chalk.yellow("Il filtro categoria è stato resettato.")}`);                                       //todo Console Log di reset filtro categoria
      return;
    }
    setCategorySelected(value);
    setCategory(value);
    console.log(`Hai cercato la categoria ${chalk.green(value)} utilizzando ${chalk.blue("il filtro categoria")}.`);  //* Console Log di ricerca filtro categoria
    filterCards(searchValue, value, mana, colorFilter);
  }, [filterCards, searchValue, mana, colorFilter]);
  //*

  //* Gestore del cambiamento nel filtro alfabetico

  const handleSortChange = useCallback((e) => {
    const value = (e.target.value ?? "").toString();
    if (value === "") {
      console.log(`${chalk.yellow("Il filtro alfabetico è stato resettato.")}`);                                      //todo Console Log di reset filtro alfabetico
      setSortOrder("");
      setSort("");
      return;
    }
    setSortOrder(value);
    setSort(value);
    console.log(`Ordine di ordinamento selezionato: ${chalk.green(value)} usando ${chalk.blue("il filtro alfabetico")}.`); //* Console Log di ricerca filtro alfabetico
    const cards = Array.from(document.querySelectorAll(".cards"));
    if (cards.length === 0) return;
    const parent = cards[0].parentElement;
    const sorted = cards.slice().sort((a, b) => {
      const ta = (a.querySelector(".titleCard h4")?.textContent || "").toLowerCase();
      const tb = (b.querySelector(".titleCard h4")?.textContent || "").toLowerCase();
      if (value === "dalla z alla a") {
        return tb.localeCompare(ta);
      }
      return ta.localeCompare(tb);
    });
    sorted.forEach((cardEl) => {
      parent.appendChild(cardEl);
    });
  }, []);
  //*
  //!

  //! Funzioni di gestione filtro nuemrico
  //* Gestore del cambiamento nel filtro costo mana

  const handleManaChange = useCallback((e) => {
    const raw = e.target.value;
    setMana(raw);

    if (manaTimerRef.current) {
      clearTimeout(manaTimerRef.current);
    }
    manaTimerRef.current = setTimeout(() => {
      // reset filtro mana se vuoto
      if (raw === "") {
        console.log(`${chalk.yellow("Il filtro costo mana è stato resettato.")}`);                                  //todo Console Log di reset filtro costo mana
        filterCards(searchValue, catehorySelected, "", colorFilter);
        return;
      }
      const value = Number(raw);
      if (Number.isNaN(value)) {
        filterCards(searchValue, catehorySelected, "", colorFilter);
        return;
      }
      if (value > 15) { //todo avviso per valori superiori a 15
        console.log(`Hai cercato costo mana: ${chalk.green(value)} utilizzando il ${chalk.blue("filtro costo mana")}. Tuttavia i valori superiori a 15 potrebbero far parte di carte ${chalk.red("non ufficiali")}.`);
        filterCards(searchValue, catehorySelected, value, colorFilter);
        return;
      }
      if (value === 0) { //todo avviso per valori a 0
        console.log(`Hai cercato costo mana: ${chalk.green(value)} utilizzando il ${chalk.blue("filtro costo mana")}. Molto probabilmente una terra.`);
        filterCards(searchValue, catehorySelected, value, colorFilter);
        return;
      }
      console.log(`Hai cercato costo mana: ${chalk.green(value)} utilizzando il ${chalk.blue("filtro costo mana")}.`);        //* Console Log di ricerca filtro costo mana
      filterCards(searchValue, catehorySelected, value, colorFilter);
    }, 500);
  }, [filterCards, searchValue, catehorySelected, colorFilter]);
  //*
  //!
 
  //! Funzioni di gestione filtro simboli
  //* Gestore del clic sui simboli di rarità

  const handleRarityClick = useCallback((rarityValue) => {
    const value = (rarityValue || "").toString().toLowerCase();
    setSearchValue(value);
    // quando filtro per rarità, azzero il filtro colore
    setColorFilter("");
    if (!value) {
      console.log(`${chalk.yellow("Il filtro rarità è stato resettato.")}`);                                              //todo Console Log di reset filtro rarità
      applySearch("", catehorySelected, mana, "");
      return;
    }
    console.log(`Hai filtrato per rarità: ${chalk.green(value)} usando ${chalk.blue("i simboli di rarità")}.`);           //* Console Log di ricerca filtro rarità
    applySearch(value, catehorySelected, mana, "");
  }, [applySearch, catehorySelected, mana]);
  //*
 
  //* Gestore del clic sui simboli di colore mana

  const handleManaSymbolClick = useCallback((colorValue) => {
    const value = (colorValue || "").toString().toLowerCase();
    setColorFilter(value);
    if (!value) {
      console.log(`${chalk.yellow("Il filtro colore mana è stato resettato.")}`);                                          //todo Console Log di reset filtro colore mana
      applySearch("", catehorySelected, mana, "");
      return;
    }
    console.log(`Hai filtrato per colore di mana: ${chalk.green(value)} usando ${chalk.blue("i simboli di mana")}.`);      //* Console Log di ricerca filtro colore mana
    applySearch("", catehorySelected, mana, value);
  }, [applySearch, catehorySelected, mana]);
  //*
  //!
  
  //! Definizione delle opzioni per i menu a tendina
  //? Opzioni per il filtro categoria
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
  //?

  //? Opzioni per il filtro alfabetico
  const sortOptions = [
    { value: "", label: "Ordine alfabetico" },
    { value: "dalla a alla z", label: "Dalla A alla Z" },
    { value: "dalla z alla a", label: "Dalla Z alla A" },
  ];
  //?

  //! Etichette correnti per i menu a tendina
  const currentLabel =
    options.find((o) => o.value === category)?.label || "Tutte le categorie";
  const currentSortLabel =
    sortOptions.find((s) => s.value === sortOrder)?.label || "Dalla A alla Z";
  //!

  //! Effetti aggiontivi di debugging e chiusura menu
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
  //!

  //! Render del componente Filter

  return (
    <>
    <div>
      <form action="" className="filterContainer">
        <div className="inputCont">

        {/* Primo input: inserimento testo generico per ricerca carte */}

          <input
            className="searchBar"
            type="text"
            placeholder="Cerca carte, set, edizioni..."
            value={searchValue}
            onChange={handleSearchChange}
          />

          <div className="customSelect" ref={wrapRef}>

        {/* Secondo input: selezione categoria carta */}

            <button
              type="button"
              className="customSelectBtn"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
            >
              <span className="customSelectLabel">{currentLabel}</span>
            </button>

          {/* Menu a tendina personalizzato selezione categoria carta */}

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

          {/* Terzo input: selezione ordine alfabetico */}

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

          {/* Menu a tendina personalizzato selezione ordine alfabetico */}

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

          {/* Quarto input: selezione costo mana */}

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

          {/* Quinto input: selezione rarità carta */}

            <img src="/rarity/comuns.png" alt="Comuni" onClick={() => handleRarityClick("comune")} />
            <img src="/rarity/silver.png" alt="Non comuni" onClick={() => handleRarityClick("non comune")} />
            <img src="/rarity/rare.png" alt="Rare" onClick={() => handleRarityClick("rara")} />
            <img src="/rarity/mitic.png" alt="Mitiche" onClick={() => handleRarityClick("mitica")} />
          </div>
          <div className="manaSymbols">

          {/* Sesto input: selezione simbolo mana */}    

            <img src="/mana/water.png" alt="Blu" onClick={() => handleManaSymbolClick("blu")} />
            <img src="/mana/sun.png" alt="Bianco" onClick={() => handleManaSymbolClick("bianco")} />
            <img src="/mana/mountains.png" alt="Rosso" onClick={() => handleManaSymbolClick("rosso")} />
            <img src="/mana/swamp.png" alt="Nero" onClick={() => handleManaSymbolClick("nero")} />
            <img src="/mana/three.png" alt="Verde" onClick={() => handleManaSymbolClick("verde")} />
            <img src="/mana/nocolor.webp" alt="Incolore" onClick={() => handleManaSymbolClick("incolore")} />
          </div>
        </div>
      </form>
    </div></>
  );
}

export default Filter;
