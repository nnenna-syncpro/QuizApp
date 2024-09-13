const API_URL = `https://opentdb.com/api.php`;

const questionEl = document.querySelector(".question");
const optionsEl = document.querySelector(".options-container");
const totalQuestionsEl = document.querySelector(".total-questions");
const questionNumberEl = document.querySelector(".question-number");
const categoryEl = document.querySelector(".category");

const state = {
  quizQuestions: [],
  questionCount: 0,
  previousAnswers: [],
  point: 0,
  selectedOption: "",
};

let score = document.querySelector(".score");
let correctAnswer = "";

const nextButtonEl = document.querySelector(".next-btn");

const submitButtonEl = document.querySelector(".submit-btn");
const endGameEl = document.querySelector(".end-game-container");
const displayScoreEl = document.querySelector(".display-score");
const quizContainerEl = document.querySelector(".quiz-container");

const playAgainButtonEl = document.querySelector(".play-again-btn");

const startQuizButtonEl = document.querySelector(".start-quiz-btn");
const startGameEl = document.querySelector(".start-game-container");
const selectNumberEl = document.querySelector(".number-of-questions");
const selectCategoryEl = document.querySelector(".select-category");
const selectDifficultyEl = document.querySelector(".difficulty-level");

const numberErrorEl = document.querySelector(".error-number");
const optionErrorEl = document.querySelector(".error-option");

const previousButtonEl = document.querySelector(".prev-btn");

const spinLoaderEl = document.querySelector(".spin-loader");

document.addEventListener("DOMContentLoaded", () => {
  spinLoaderEl.classList.add("hide");
  startGameEl.classList.remove("hide");
});

// window.addEventListener("load", () => {
//   spinLoaderEl.classList.add("hide");
//   startGameEl.classList.remove("hide");
// });

const startQuiz = () => {
  let errorMessages = [];
  if (
    selectNumberEl.value === "" ||
    selectNumberEl.value === null ||
    selectNumberEl.value <= 0 ||
    selectNumberEl.value > 50
  ) {
    errorMessages.push("A number between 1 and 50 is required!");
    console.log("A number between 1 and 50 is required");
  }
  if (errorMessages.length > 0) {
    numberErrorEl.innerHTML = errorMessages.join(`<br>`);
  } else {
    const amount = selectNumberEl.value;
    const category = selectCategoryEl.value;
    const difficulty = selectDifficultyEl.value;
    getQuestions(
      `${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    startGameEl.classList.add("hide");
    spinLoaderEl.classList.remove("hide");
  }
};

startQuizButtonEl.addEventListener("click", startQuiz);

const getQuestions = async (triviaUrl) => {
  try {
    const response = await fetch(triviaUrl);
    const data = await response.json();
    state.quizQuestions = data.results;
    console.log(state.quizQuestions);
    displayQuestion(state.quizQuestions[0]);
    state.questionCount = 1;
    spinLoaderEl.classList.add("hide");
    quizContainerEl.classList.remove("hide");
  } catch (error) {
    console.log("Error: " + error);
  }
};

async function displayQuestion(question) {
  totalQuestionsEl.innerHTML = `${state.quizQuestions.length}`;

  //display question
  questionEl.innerHTML = question.question;
  //display question number
  questionNumberEl.innerHTML = `${state.quizQuestions.indexOf(question) + 1}/`;
  //display question category
  categoryEl.innerHTML = question.category;

  correctAnswer = question.correct_answer;
  console.log(correctAnswer);
  let incorrectAnswers = question.incorrect_answers;
  let options = [...incorrectAnswers];
  //get a random index between 0 and 3. Then insert the correct answer at a random index
  options.splice(
    Math.floor(Math.random() * incorrectAnswers.length + 1),
    0,
    correctAnswer
  );

  //display answer choices
  optionsEl.innerHTML = options
    .map((option, index) => `<button class="option">${option}</button>`)
    .join("");

  selectOption();
}

function selectOption() {
  optionsEl.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", () => {
      //remove previously selected class before adding new selected class
      if (optionsEl.querySelector(".selected")) {
        optionsEl.querySelector(".selected").classList.remove("selected");
      }
      //add selected class to the option that was clicked
      option.classList.add("selected");

      //get value of the answer option selected
      state.selectedOption = optionsEl.querySelector(".selected").textContent;

      if (state.selectedOption) {
        optionErrorEl.innerHTML = "";
      }
      //indicate right or wrong answer
      if (state.selectedOption === decodeHTML(correctAnswer)) {
        option.classList.add("correct");
        state.point++;
        score.innerHTML = state.point;
      } else {
        option.classList.add("wrong");
      }

      state.previousAnswers.push(state.selectedOption);
      console.log(state.previousAnswers);

      //show right answer if wrong answer is selected
      Array.from(optionsEl.querySelectorAll("button")).forEach((button) => {
        if (button.textContent === decodeHTML(correctAnswer)) {
          button.classList.add("correct");
        }
        //disbale buttons to prevent selecting more than one option
        button.disabled = true;
      });
    });
  });
}

function decodeHTML(text) {
  let parsed = new DOMParser().parseFromString(text, "text/html");
  return parsed.documentElement.textContent;
}

function handleNextButton() {
  let errorMessages = [];
  if (!state.selectedOption) {
    errorMessages.push("Please select an option!");
    console.log("Please select an option!");
  }
  if (errorMessages.length > 0) {
    optionErrorEl.innerHTML = errorMessages.join(`<br>`);
  } else {
    optionErrorEl.innerHTML = "";
    state.selectedOption = "";
    if (state.questionCount < +totalQuestionsEl.textContent) {
      state.questionCount++;
      console.log(state.questionCount);
      setTimeout(() => {
        displayQuestion(state.quizQuestions[state.questionCount - 1]);
      }, 500);
    } else {
      nextButtonEl.classList.add("hide");
      submitButtonEl.classList.add("show");
    }
    if (state.questionCount > 1) {
      previousButtonEl.classList.add("show");
      previousButtonEl.classList.remove("hide");
    }
  }
}

nextButtonEl.addEventListener("click", handleNextButton);

function handlePreviousButton() {
  if (
    state.questionCount >= 1 ||
    state.questionCount < +totalQuestionsEl.textContent
  ) {
    state.questionCount--;
    console.log(state.questionCount);
    setTimeout(() => {
      displayQuestion(state.quizQuestions[state.questionCount - 1]);
    }, 500);
    console.log(state.previousAnswers[state.questionCount - 1]);
  }

  if (state.questionCount === 1) {
    previousButtonEl.classList.remove("show");
    previousButtonEl.classList.add("hide");
  }
}
previousButtonEl.addEventListener("click", handlePreviousButton);

function handleSubmitButton() {
  quizContainerEl.classList.add("hide");
  endGameEl.classList.remove("hide");
  displayScoreEl.innerHTML = `
     <p class="display-score">You scored ${score.textContent} out of ${totalQuestionsEl.textContent}.</p>
      `;
}

submitButtonEl.addEventListener("click", handleSubmitButton);

function handlePlayAgainButton() {
  window.location.reload();
}

playAgainButtonEl.addEventListener("click", handlePlayAgainButton);
