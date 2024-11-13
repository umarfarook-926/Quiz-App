import { Component } from "react";
import Header from "./components/Header";
import questionsData from "./components/question";
import "./App.css";

class App extends Component {
  state = {
    questionsData: questionsData.sort(() => Math.random() - 0.5),
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    highScore: parseInt(localStorage.getItem("highScore")) || 0,
    timerSec: 10,
    quizStatus: "Running",
  };

  nextQuestion = () => {
    const { currentQuestionIndex, score, highScore } = this.state;

    if (currentQuestionIndex < this.state.questionsData.length - 1) {
      this.setState((prevState) => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        timerSec: 10,
      }));
    } else {
      this.setState({
        showResults: true,
        quizStatus: "Quiz End",
      });
      clearInterval(this.intervalId);
    }
  };

  handleUserSelection = (option) => {
    const { currentQuestionIndex, questionsData } = this.state;

    if (option === questionsData[currentQuestionIndex].correctAnswer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));
    }
    this.nextQuestion();
  };

  incrementTimer = () => {
    const { timerSec, currentQuestionIndex, questionsData } = this.state;

    if (timerSec > 0) {
      this.setState((prevState) => ({
        timerSec: prevState.timerSec - 1,
      }));
    } else if (currentQuestionIndex < questionsData.length - 1) {
      this.nextQuestion();
    } else {
      clearInterval(this.intervalId);
      this.setState({ showResults: true, quizStatus: "Quiz End" });
    }
  };

  startQuiz = () => {
    this.intervalId = setInterval(this.incrementTimer, 1000);
  };

  componentDidMount() {
    this.startQuiz();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showResults && this.state.score > this.state.highScore) {
      const newHighScore = this.state.score;
      localStorage.setItem("highScore", newHighScore);
      this.setState({ highScore: newHighScore });
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  restartQuiz = () => {
    this.setState({
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      timerSec: 10,
      highScore: parseInt(localStorage.getItem("highScore")) || 0,
      questionsData: questionsData.sort(() => Math.random() - 0.5),
      quizStatus: "Running",
    });
    this.startQuiz();
  };

  render() {
    const {
      questionsData,
      currentQuestionIndex,
      score,
      highScore,
      showResults,
      timerSec,
    } = this.state;
    const feedback = score > 3 ? "Well done!" : "Try again";

    return (
      <div className="app-container">
        <Header timerDetails={{ timerSec: this.state.timerSec }} />
        <div className="quiz-app-container">
          {showResults ? (
            <div className="score-section">
              <h2 className="result">Quiz Results</h2>
              <h2 className="your-score scrolling-text">
                Your Score : {score}/{questionsData.length}
              </h2>
              <p className="high-score">High Score: {highScore}</p>
              <p className="feedback scrolling-text">{feedback}</p>
              <button className="restart-btn" onClick={this.restartQuiz}>
                Restart Quiz
              </button>
            </div>
          ) : (
            <div className="questionContainer">
              <h2 className="q-number">
                Question: {currentQuestionIndex + 1}/{questionsData.length}
              </h2>
              <h2 className="question">
                {currentQuestionIndex + 1}.{" "}
                {questionsData[currentQuestionIndex].question}
              </h2>
              <div className="option-container">
                {questionsData[currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      onClick={() => this.handleUserSelection(option)}
                      className="option"
                      key={index}
                      type="button"
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
