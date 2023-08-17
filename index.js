const subjectBox = document.getElementById("subjectBox");
const questionBox = document.getElementById("questionBox");
const submitBtn = document.getElementById("submitButton");
const welcomeView = document.getElementById("Welcome-view");
const questionFormBtn = document.getElementById("QuestionFormBtn");
const questionContainer = document.getElementById("question-container");

const questionHeadingResponseForm = document.getElementById("questionHeading");
const questionResponseForm = document.getElementById("question");

const responseFormView = document.getElementById("response-form-view");

questionFormBtn.addEventListener('click',()=>
{
    welcomeView.classList.remove("hidden");
    responseFormView.classList.add("hidden");
});


submitBtn.addEventListener('click',function(event)
{
    if(subjectBox.value !== "" && questionBox.value !== "")
    {
        questionContainer.classList.add("questionContainer");

        const questionElement = document.createElement("div");

        const questionHeading = document.createElement("h2");
        questionHeading.classList.add("questionHeading");
        questionHeading.textContent = subjectBox.value;

        const question = document.createElement("p");

        question.classList.add("question");
        question.textContent = questionBox.value;
        
        const hr =  document.createElement("hr");
        
        questionElement.appendChild(questionHeading);
        questionElement.appendChild(question);
        questionContainer.appendChild(questionElement);
        questionContainer.appendChild(hr);

        subjectBox.value = "";
        questionBox.value = "";
        alert("Response Submitted");
        event.preventDefault();

        questionElement.addEventListener('click', function() {        
            showResponseForm(questionHeading,question)
        });

    }
});

function showResponseForm(questionHeading,question)
{
    welcomeView.classList.add("hidden");
    responseFormView.classList.remove("hidden");
    questionHeadingResponseForm.textContent= questionHeading.textContent;
    questionResponseForm.textContent = question.textContent;
}

const responseName = document.getElementById("responseName");
const responseComment = document.getElementById("responseComment");
const responseSubmitButton = document.getElementById("responseSubmitButton");

const Responses = document.getElementById("responses");

responseSubmitButton.addEventListener('click',(event) =>
{
    
});