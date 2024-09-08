const API_URL = `https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`;

const getQuestions = async (triviaUrl) => {
  try {
    const response = await fetch(triviaUrl);
    const data = await response.json();
    console.log(data.results);
    return data.results;
  } catch (error) {
    console.log("Error: " + error);
  }
};
