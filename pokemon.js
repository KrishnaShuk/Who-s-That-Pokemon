

const guessForm = document.getElementById('guess-form');
const pokemonGuessInput = document.getElementById('pokemon-guess');
const resultParagraph = document.getElementById('result');
const pokemonGrid = document.getElementById('image-grid');
const numberOfPokemon = 4;

let selectedPokemonId = null;
let score = 0;
let guessedPokemonCount = 0;

async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.sprites.other['official-artwork'].front_default,
      type: data.types.map(type => type.type.name).join(', '),
      abilities: data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', '),
      };
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    throw error;
  }
}

function getRandomPokemonIds(count) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * 1010) + 1);
  }
  return Array.from(ids);
}

async function displayRandomPokemon() {
  // Check if Pokémon data already exists in localStorage
  const storedPokemonData = localStorage.getItem('pokemonData');
  if (storedPokemonData) {
    const pokemonDataArray = JSON.parse(storedPokemonData);
    renderPokemonImages(pokemonDataArray);
  } else {
    const pokemonIds = getRandomPokemonIds(numberOfPokemon);
    try {
      const pokemonDataPromises = pokemonIds.map(fetchPokemonData);
      const pokemonDataArray = await Promise.all(pokemonDataPromises);

      // Store the data in localStorage
      localStorage.setItem('pokemonData', JSON.stringify(pokemonDataArray));

      renderPokemonImages(pokemonDataArray);
    } catch (error) {
      resultParagraph.textContent = "Failed to load Pokémon. Please refresh the page.";
      resultParagraph.style.color = "red";
    }
  }
}

function renderPokemonImages(pokemonDataArray) {
  pokemonGrid.innerHTML = ''; // Clear previous Pokémon images

  pokemonDataArray.forEach(pokemonData => {
      const imgElement = document.createElement('img');
      imgElement.src = pokemonData.imageUrl;
      imgElement.alt = `Silhouette of ${pokemonData.name}`;
      imgElement.classList.add('silhouette');
      imgElement.dataset.id = pokemonData.id;

      // Dynamically generate the cry URL using Pokémon name
      const audioElement = document.createElement('audio');
      audioElement.src = `https://play.pokemonshowdown.com/audio/cries/${pokemonData.name.toLowerCase()}.mp3`; // Fetch from Pokémon Showdown
      audioElement.preload = 'auto'; // Preload audio

      imgElement.addEventListener('click', function() {
          if (selectedPokemonId === pokemonData.id) return;

          document.querySelectorAll('.enlarged').forEach(el => el.classList.remove('enlarged'));
          document.querySelectorAll('.revealed').forEach(el => el.classList.add('silhouette'));

          imgElement.classList.remove('silhouette');
          imgElement.classList.add('revealed', 'enlarged');
          selectedPokemonId = pokemonData.id;

          // Play the Pokémon cry sound
          audioElement.play();
      });

      // Append both image and audio element to the grid
      pokemonGrid.appendChild(imgElement);
  });
}



guessForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const userGuess = pokemonGuessInput.value.trim().toLowerCase();

  if (selectedPokemonId === null) {
    resultParagraph.textContent = "Please click on an image to select a Pokémon.";
    resultParagraph.style.color = "orange";
    return;
  }

  try {
    const pokemonData = await fetchPokemonData(selectedPokemonId);
    const correct = userGuess === pokemonData.name.toLowerCase();

    const pokemonDetails = {
      ...pokemonData,
      correct: correct,
    };

    // Store the selected Pokémon in localStorage
    localStorage.setItem('selectedPokemon', JSON.stringify(pokemonDetails));

    // Redirect to the details page
    window.location.href = 'pokemon-details.html';
  } catch (error) {
    console.error("Error processing guess:", error);
    resultParagraph.textContent = "There was an error. Please try again.";
    resultParagraph.style.color = "red";
  }

  pokemonGuessInput.value = '';
});

// Load Pokémon on page load
displayRandomPokemon();

document.getElementById('refresh-button').addEventListener('click', function() {
  localStorage.removeItem('pokemonData');  // Clear Pokémon data
  displayRandomPokemon();  // Fetch new set of Pokémon
});
