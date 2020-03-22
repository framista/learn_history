import { events } from './data';

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const startAgainButton = document.querySelector(".result__button");
const stepsButtons = document.querySelectorAll(".step__p");
const stepsBar = document.querySelectorAll(".step");
const taskDiv = document.querySelector(".task");
const questionsDiv = document.querySelectorAll(".question");
const resultDiv = document.querySelector(".result");
const resultElement = document.querySelector(".result__h1");

let currentStep = 0;
const stepsAmount = 5;
const questionAmount = 4;
const questionData = [];

function showQuestion(currentStep) {
    const currentQuestions = questionData.filter(q => q.step === currentStep);
    currentQuestions.sort((q1, q2) => q1.userPosition - q2.userPosition)
    const questionsDiv = document.querySelectorAll(".question");
    currentQuestions.forEach((question, index) => {
        questionsDiv[index].innerHTML = question.event;
    })
}

function savePosition() {
    const questionTemp = [...taskDiv.children];
    for (let i = 0; i < questionTemp.length; i++) {
        let questionIndex = questionData.findIndex(q => q.event === questionTemp[i].innerHTML);
        questionData[questionIndex].userPosition = i;
    }
}

function showResult() {
    let result = 0;
    for (let i = 0; i < stepsAmount; i++) {
        const answers = questionData.filter(q => q.step === i);
        answers.sort((q1, q2) => q1.userPosition - q2.userPosition);
        const years = answers.map(a => a.date);
        if (isSorted(years)) {
            result++;
        }
    }
    resultDiv.style.display = "flex";
    resultElement.innerHTML = `${result} / ${stepsAmount}`;
}

function isSorted(tab) {
    let sorted = true;
    for (let i = 0; i < tab.length - 1; i++) {
        if (tab[i] > tab[i + 1]) {
            sorted = false;
            break;
        }
    }
    return sorted;
}

questionsDiv.forEach(question => {
    question.addEventListener('dragstart', () => {
        question.classList.add("question--dragging");
    });

    question.addEventListener('dragend', () => {
        question.classList.remove("question--dragging");
    })
})

taskDiv.addEventListener('dragover', (e) => {
    e.preventDefault();
    const selectedQuestion = document.querySelector(".question--dragging");
    const nextQuestion = getNextQuestionDiv(e.clientY);
    if (nextQuestion) {
        taskDiv.insertBefore(selectedQuestion, nextQuestion);
    } else {
        taskDiv.appendChild(selectedQuestion);
    }
})

function getNextQuestionDiv(y) {
    const otherQuestion = [...taskDiv.querySelectorAll(".question:not(.question--dragging)")]
    return otherQuestion.reduce((closest, child) => {
        const rectangle = child.getBoundingClientRect();
        const offset = y - rectangle.top - rectangle.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

nextButton.addEventListener('click', () => {
    addDoneClass(currentStep);
    savePosition();
    currentStep++;
    previousButton.disabled = false;
    if (currentStep === 4) {
        nextButton.innerHTML = "Koniec"
    }
    if (currentStep === stepsAmount) {
        showResult();
    } else {
        showQuestion(currentStep)
    }
})

previousButton.addEventListener('click', () => {
    currentStep--;
    removeDoneClass(currentStep);
    savePosition();
    showQuestion(currentStep);
    nextButton.innerHTML = "Następne"
    if (currentStep === 0) {
        previousButton.disabled = true;
    }
})

stepsButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        savePosition();
        removeAllStepsBar();
        currentStep = index;
        showQuestion(currentStep);
        for (let i = 0; i < currentStep; i++) {
            addDoneClass(i);
        }
        previousButton.disabled = index === 0 ? true : false;
        nextButton.innerHTML = (currentStep === 4) ? "Koniec" : "Następne";
    })
})

startAgainButton.addEventListener('click', () => {
    resultDiv.style.display = "none";
    currentStep = 0;
    previousButton.disabled = true;
    nextButton.innerHTML = "Następne";
    questionData.length = 0;
    for (let i = 0; i < events.length; i++) {
        events[i].step = -1;
    }
    removeAllStepsBar();
    init();
})

function addDoneClass(element) {
    stepsBar[element].classList.add("step--done");
    stepsBar[element].firstElementChild.classList.add("step__p--done");
}

function removeDoneClass(element) {
    stepsBar[element].classList.remove("step--done");
    stepsBar[element].firstElementChild.classList.remove("step__p--done");
}

function removeAllStepsBar() {
    for (let i = 0; i < stepsBar.length; i++) {
        removeDoneClass(i);
    }
}

function init() {
    const allQuestion = events.length;
    for (let i = 0; i < stepsAmount; i++) {
        for (let j = 0; j < questionAmount; j++) {
            let randomQuestion = events[Math.floor(Math.random() * allQuestion)];
            while (randomQuestion.step !== -1) {
                randomQuestion = events[Math.floor(Math.random() * allQuestion)];
            }
            randomQuestion.step = i;
            randomQuestion.userPosition = j;
            questionData.push(randomQuestion);
        }
    }
    showQuestion(currentStep);
}

init();