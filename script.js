/// Here I add map for read code after a few days latter, when I will read my code again. start with line number 6

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// here is the first execution. when loading window invoke fetchFoodItem;
window.addEventListener("load", () => fetchFoodItem(""));

// this is an independent funcion. who work without call another funcion.
window.addEventListener("scroll", () => {
  const scroller = document.querySelector("#scroller");

  if (window.scrollY > 300) {
    scroller.classList.add("show");
  } else {
    scroller.classList.remove("show");
  }
});

// for search query this function work. when search any food. this funciton pass data to fetchFoodItem funcion.
const searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchText = document.querySelector("#search-text");
  const query = searchText.value;
  fetchFoodItem(query);

  searchText.value = "";
});

// Here find the actual fetchFoodItem funciotn. when execution line by line. find a invokation bindData(). And Go there.
async function fetchFoodItem(foodName) {
  const loader = document.getElementById("loader");
  const cardContainer = document.querySelector("#card-container");

  try {
    loader.style.display = "flex";
    cardContainer.style.display = "none";

    const res = await fetch(`${API_URL}${foodName}`);
    const data = await res.json();
    if (!data.meals) {
      cardContainer.textContent = "No Data found";
      return;
    }
    bindData(data.meals);
  } catch (error) {
    cardContainer.innerText = "No data found";
  } finally {
    loader.style.display = "none";
    cardContainer.style.display = "grid";
  }
}

// find the bindData. Bind fetched Data with cardContainer and call fillDataInCard.
function bindData(meals) {
  const cardContainer = document.querySelector("#card-container");
  const foodTemplate = document.querySelector("#foodTemplate");
  console.log(meals);

  cardContainer.innerHTML = "";

  meals.forEach((meal) => {
    const cardClone = foodTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, meal);
    cardContainer.appendChild(cardClone);
  });
}

// find the fillDataInCard function. filling data in randomly making card. Here need to shorter text. because the text form api is very large. So call getShortInstructions. and when want to view details of card. click view details button. So call a anonimous function when click view detials button. when click veiw details button call anothor funcion to create popup content called modal.
function fillDataInCard(cardClone, meal) {
  const newsImg = cardClone.querySelector("#card-img");
  const cardTitle = cardClone.querySelector("#card-title");
  const cardDesc = cardClone.querySelector("#card-desc");
  const viewDetailsBtn = cardClone.querySelector("#view-details");

  const shortText = getShortInstructions(meal.strInstructions, 20);

  newsImg.src = meal.strMealThumb;
  cardTitle.textContent = meal.strMeal;
  cardDesc.textContent = shortText;

  viewDetailsBtn.addEventListener("click", () => {
    openModal(meal);
  });
}

// that is the function who shorter text form api
function getShortInstructions(fullText, wordLimit = 20) {
  const words = fullText.split(" ");
  if (words.length <= wordLimit) return fullText;
  return words.slice(0, wordLimit).join(" ") + "...";
}

//open modal on click view details. here need more text so called getShortInstruction for exact number of word.
function openModal(meal) {
  document.getElementById("mealModal").classList.remove("hidden");
  document.getElementById("mealModal").classList.add("flex");

  document.getElementById("modalTitle").textContent = meal.strMeal;
  document.getElementById("modalImg").src = meal.strMealThumb;
  document.getElementById("modalInstructions").textContent =
    getShortInstructions(meal.strInstructions, 150);
}

// Close modal on click of close button. this is independent function
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("mealModal").classList.add("hidden");
});
