const API_URL = `https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`;

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

document.addEventListener("DOMContentLoaded", () => {
  getQuestions(API_URL);
});

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
