const API_URL = `https://opentdb.com/api.php`;

const questionEl = document.querySelector(".question");
const optionsEl = document.querySelector(".options-container");
const totalQuestionsEl = document.querySelector(".total-questions");
const questionNumberEl = document.querySelector(".question-number");
const categoryEl = document.querySelector(".category");

let quizQuestions = [];
let score = document.querySelector(".score");
let point = 0;
let correctAnswer = "";

const nextButtonEl = document.querySelector(".next-btn");
let questionCount = 0;

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

const startQuiz = () => {
  const amount = selectNumberEl.value;
  const category = selectCategoryEl.value;
  const difficulty = selectDifficultyEl.value;
  getQuestions(
    `${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
  );
  startGameEl.classList.add("hide");
  quizContainerEl.classList.remove("hide");
};

startQuizButtonEl.addEventListener("click", startQuiz);

const getQuestions = async (triviaUrl) => {
  try {
    const response = await fetch(triviaUrl);
    const data = await response.json();
    quizQuestions = data.results;
    console.log(quizQuestions);
    displayQuestion(quizQuestions[0]);
    questionCount = 1;
  } catch (error) {
    console.log("Error: " + error);
  }
};

async function displayQuestion(question) {
  totalQuestionsEl.innerHTML = `${quizQuestions.length}`;

  //display question
  questionEl.innerHTML = question.question;
  //display question number
  questionNumberEl.innerHTML = `${quizQuestions.indexOf(question) + 1}/`;
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
      let selectedOption = optionsEl.querySelector(".selected").textContent;

      //indicate right or wrong answer
      if (selectedOption === correctAnswer) {
        option.classList.add("correct");
        point++;
        score.innerHTML = point;
      } else {
        option.classList.add("wrong");
      }

      //show right answer if wrong answer is selected
      Array.from(optionsEl.querySelectorAll("button")).forEach((button) => {
        if (button.textContent === correctAnswer) {
          button.classList.add("correct");
        }
        //disbale buttons to prevent selecting more than one option
        button.disabled = true;
      });
    });
  });
}

function handleNextButton() {
  if (questionCount < +totalQuestionsEl.textContent) {
    questionCount++;
    setTimeout(() => {
      displayQuestion(quizQuestions[questionCount - 1]);
    }, 500);
  } else {
    nextButtonEl.classList.add("hide");
    submitButtonEl.classList.add("show");
  }
}

nextButtonEl.addEventListener("click", handleNextButton);

function handleSubmitButton() {
  quizContainerEl.classList.add("hide");
  endGameEl.classList.remove("hide");
  displayScoreEl.innerHTML = `
     <p class="display-score">You scored ${score.textContent} out of ${totalQuestionsEl.textContent}.</p>
      `;
}

submitButtonEl.addEventListener("click", handleSubmitButton);

function handlePlayAgainButton() {
  getQuestions(API_URL);
  quizContainerEl.classList.remove("hide");
  endGameEl.classList.add("hide");
  score.innerHTML = "0";
  point = 0;
  questionCount = 0;
  nextButtonEl.classList.add("show");
  nextButtonEl.classList.remove("hide");
  submitButtonEl.classList.remove("show");
  submitButtonEl.classList.add("hide");
}

playAgainButtonEl.addEventListener("click", handlePlayAgainButton);
