<h1 align="center">Progetto-finale-spec-frontend-front</h1>

###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="40" alt="vscode logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
</div>

###

[!HomePage](/public/Completato/Screenshot%202026-01-13%20141213.png)
[!HomePage](/public/Completato/Screenshot%202026-01-13%20141226.png)
[!HomePage](/public/Completato/Screenshot%202026-01-13%20141252.png)
[!HomePage](/public/Completato/Screenshot%202026-01-13%20141302.png)
[!HomePage](/public/Completato/Screenshot%202026-01-13%20141239.png)
[!HomePage](/public/Completato/Screenshot%202026-01-13%20141310.png)
[!HomePage](/public/Completato/Screenshot%202026-01-13%20141319.png)

<p align="left">Vi presento il progetto che porterò all'esame per la specializzazione Frontend Avanzato di Boolean.<br><br>In questo progetto sono state inserite tutte le conoscenze apprese durante il corso base e la specializzazione. <br><br>Il progetto si è svolto in questo modo: <br>- Analisi e pianificazione, con schemi, grafici, ricerche sull'argomento e ricerca dei materiali didattici necessari <br>- Creazione delle principali funzioni React e divisione dei file per un perfetto luogo di lavoro<br>- Inizia pianificazione di un layout che contenga NavBar e Footer statici e contenuto variabile. <br>- Creazione delle rotte necessarie e collegamento al Backend tramite generazione da file Typescript<br>- Realizzazione prima bozza Homepage, con componenti statici, nessuna logica.<br>- Inserimento delle rotte verso le altre pagine tramite App.jsx<br>- Realizzazione estetica della pagina "Tutte le carte" e il componente filtro. Ancora nessuna logica applicata<br>- Realizzazione estetica della pagina " Preferiti"<br>- Prima logica: Inserimento del tasto like sulle carte statiche e collegamento alla pagina preferiti<br>- Seconda logica: primo approccio ai filtri con la barra di ricerca generica<br>- Terza logica: integrazione della useCallback per richiamare soltanto una volta il comando di scrittura<br>- Quarta logica: aggiunto filtro categoria e ordine alfabetico, entrambi dei Select con opzioni<br>- Quinta logica: aggiunto filtro per ricerca Mana tramite numero con rispettive opzioni di validazione<br>- Sesta logica: creazione dei filtri mancanti, creazione del Overlay in HomePage<br>- Settima logica: Creazione comparazione tra valori carte. <br>- Migliorato lo stile della Homepage esteticamente<br>- Migliorato lo stile delle altre pagine<br>- Pulizia generale del codice + personalizzazione della console con messaggi dedicati + prima bozza di animazioni<br>- Creazione overlay della pagina dettagli<br>- Animazioni avanzate su tutte le pagine + Overlay<br>- Debug e pulizia codice <br><br>Tempo impiegato per il completamento: 50 ore<br><br>Giorni lavorati 10 totali</p>

###

<p align="center">🖼️ Cosa devi realizzare</p>

###

<p align="center">Una SPA che simula l’esperienza di un utente non autenticato, che può:<br><br>Sfogliare, cercare e filtrare record<br>Confrontare più elementi tra loro<br>Salvare i preferit<br><br>❌ Non può creare, modificare o cancellare record.</p>

###

<p align="center">Scegli liberamente l’argomento del tuo comparatore.<br><br>✅ Qualsiasi entità con proprietà confrontabili è valida!</p>

###

<p align="center">🥉 Requisiti Minimi</p>

###

<p align="left">1. Gestione di una risorsa definita in types.ts</p>

###

<p align="left">2. Lista dei record, che mostra solo le proprietà principali title e category, e include:<br><br>- Barra di ricerca per cercare nei titoli (title)<br>- Filtro per categoria (category)<br>- Ordinamento alfabetico per title o category (A-Z e Z-A)</p>

###

<p align="left">3. Pagina di dettaglio per ogni record, con visualizzazione estesa delle sue proprietà (es. price, description, brand, ecc.)</p>

###

<p align="left">4. Comparatore di 2 record, visualizzati affiancati per confrontarne le caratteristiche.</p>

###

<p align="left">5. Sistema di preferiti, sempre accessibile e aggiornabile:<br><br>L’utente può aggiungere o rimuovere record dai preferiti in qualsiasi momento<br>I preferiti devono essere consultabili in ogni sezione dell’app (es. tramite una sezione dedicata, un’icona fissa, o una sidebar)</p>

###

<p align="center">🥈 Requisiti Consigliati (Facoltativi)</p>

###

<p align="left">1. Comparatore di 2 o più record: il layout si adatta per confrontare più elementi affiancati</p>

###

<p align="left">2. Debounce sulla ricerca, per migliorare la UX ed evitare chiamate API inutili</p>

###

<p align="left">3. Persistenza dei preferiti (es. salvataggio in localStorage), così che rimangano anche dopo il refresh della pagina</p>

###

<p align="left">4 Gestione degli stati vuoti, come:<br>- Nessun risultato trovato<br>- Lista preferiti vuota<br>- Nessun elemento selezionato nel comparatore</p>

###

<p align="center">🥇 Requisiti Aggiuntivi (Facoltativi)</p>

###

<p align="left">1. Gestione di più risorse nella stessa SPA (es. products e courses), con interfacce distinte o integrate</p>

###

<p align="left">2. CRUD completo dal frontend:<br>- Creazione di nuovi record<br>- Modifica di record esistenti<br>- Eliminazione di record<br>- Validazione dei campi in input</p>

###

<p align="center">🎯 BONUS (Facoltativo)</p>

###

<p align="left">1. Creazione di una seconda versione del progetto in TypeScript.</p>

###