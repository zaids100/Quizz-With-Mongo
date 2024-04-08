const categoryApi="https://opentdb.com/api_category.php";
const nav=document.querySelector('.nav');
let selectElement = document.querySelector(".categories");
let categoryArr=[];
let score=0;
let currentIndex=0;
let quizzData=[];
const categories=document.querySelector('.categories');
const options=document.querySelector('.options');
const question=document.querySelector('.question');
const container=document.querySelector('.container');
const opt=document.querySelectorAll('.opt');
const nextBtn=document.querySelector('.btn');
const header=document.querySelector('.header');
const type=document.querySelector('.type');
const sound=document.querySelector('.sound');



//buttons
let start=document.getElementById("start");

//event listeners
nextBtn.addEventListener('click',nextQuestion);

getCategory();
start.addEventListener('click',()=>{
     nav.style.display="none";
     container.style.display="flex";
     start.style.display="none";
     getApi();
})


function fillCategories(){
         let opt='';
         categoryArr.forEach((c)=>{
                opt+=`<option value="${c.id}">${c.name}</option>`;
         });
         categories.innerHTML=opt;
}

async function getCategory(){
      try{
          let categoryResponse=await fetch(categoryApi);
          let response=await categoryResponse.json();
          categoryArr=response.trivia_categories;
          console.log(categoryArr);
          fillCategories();
      }catch(error){
            console.log(error);
      }

}


async function getApi()
{
    try{
        let response=await fetch(`https://opentdb.com/api.php?amount=10&category=${selectElement.value}&type=${type.value}`);
        let data=await response.json();
        quizzData=data.results;
        displayQuestion();
    }catch(error){
          console.log(error);
    }
}

function displayQuestion(){
    question.innerHTML = quizzData[currentIndex].question;
    
    // Combine incorrect answers and correct answer
    let allAnswers = [...quizzData[currentIndex].incorrect_answers, quizzData[currentIndex].correct_answer];

    // Shuffle the array
    allAnswers = shuffleArray(allAnswers);

    let opts = '';

    // Create HTML for options
    allAnswers.forEach((answer)=>{
        opts += `<div class="opt">${answer}</div>`;
    });

    // Set the HTML content of options
    options.innerHTML = opts;

    // Add event listeners inside displayQuestion function
    let optCards = document.querySelectorAll('.opt');
    optCards.forEach((optCard) => {
        optCard.addEventListener('click', () => {
            if (optCard.textContent === quizzData[currentIndex].correct_answer) {
                sound.src="correct_answer.mp3";
                sound.play();
                optCard.style.backgroundColor = "green";
                score++;
            } else {
                sound.src="wrong_answer.mp3";
                sound.play();
                optCard.style.backgroundColor = "red";
            }
            optCards.forEach((card) => {
                if (card.textContent === quizzData[currentIndex].correct_answer) {
                    card.style.backgroundColor = "green";
                }
            });
            optCards.forEach((card) => {
                card.style.pointerEvents = "none"; // Disable pointer events
            });
        });
    });
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}




function nextQuestion(){
    currentIndex++;
    if(currentIndex<quizzData.length)
    {
        displayQuestion();
    }
    else{
         container.style.display="none";
         nav.style.display="flex";
         nav.innerHTML="";
         nav.innerHTML=`<h1 class="score">Your Score is : ${score}/10</h1>
                        <button class="playAgain start">Play Again</button>`; 
        const playAgain=document.querySelector('.playAgain');
        playAgain.addEventListener('click',()=>{
            location.reload();
        });  
    } 
}