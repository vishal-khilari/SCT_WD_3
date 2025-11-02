import React, { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const QuizGame = () => {
  const [gameState, setGameState] = useState("welcome"); // welcome, playing, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(15);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const quizData = [
    {
      type: "multiple-choice",
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: "Paris",
      points: 10,
    },
    {
      type: "multiple-select",
      question: "Which of these are programming languages?",
      options: ["Python", "HTML", "JavaScript", "CSS"],
      correct: ["Python", "JavaScript"],
      points: 15,
    },
    {
      type: "fill-blank",
      question:
        "The process of converting code into machine language is called _____.",
      correct: "compilation",
      alternatives: ["compiling", "compile"],
      points: 10,
    },
    {
      type: "multiple-choice",
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Core Processing Unit",
      ],
      correct: "Central Processing Unit",
      points: 10,
    },
    {
      type: "multiple-select",
      question: "Select all web browsers from the list:",
      options: ["Chrome", "Excel", "Firefox", "PowerPoint", "Safari"],
      correct: ["Chrome", "Firefox", "Safari"],
      points: 15,
    },
    {
      type: "fill-blank",
      question: "React is a JavaScript _____ for building user interfaces.",
      correct: "library",
      alternatives: ["framework"],
      points: 10,
    },
  ];

  useEffect(() => {
    if (gameState === "playing" && !showFeedback) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        handleTimeout();
      }
    }
  }, [timeLeft, gameState, showFeedback]);

  const handleTimeout = () => {
    if (answeredQuestions[currentQuestion]) return;
    setShowFeedback(true);
    setIsCorrect(false);
    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: { correct: false, submitted: true },
    });
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleSkip = () => {
    if (showFeedback) return;
    moveToNextQuestion();
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion === 0) return;
    setCurrentQuestion(currentQuestion - 1);
    setTimeLeft(15);
    setShowFeedback(false);
  };

  const goToNextQuestion = () => {
    if (currentQuestion >= quizData.length - 1) {
      setGameState("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
      setShowFeedback(false);
    }
  };

  useEffect(() => {
    // Check if current question was already answered
    if (answeredQuestions[currentQuestion]) {
      setShowFeedback(true);
      setIsCorrect(answeredQuestions[currentQuestion].correct);
    }
  }, [currentQuestion, answeredQuestions]);

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setAnswers({});
    setAnsweredQuestions({});
    setTimeLeft(15);
    setShowFeedback(false);
  };

  const handleMultipleChoice = (option) => {
    if (showFeedback || answeredQuestions[currentQuestion]) return;

    const question = quizData[currentQuestion];
    const correct = option === question.correct;

    setAnswers({ ...answers, [currentQuestion]: option });
    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: { correct, submitted: true },
    });
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + question.points);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleMultipleSelect = (option) => {
    if (showFeedback || answeredQuestions[currentQuestion]) return;

    const currentAnswers = answers[currentQuestion] || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a) => a !== option)
      : [...currentAnswers, option];

    setAnswers({ ...answers, [currentQuestion]: newAnswers });
  };

  const submitMultipleSelect = () => {
    if (showFeedback || answeredQuestions[currentQuestion]) return;

    const question = quizData[currentQuestion];
    const userAnswers = answers[currentQuestion] || [];
    const correct =
      userAnswers.length === question.correct.length &&
      userAnswers.every((a) => question.correct.includes(a));

    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: { correct, submitted: true },
    });
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + question.points);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleFillBlank = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const submitFillBlank = () => {
    if (showFeedback || answeredQuestions[currentQuestion]) return;

    const question = quizData[currentQuestion];
    const userAnswer = (answers[currentQuestion] || "").toLowerCase().trim();
    const correctAnswers = [
      question.correct,
      ...(question.alternatives || []),
    ].map((a) => a.toLowerCase());
    const correct = correctAnswers.includes(userAnswer);

    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: { correct, submitted: true },
    });
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + question.points);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    setShowFeedback(false);
    setTimeLeft(15);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameState("results");
    }
  };

  const totalPoints = quizData.reduce((sum, q) => sum + q.points, 0);
  const percentage = Math.round((score / totalPoints) * 100);

  if (gameState === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="mb-8">
            <Trophy className="w-20 h-20 mx-auto text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Quiz Application
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Test your knowledge with interactive questions
          </p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quiz Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Multiple Choice</p>
                  <p className="text-sm text-gray-600">Single answer</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Multi-Select</p>
                  <p className="text-sm text-gray-600">Multiple answers</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Fill in Blanks</p>
                  <p className="text-sm text-gray-600">Type answer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <p className="text-gray-700">📝 {quizData.length} Questions</p>
            <p className="text-gray-700">⏱️ 15 seconds per question</p>
            <p className="text-gray-700">🏆 Total Points: {totalPoints}</p>
          </div>

          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "results") {
    let performance = "";
    let colorClass = "";

    if (percentage >= 80) {
      performance = "Excellent Performance";
      colorClass = "text-green-600";
    } else if (percentage >= 60) {
      performance = "Good Performance";
      colorClass = "text-blue-600";
    } else if (percentage >= 40) {
      performance = "Fair Performance";
      colorClass = "text-yellow-600";
    } else {
      performance = "Needs Improvement";
      colorClass = "text-red-600";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="mb-6">
            <Trophy className="w-24 h-24 mx-auto text-blue-600" />
          </div>

          <h1 className={`text-3xl font-bold mb-6 ${colorClass}`}>
            {performance}
          </h1>

          <div className="bg-slate-50 rounded-xl p-8 mb-8">
            <p className="text-gray-600 text-base mb-2">Final Score</p>
            <p className="text-5xl font-bold text-gray-900 mb-4">
              {score}/{totalPoints}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-xl font-semibold text-gray-700">{percentage}%</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-700">
                  {
                    Object.keys(answers).filter((key) => {
                      const q = quizData[key];
                      const ans = answers[key];
                      if (q.type === "multiple-choice")
                        return ans === q.correct;
                      if (q.type === "multiple-select") {
                        return (
                          ans &&
                          ans.length === q.correct.length &&
                          ans.every((a) => q.correct.includes(a))
                        );
                      }
                      if (q.type === "fill-blank") {
                        const correctAnswers = [
                          q.correct,
                          ...(q.alternatives || []),
                        ].map((a) => a.toLowerCase());
                        return correctAnswers.includes(
                          (ans || "").toLowerCase().trim()
                        );
                      }
                      return false;
                    }).length
                  }
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Incorrect</p>
                <p className="text-2xl font-bold text-red-700">
                  {quizData.length -
                    Object.keys(answers).filter((key) => {
                      const q = quizData[key];
                      const ans = answers[key];
                      if (q.type === "multiple-choice")
                        return ans === q.correct;
                      if (q.type === "multiple-select") {
                        return (
                          ans &&
                          ans.length === q.correct.length &&
                          ans.every((a) => q.correct.includes(a))
                        );
                      }
                      if (q.type === "fill-blank") {
                        const correctAnswers = [
                          q.correct,
                          ...(q.alternatives || []),
                        ].map((a) => a.toLowerCase());
                        return correctAnswers.includes(
                          (ans || "").toLowerCase().trim()
                        );
                      }
                      return false;
                    }).length}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              {score} pts
            </span>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              Question {currentQuestion + 1} of {quizData.length}
            </p>
            <div className="flex space-x-1">
              {quizData.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-8 rounded-full ${
                    idx < currentQuestion
                      ? "bg-green-500"
                      : idx === currentQuestion
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center space-x-2 ${
              timeLeft <= 5 ? "text-red-600" : ""
            }`}
          >
            <Clock className={`w-5 h-5`} />
            <span className={`text-xl font-semibold`}>{timeLeft}s</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-semibold mb-3">
            {question.type === "multiple-choice" && "MULTIPLE CHOICE"}
            {question.type === "multiple-select" && "MULTI-SELECT"}
            {question.type === "fill-blank" && "FILL IN THE BLANK"}
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {question.question}
          </h2>
          <p className="text-sm text-gray-600">{question.points} points</p>
        </div>

        {showFeedback && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
              isCorrect
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-700">
                    Correct!{" "}
                    {answeredQuestions[currentQuestion]?.submitted
                      ? `+${question.points} points`
                      : "(Already answered)"}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-red-700">
                      Incorrect
                    </span>
                    {question.type === "fill-blank" && (
                      <p className="text-sm text-red-600 mt-1">
                        Correct answer:{" "}
                        <span className="font-semibold">
                          {question.correct}
                        </span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {question.type === "multiple-choice" && (
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isAnswered = answeredQuestions[currentQuestion]?.submitted;
              return (
                <button
                  key={idx}
                  onClick={() => handleMultipleChoice(option)}
                  disabled={showFeedback || isAnswered}
                  className={`w-full p-4 rounded-lg text-left font-medium transition-all duration-200 ${
                    showFeedback || isAnswered
                      ? option === question.correct
                        ? "bg-green-500 text-white border-2 border-green-600"
                        : answers[currentQuestion] === option
                        ? "bg-red-500 text-white border-2 border-red-600"
                        : "bg-gray-50 text-gray-400 border border-gray-200"
                      : "bg-white text-gray-900 hover:bg-blue-50 border border-gray-200 hover:border-blue-600"
                  }`}
                >
                  <span className="text-base">
                    {String.fromCharCode(65 + idx)}. {option}
                  </span>
                </button>
              );
            })}
            {!showFeedback && !answeredQuestions[currentQuestion] && (
              <div className="flex gap-2 mt-4">
                {currentQuestion > 0 && (
                  <button
                    onClick={goToPreviousQuestion}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Skip Question
                </button>
              </div>
            )}
            {(showFeedback || answeredQuestions[currentQuestion]) && (
              <div className="flex gap-2 mt-4">
                {currentQuestion > 0 && (
                  <button
                    onClick={goToPreviousQuestion}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}
                {currentQuestion < quizData.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setGameState("results")}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Results
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {question.type === "multiple-select" && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Select all correct answers
            </p>
            <div className="space-y-3 mb-4">
              {question.options.map((option, idx) => {
                const isSelected = (answers[currentQuestion] || []).includes(
                  option
                );
                const isCorrectOption = question.correct.includes(option);
                const isAnswered =
                  answeredQuestions[currentQuestion]?.submitted;

                return (
                  <button
                    key={idx}
                    onClick={() => handleMultipleSelect(option)}
                    disabled={showFeedback || isAnswered}
                    className={`w-full p-4 rounded-lg text-left font-medium transition-all duration-200 ${
                      showFeedback || isAnswered
                        ? isCorrectOption
                          ? "bg-green-500 text-white border-2 border-green-600"
                          : isSelected
                          ? "bg-red-500 text-white border-2 border-red-600"
                          : "bg-gray-50 text-gray-400 border border-gray-200"
                        : isSelected
                        ? "bg-blue-600 text-white border-2 border-blue-700"
                        : "bg-white text-gray-900 hover:bg-blue-50 border border-gray-200 hover:border-blue-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">
                        {String.fromCharCode(65 + idx)}. {option}
                      </span>
                      {isSelected && !showFeedback && !isAnswered && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      {(showFeedback || isAnswered) && isCorrectOption && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {!showFeedback && !answeredQuestions[currentQuestion] && (
              <div className="space-y-2">
                <button
                  onClick={submitMultipleSelect}
                  disabled={(answers[currentQuestion] || []).length === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Submit Answer
                </button>
                <div className="flex gap-2">
                  {currentQuestion > 0 && (
                    <button
                      onClick={goToPreviousQuestion}
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                  )}
                  <button
                    onClick={handleSkip}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Skip Question
                  </button>
                </div>
              </div>
            )}
            {(showFeedback || answeredQuestions[currentQuestion]) && (
              <div className="flex gap-2">
                {currentQuestion > 0 && (
                  <button
                    onClick={goToPreviousQuestion}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}
                {currentQuestion < quizData.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setGameState("results")}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Results
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {question.type === "fill-blank" && (
          <>
            <input
              type="text"
              value={answers[currentQuestion] || ""}
              onChange={(e) => handleFillBlank(e.target.value)}
              disabled={showFeedback || answeredQuestions[currentQuestion]}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-base mb-4 focus:border-blue-600 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
            />
            {!showFeedback && !answeredQuestions[currentQuestion] && (
              <div className="space-y-2">
                <button
                  onClick={submitFillBlank}
                  disabled={
                    !answers[currentQuestion] ||
                    answers[currentQuestion].trim() === ""
                  }
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Submit Answer
                </button>
                <div className="flex gap-2">
                  {currentQuestion > 0 && (
                    <button
                      onClick={goToPreviousQuestion}
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                  )}
                  <button
                    onClick={handleSkip}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Skip Question
                  </button>
                </div>
              </div>
            )}
            {(showFeedback || answeredQuestions[currentQuestion]) && (
              <div className="flex gap-2">
                {currentQuestion > 0 && (
                  <button
                    onClick={goToPreviousQuestion}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}
                {currentQuestion < quizData.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setGameState("results")}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Results
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
