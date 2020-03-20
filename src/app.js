import { events } from './data';

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const stepsBar = document.querySelectorAll(".step");
const taskDiv = document.querySelector(".task");
const questionsDiv = document.querySelectorAll(".question");

let currentStep = 0;
const stepsAmount = 5;
const questionAmount = 4;
const allQuestion = events.length;
const questionData = [];

function init() {
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

function showQuestion(currentStep) {
    const currentQuestions = questionData.filter(q => q.step === currentStep);
    console.log(currentQuestions)
    questionsDiv.forEach( (question, index) => {
        question.innerHTML = currentQuestions[index].event;
    })
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
    showQuestion(currentStep)
    currentStep++;
    previousButton.disabled = false;
    if (currentStep === 4) {
        nextButton.innerHTML = "Koniec"
    }
    console.log("next")
})

previousButton.addEventListener('click', () => {
    currentStep--;
    removeDoneClass(currentStep);
    showQuestion(currentStep - 1);
    nextButton.innerHTML = "Następne"
    if (currentStep === 0) {
        previousButton.disabled = true;
    }
    console.log("previous")
})

function addDoneClass(element) {
    stepsBar[element].classList.add("step--done");
    stepsBar[element].firstElementChild.classList.add("step__p--done");
}

function removeDoneClass(element) {
    console.log(element)
    stepsBar[element].classList.remove("step--done");
    stepsBar[element].firstElementChild.classList.remove("step__p--done");
}

init();