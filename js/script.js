const appContainer = document.getElementById("app");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const searchInput = document.getElementById("searchInput");

let currentUrl = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

let nextUrl = null;
let prevUrl = null;

// ======================
// UI
// ======================

const updateLayout = (count) => {
  appContainer.classList.toggle("single", count === 1);
};

// ======================
// LISTADO DE POKÉMON
// ======================

const loadPokemons = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al obtener los Pokémon");
    }

    const data = await response.json();

    nextUrl = data.next;
    prevUrl = data.previous;

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
      }),
    );

    updateLayout(pokemonDetails.length);

    appContainer.innerHTML = pokemonDetails
      .map(
        (pokemon) => `
          <article class="pokemonContainer">
            <img
              src="${pokemon.sprites.other.home.front_default}"
              alt="${pokemon.name}"
              class="pokemonImg"
            />
            <h2 class="pokemonName">${pokemon.name}</h2>
          </article>
        `,
      )
      .join("");
  } catch (error) {
    console.error(error);
  }
};

// ======================
// POKÉMON INDIVIDUAL
// ======================

const getPokemon = async (pokemonName) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`,
    );

    if (!response.ok) {
      throw new Error("No se encontró el Pokémon");
    }
    console.log(response);
    const data = await response.json();
    console.log(data);

    const {
      name,
      sprites: {
        other: {
          home: { front_default },
        },
      },
    } = data;

    updateLayout(1);

    appContainer.innerHTML = `
      <article class="pokemonContainer">
        <img
          src="${front_default}"
          alt="${name}"
          class="pokemonImg"
        />
        <h2 class="pokemonName">${name}</h2>
      </article>
    `;
  } catch (error) {
    console.error(error);
  }
};

// ======================
// BÚSQUEDA
// ======================

const searchPokemon = async () => {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    loadPokemons(currentUrl);
    return;
  }

  getPokemon(searchTerm);
};

// ======================
// EVENTOS
// ======================

nextBtn.addEventListener("click", () => {
  if (nextUrl) {
    currentUrl = nextUrl;
    loadPokemons(nextUrl);
  }
});

prevBtn.addEventListener("click", () => {
  if (prevUrl) {
    currentUrl = prevUrl;
    loadPokemons(prevUrl);
  }
});

// ======================
// CARGA INICIAL
// ======================

loadPokemons(currentUrl);

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", searchPokemon);
