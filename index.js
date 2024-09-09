const API_URL = `https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`;

const questionEl = document.querySelector(".question");
const optionsEl = document.querySelector(".options-container");
const totalQuestionsEl = document.querySelector(".total-questions");
const questionNumberEl = document.querySelector(".question-number");
const categoryEl = document.querySelector(".category");

let quizQuestions = [];

const getQuestions = async (triviaUrl) => {
  try {
    const response = await fetch(triviaUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log("Error: " + error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  displayQuestion();
});

async function displayQuestion() {
  quizQuestions = await getQuestions(API_URL);
  console.log(quizQuestions);

  totalQuestionsEl.innerHTML = `${quizQuestions.length}`;

  quizQuestions.slice(0, 1).forEach((question, index) => {
    console.log(question.question);
    //display question
    questionEl.innerHTML = question.question;
    //display question number
    questionNumberEl.innerHTML = `${index + 1}/`;
    //display question category
    categoryEl.innerHTML = question.category;

    let correctAnswer = question.correct_answer;
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
  });
}
