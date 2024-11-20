document.addEventListener("DOMContentLoaded", () => {
  const targetWord = "WHAM"; // The correct word
  const maxAttempts = 6; // Number of allowed guesses
  const guessesContainer = document.getElementById("guesses-container");
  const inputField = document.getElementById("guess-input");
  const submitButton = document.getElementById("submit-button");
  const resultMessage = document.getElementById("result-message");
  const audioElement = document.getElementById("wham-audio"); // Reference to the audio element

  let attempts = 0; // Track the number of guesses

  // Create a row of boxes for each guess
  const createGuessRow = () => {
    const row = document.createElement("div");
    row.className = "guess-row";

    for (let i = 0; i < 4; i++) {
      const box = document.createElement("div");
      box.className = "guess-box";
      row.appendChild(box);
    }

    guessesContainer.appendChild(row);
    return row;
  };

  const checkGuess = (guess) => {
    const feedback = [];
    const targetArray = targetWord.split(""); // Convert targetWord to an array

    // First pass: check for correct letters in the correct positions (green)
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetArray[i]) {
        feedback.push("green");
        targetArray[i] = null; // Mark this letter as used
      } else {
        feedback.push(null); // Placeholder for now
      }
    }

    // Second pass: check for correct letters in the wrong positions (yellow)
    for (let i = 0; i < guess.length; i++) {
      if (feedback[i] === null) {
        const index = targetArray.indexOf(guess[i]);
        if (index !== -1) {
          feedback[i] = "yellow";
          targetArray[index] = null; // Mark this letter as used
        } else {
          feedback[i] = "gray"; // Incorrect letter
        }
      }
    }

    return feedback;
  };

  submitButton.addEventListener("click", () => {
    const guess = inputField.value.toUpperCase().slice(0, 4); // Get the first 4 characters
    if (guess.length < 4) {
      resultMessage.textContent = "Please enter a 4-letter word.";
      return;
    }

    attempts++;

    const row = createGuessRow();
    const feedback = checkGuess(guess);

    // Update the UI with the guess and feedback
    row.childNodes.forEach((box, index) => {
      box.textContent = guess[index];
      box.classList.add(feedback[index]);
    });

    if (guess === targetWord) {
      resultMessage.textContent = "Congratulations! You guessed the word!";
      
      // Attempt to play the audio
      audioElement.play().catch((error) => {
        console.error("Audio playback failed:", error);
        resultMessage.textContent += " (Audio playback failed. Check browser settings.)";
      });

      inputField.disabled = true;
      submitButton.disabled = true;
    } else if (attempts >= maxAttempts) {
      resultMessage.textContent = `Game Over! The word was something else.`;
      inputField.disabled = true;
      submitButton.disabled = true;
    } else {
      resultMessage.textContent = "Try again!";
    }

    inputField.value = ""; // Clear the input field
  });
});
