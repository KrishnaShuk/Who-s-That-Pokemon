document.addEventListener('DOMContentLoaded', function() {
  // Retrieve the Pokémon details from localStorage
  const pokemonDetails = JSON.parse(localStorage.getItem('selectedPokemon'));
  
  // Check if data is available, otherwise handle error
  if (!pokemonDetails) {
      document.getElementById('pokemon-name').textContent = 'No Pokémon data available!';
      return;
  }
  
  // Display Pokémon details
  document.getElementById('pokemon-name').textContent = `${pokemonDetails.name.toUpperCase()}`;
  document.getElementById('pokemon-image').src = pokemonDetails.imageUrl;
  document.getElementById('pokemon-type').textContent = `Type: ${pokemonDetails.type.toUpperCase() || 'Unknown'}`;
  document.getElementById('pokemon-abilities').textContent = `Abilities: ${pokemonDetails.abilities.toUpperCase()}`;
  document.getElementById('pokemon-description').textContent = `Description: ${pokemonDetails.description || 'No description available'}`;
  document.getElementById('guess-result').textContent = pokemonDetails.correct ? 'Correct Guess!' : 'Incorrect Guess!';
  
  // Back button logic
  document.getElementById('back-button').addEventListener('click', function() {
      window.location.href = 'index.html'; // Navigate back to main page
  });
});
  
  


  