import React from "react";
import initialData from "./InitialData.js";
import encryptedQuote from "./encryptedQuote.js";
import "./styles.css";

class App extends React.Component {
  // state = { encrypted: "", keyArray: { KeyData } };
  state = initialData;

  updateMessage = (event) => {
    var inputString = event.target.value;
    this.setState({ encrypted: inputString });
  };

  userQuote = () => {
    // Make the text in the message box go away and
  };

  clearKeys = () => {
    var emptyKeys = this.state.keyArray.map(() => "");
    this.setState({ keyArray: emptyKeys });
  };

  loadQuote = () => {
    var quote = encryptedQuote();
    this.setState({ encrypted: quote });
    // Make sure the key array is empty for the new quote.
    this.clearKeys();
    this.renderSolution();
  };

  getKeyLetterIndex = (letter) => {
    var uLetter = letter.toUpperCase(); // Should be but just to be safe.
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet.indexOf(uLetter);
  };

  getSolutionLetter = (letter) => {
    var keyArrayIndex = this.getKeyLetterIndex(letter);
    return this.state.keyArray[keyArrayIndex];
  };

  setSolutionLetter = (event) => {
    var solutionLetter = event.target.value;
    console.log("Input letter: " + solutionLetter);
    var index = event.target.id;
    console.log("Index: " + index);
    // Update the key array and refresh.
    var keyLetter = this.state.encrypted[index];
    var keyArrayIndex = this.getKeyLetterIndex(keyLetter);
    console.log("KeyArrayIndex: " + keyArrayIndex);
    if (keyArrayIndex === -1) return; // Designed to not happen, but just in case...
    var copiedKeyArray = this.state.keyArray;
    copiedKeyArray[keyArrayIndex] = solutionLetter;
    this.setState({ keyArray: copiedKeyArray });
    this.renderSolution();
  };

  renderLetterEntry = (letter, index) => {
    var solutionLetter = this.getSolutionLetter(letter);
    // This works for both letters and empty strings.
    return (
      <input
        className="LetterEntry"
        type="text"
        maxLength="1"
        id={index}
        value={solutionLetter}
        placeholder={solutionLetter}
        onChange={this.setSolutionLetter}
      />
    );
  };

  convertChar = (letter, index) => {
    // Return a div that has a space on top and the letter below.
    var uLetter = letter.toUpperCase();
    var top, bottom;
    if (uLetter < "A" || uLetter > "Z") {
      // Space or punctuation
      top = <div className="Punctuation">{uLetter}</div>;
      bottom = <div className="CodedLetter">&nbsp;</div>;
    } else {
      top = this.renderLetterEntry(letter, index);
      bottom = <div className="CodedLetter">{uLetter}</div>;
    }
    return (
      <div className="LetterSpace">
        {top}
        {bottom}
      </div>
    );
  };

  renderLetters = () => {
    var wordAsLetters = this.state.encrypted.split("");
    return wordAsLetters.map(this.convertChar);
  };

  renderSolution = () => {
    // Render all the letters at once!!!!
    // Rendered letters include a guess input box above each A-Z,
    // And the index must be the position of the letter in the entire string.
    var renderedChars = this.renderLetters();
    var phraseAsWords = this.state.encrypted.split(" ");
    var renderedWords = [];
    var startIndex = 0;
    for (var i = 0; i < phraseAsWords.length; i++) {
      var nThisWord = phraseAsWords[i].length;
      var convertedWord = renderedChars.slice(
        startIndex,
        startIndex + nThisWord
      );
      renderedWords.push(<div className="EncryptedWord">{convertedWord}</div>);
      startIndex += nThisWord + 1;
    }
    return <div className="MainEncrypted">{renderedWords}</div>;
  };

  renderLetterCount = () => {
    var encryptedUpperCase = this.state.encrypted.toUpperCase();
    var lc = []; // letterCountArray
    for (var i = 0; i < encryptedUpperCase.length; i++) {
      var letter = encryptedUpperCase[i];
      if (letter >= "A" && letter <= "Z") {
        lc.push(letter);
      }
    }
    lc.sort(); // Sort A to Z
    var lettersAndCounts = [];
    for (var i = 0; i < lc.length; i++) {
      var j = i;
      while (j < lc.length - 1 && lc[j] === lc[j + 1]) {
        j++; // count how many of this letter there are.
      }
      var letterCountString = lc[i] + ": " + (j - i + 1) + " ";
      lettersAndCounts.push(<div className="OneLC">{letterCountString}</div>);
      i = j;
    }
    return lettersAndCounts;
  };

  ResetButton = () => {
    if (this.state.encrypted === "") return;
    return (
      <button className="ResetButton" onClick={this.clearKeys}>
        Reset
      </button>
    );
  };

  render() {
    return (
      <div className="App">
        <h1>My Cryptogram Assistant</h1>
        <h2>Enter a cryptogram:</h2>
        <form>
          <fieldset>
            <label>
              <input
                className="InputBox"
                type="text"
                placeholder="Type your own cryptogram..."
                value={this.state.encrypted}
                onChange={this.updateMessage}
              />
            </label>
          </fieldset>
          <button className="SubmitQuote" onClick={this.userQuote}>
            Submit
          </button>
        </form>
        <h3>Or try one from our vault!</h3>
        <button className="QuoteButton" onClick={this.loadQuote}>
          Quote
        </button>
        <p>{this.renderSolution(this.state.encrypted)}</p>
        {this.ResetButton()}
        <div className="RowOfLC">{this.renderLetterCount()}</div>
      </div>
    );
  }
}

export default App;
