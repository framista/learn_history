const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const stepsBar = document.querySelectorAll(".step");

console.log(stepsBar)

let currentStep = 0;

nextButton.addEventListener('click', () => {
    addDoneClass(currentStep)
    currentStep++;
    previousButton.disabled = false;
    if (currentStep === 4) {
        nextButton.innerHTML = "Koniec"
    }
    console.log("next")
})

previousButton.addEventListener('click', () => {
    removeDoneClass(currentStep - 1)
    currentStep--;
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
