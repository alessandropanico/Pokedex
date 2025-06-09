/* QUI IMPORTIAMO IL POKEDEX */

let pokemon;
fetch('./pokemon.json-master/pokedex.json')
    .then(response => response.json())
    .then(data => {
        // Qui puoi manipolare i dati JSON ottenuti dalla risposta
        //console.log(data);
        // Esegui altre operazioni sul tuo Pokedex, come la ricerca
        pokemon = data.slice(0, 493) //Si può ridurrre il numero di Pokémon a piacimento ("0" vale "1")
        console.log(pokemon)
        generateCard(pokemon); // Chiamata alla funzione per generare le card dei Pokémon

    })
    .catch(error => {
        // Gestisci eventuali errori durante la richiesta
        console.error('Errore durante il recupero dei dati JSON:', error);
    });

//------------------------------------------------

//GENERIAMO DELLE CARD

const pokedexDiv = document.getElementById('pokedex')
const spritesDiv = document.getElementById('sprites');

function generateCard(pokemonList) {
    //CREAZIONE DELLA CARD

    pokemonList.forEach(pokemon => {
        const cardDiv = document.createElement('div')
        cardDiv.classList.add('card')

        //VANNO FORMATTATI GLI ID DEI POKEMON PERCHé IN REALTà L'ID="1" è UGUALE ALL'ID="001" NEL GIOCO.
        const formattedId = String(pokemon.id).padStart(3, '0')

        //CREAZIONE DELL'IMMAGINE
        const imgPokemon = document.createElement('img')
        imgPokemon.src = `./pokemon.json-master/images/${formattedId}.png`
        imgPokemon.alt = pokemon.name.english;

        //CREAZIONE DELLE SPRITES
        const imgSprites = document.createElement('img')
        imgSprites.src=`./pokemon.json-master/sprites/${formattedId+'MS'}.png`
        imgSprites.classList.add('pokemon-sprite'); //AGGIUNGO UNA CLASSE CSS

        //CREZIONE DEL NOME DEL POKEMON
        const pokemonName = document.createElement('h4')
        pokemonName.textContent = pokemon.name.english

        //CREAZIONE DEL NUMERO DEL POKEMON
        const pokemonID = document.createElement("h5")
        pokemonID.textContent = "#" + pokemon.id

        cardDiv.appendChild(imgPokemon)
        cardDiv.appendChild(imgSprites)
        cardDiv.appendChild(pokemonName)
        cardDiv.appendChild(pokemonID)

        //------------------------------------------------
        // Aggiungi l'evento di click alla scheda del Pokémon
        cardDiv.addEventListener('click', function () {
            const detailsDiv = cardDiv.querySelector('.pokemon-details');

            if (detailsDiv.style.display === 'none') {
                detailsDiv.style.display = 'block';
                imgPokemon.style.display = 'none'; // Nascondi l'immagine del Pokémon
            } else {
                detailsDiv.style.display = 'none';
                imgPokemon.style.display = 'block'; // Mostra l'immagine del Pokémon
            }
        });

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('pokemon-details');
        detailsDiv.style.display = 'none';

        const type = document.createElement('p');
        type.textContent = 'Type: ' + pokemon.type.join(', ');
        detailsDiv.appendChild(type);

        const baseStats = document.createElement('p');
        baseStats.textContent = 'Base Stats:';
        detailsDiv.appendChild(baseStats);

        const statsList = document.createElement('ul');
        for (const stat in pokemon.base) {
            const listItem = document.createElement('li');
            listItem.textContent = stat + ': ' + pokemon.base[stat];
            statsList.appendChild(listItem);
        }
        detailsDiv.appendChild(statsList);

        cardDiv.appendChild(detailsDiv);

        pokedexDiv.appendChild(cardDiv);
    });
}

//------------------------------------------------
//RICERCA POKèMON PER IL NOME
const searchBar = document.getElementById("search-bar")

searchBar.addEventListener('input', function () {
    const nomePiccolo = searchBar.value.toLowerCase();
    let pokemonFiltrato = [];
    pokemonFiltrato = pokemon.filter(pokemon => pokemon.name.english.toLowerCase().includes(nomePiccolo));

    // Rimuovi le card esistenti prima di generare le nuove card filtrate
    while (pokedexDiv.firstChild) {
        pokedexDiv.removeChild(pokedexDiv.firstChild);
    }

    generateCard(pokemonFiltrato);
});

//RICERCA POKèMON PER IL NUMERO
const searchNumBar = document.getElementById("numero-bar")

searchNumBar.addEventListener('input', function () {
    const ricerca = searchNumBar.value;
    let pokemonFiltrato = [];

    if (ricerca !== "") {
        if (!isNaN(ricerca)) {
            const idCercato = parseInt(ricerca);
            pokemonFiltrato = pokemon.filter(pokemon => pokemon.id === idCercato);
        }
    } else {
        pokemonFiltrato = pokemon;
    }
    // Rimuovi le card esistenti prima di generare le nuove card filtrate
    while (pokedexDiv.firstChild) {
        pokedexDiv.removeChild(pokedexDiv.firstChild);
    }

    generateCard(pokemonFiltrato);
});


//RICERCA POKéMON PER TIPOLOGIA
const typeBar = document.getElementById("type-bar");

typeBar.addEventListener('input', function () {
    const typesSearch = typeBar.value.toLowerCase().split(" ");
    let pokemonFiltrato = [];

    if (typesSearch.length > 0) {
        pokemonFiltrato = pokemon.filter(pokemon => {
            const typeMatch = typesSearch.every(type => pokemon.type.some(pokemonType => pokemonType.toLowerCase().includes(type)));
            return typeMatch;
        });
    } else {
        pokemonFiltrato = pokemon;
    }
    while (pokedexDiv.firstChild) {
        pokedexDiv.removeChild(pokedexDiv.firstChild);
    }

    generateCard(pokemonFiltrato);
});

// RICERCA POKÉMON CON I BOTTONI
const typeButtons = document.querySelectorAll('.type-btn');
let selectedType = null; // Tipo selezionato

typeButtons.forEach(button => {
    button.addEventListener('click', function () {
        const type = button.dataset.type.toLowerCase();

        if (selectedType === type) {
            selectedType = null; // Annulla la ricerca
            button.classList.remove('active'); // Rimuovi la classe 'active' dal pulsante
        } else {
            selectedType = type;
            typeButtons.forEach(btn => {
                if (btn.dataset.type.toLowerCase() !== selectedType) {
                    btn.classList.remove('active'); // Rimuovi la classe 'active' dagli altri pulsanti
                }
            });
            button.classList.add('active'); // Aggiungi la classe 'active' al pulsante corrente
        }

        let pokemonFiltrato = [];

        if (selectedType) {
            pokemonFiltrato = pokemon.filter(pokemon => pokemon.type.some(pokemonType => pokemonType.toLowerCase().includes(selectedType)));
        } else {
            pokemonFiltrato = pokemon;
        }

        while (pokedexDiv.firstChild) {
            pokedexDiv.removeChild(pokedexDiv.firstChild);
        }

        generateCard(pokemonFiltrato);
    });
});




