import Question from './Question'

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const stepsBar = document.querySelectorAll(".step");
const task = document.querySelector(".task");
const questions = document.querySelectorAll(".question");

let currentStep = 0;

questions.forEach(question => {
    question.addEventListener('dragstart', () => {
        question.classList.add("question--dragging");
    });

    question.addEventListener('dragend', () => {
        question.classList.remove("question--dragging");
    })
})

task.addEventListener('dragover', (e) => {
    e.preventDefault();
    const selectedQuestion = document.querySelector(".question--dragging");
    const nextQuestion = getNextQuestionDiv(e.clientY);
    if (nextQuestion) {
        task.insertBefore(selectedQuestion, nextQuestion);
    } else {
        task.appendChild(selectedQuestion);
    }

})

function getNextQuestionDiv(y) {
    const otherQuestion = [...task.querySelectorAll(".question:not(.question--dragging)")]
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
