let API = "https://www.purevichar.in/api/shayari/?page=";

let currentPage = 1; // intialising page 1 

// acessing all buttons and divs
const DiscoverBtn = document.getElementById("Dbtn");
const LoadBtn = document.getElementById("loadBtn");
const container = document.getElementById("shayari");
const FavoriteBtn = document.getElementById("Fbtn");
const Loader = document.getElementById("loader");
const loadmore = document.getElementById("loadmore");
const Dropdown = document.getElementById("dropdown");

function resetTabs() { // Reset the styles of the tab buttons
  [DiscoverBtn, FavoriteBtn].forEach(btn => { // Reset each button's styles
    btn.style.backgroundColor = "";
    btn.style.color = "";
  });
}

// Mark the clicked button as active
function activateTab(btn) { // Activate the clicked tab button
  resetTabs();// Reset the styles of the tab buttons
  btn.style.backgroundColor = "rgb(224, 53, 153)";
  btn.style.color = "white";
}

function displayloader() {
  Loader.style.display = "flex";
}

function hideloader() {
  Loader.style.display = "none";

}

let shayariData = []; // Array to hold shayari data

//fetching the API
const FetchData = async (page) => { // here page=1 is a default parameter
  try {
    displayloader();
    const response = await fetch(`/api/proxy?page=${page}`);
    const data = await response.json();
    console.log("fetched data", data);

    if (Array.isArray(data.quotes)) { // Array.isArray is a built in js function Checks vslue is array or not here it checks data.quotes is array or not  
      // append instead of overwrite
      shayariData = [...shayariData, ...data.quotes]; // Append new quotes to the existing array
      //... spread operator adds old array and new array
    }

  }
  catch (error) {
    console.error("Error fetching Shayari:", error);
    // shayariData = []; // Clear shayari data on error
  }
  finally {
    console.log("Fetch attempt finished");
    hideloader();
  }

}

function renderShayari(data, append) { // data is parameter returns an array of 30 shayaris apend false  is DP and optional flag= is just a parameter that we dont have to always pass ACTS like t/f, 
  console.log("this is data", data);
  if (!data || data.length === 0)  // Check if data is valid
  {
    console.warn("No shayari data available yet");
    if (!append) container.innerHTML = "<p>No shayari found.</p>";
    return;
  }
  if (!append) container.innerHTML = "";  // Clear previous shayari

  data.forEach(item => {
    console.log("ITEM", item)    // Iterate over each shayari item
    const shayariDiv = document.createElement("div"); // Create a new div for each shayari
    shayariDiv.classList.add("shayari-item");  // Add class for styling
    const text = item.quote.join("<br>")// Handle array of quotes
    shayariDiv.innerHTML = `
                <p style="color:blue; font-size: 20px;" id="quote">${text}</p>    
            <small style="color:#E0355D; font-size: 18px;">✍️${item.author}.</small>
            <span style="color:#E0355D; font-size: 18px;">📂${item.category}.</span>
            <span1 style="color:#E0355D; font-size: 18px;">❤️${item.likes}</span1>
            <br><br>

            <button  style="background-color: #ED2424; 
            color: white; border: none; 
            font-weight: bold;
            border-radius: 20px; 
            padding: 10px 20px; 
            cursor: pointer;" onclick="saveShayari('${text}',this)">🤍Save</button>

            <button type="button" id="copyBtn"
            style="background-color: #07D927; 
            color: white; border: none; 
            font-weight: bold;
            border-radius: 20px; 
            padding: 10px 20px; 
            cursor: pointer;"
            onclick="copyText('${item.quote}',this)">Copy</button> 

            <button style="background-color: #07D927;
            border: none; border-radius: 50%;
            padding: 12px; cursor: pointer;"
            onclick="shareWhatsapp('${encodeURIComponent(item.quote)}')"> 
            <i class="fab fa-whatsapp" style="font-size:20px; color:white;"></i>
            </button>
        `;
    // encodeURIComponent built-in JavaScript function.takes a string and encodes it into a URL-safe format.


    container.appendChild(shayariDiv);
  });
};

// function FilterShayari(category){

//   let filtered = shayariData.filter(item =>
//     item.category.toLowerCase() === category.toLowerCase()
   
//   );

//   renderShayari(filtered);

// }

DiscoverBtn.addEventListener("click", async () => {  // Add event listener for Discover button
  currentPage = 1; // Reset current page to 1
  shayariData = []; // Clear previous shayari data
  await FetchData(currentPage); // Fetch new shayari data
  renderShayari(shayariData); // Render the fetched shayari
  activateTab(DiscoverBtn);
  LoadBtn.style.display = "inline-block";
  LoadBtn.disabled = false;
  Dropdown.style.display = "block";

});

LoadBtn.addEventListener("click", async () => {
  currentPage += 1; // Increment current page
  await FetchData(currentPage);// Fetch new shayari data
  renderShayari(shayariData);// Render the fetched shayari
});

//Copy function
function copyText(item, btn) { // item is a parameter a text or quote to copy
  console.log(item);
  navigator.clipboard.writeText(item).then(() => { // Copy the text to clipboard and then run next function
    btn.textContent = btn.textContent === "Copy" ? "✅Copied" : "Copy";
  });
}
//navigator is built-in-object provided by the browser contains information and APIs about the user’s browser n device.
//The clipboard is a temporary storage area where copied  data is kept
//writeText is a method of the Clipboard API ,only works on HTTPS websites,requires a user action (like clicking a button)

function saveShayari(item, btn) {
 let saved = JSON.parse(localStorage.getItem("shayaris")) || []; // Get existing saved shayaris
  //JSON.parse() is a built-in JavaScript function.
  //It is used to convert a JSON string into a JavaScript object.
  // localStorage.getItem("shayaris") Gets the value stored in localStorage under the key "shayaris".

  let ShayariObject = { // Create a new object to hold the shayari details
    quote: item, //Saves the item the shayari text  into the object.
    author: btn.parentElement.querySelector("small")?.textContent || "",
    // .parentElement property of a DOM Looks inside the button’s parent element
    //The ?. is optional chaining, meaning it won’t throw an error if <small> is missing.

    category: btn.parentElement.querySelector("span")?.textContent || "",
    likes: btn.parentElement.querySelector("span1")?.textContent || ""
  };
  saved.push(ShayariObject); // Add the new shayari to the saved list
  localStorage.setItem("shayaris", JSON.stringify(saved)); // Save the updated list back to localStorage
  // JSON.stringify Converts the JavaScript object/array into a string.
  // localStorage.setItem sets that string into localStorage under the key "shayaris".

  btn.textContent = btn.textContent === "🤍Save" ? "❤️Saved" : "🤍Save";
}
//Share function
function shareWhatsapp(quote) {
  console.log(quote);
  const url = `https://wa.me/?text=${quote}`;
  window.open(url, "_blank"); // Opens in a new tab
}
//encodeURIComponent(quote) Converts your shayari into a URL-safe format
// `https://wa.me/?text Opens WhatsApp (web or app) with the given message pre-filled

function Favorite() {
 Dropdown.style.display="none";
  console.log("fav click");
  activateTab(FavoriteBtn);
LoadBtn.style.display="none";
  let favr = localStorage.getItem("shayaris"); // Get the favorite shayaris from localStorage
  console.log("fav shayari", favr);
  container.innerHTML = "";  // Clear previous shayari

  if (favr) {
    let favData = JSON.parse(favr); // Parse the JSON string into an array and storing it into favData
    favData.forEach((content, index) => { // Iterate over each favorite shayari // content is item from array and index is its position
      const shayariDiv = document.createElement("div"); // Create a new div for each shayari
      shayariDiv.classList.add("shayari-item");  // Add class for styling


      shayariDiv.innerHTML = `
                <p style="color:blue; font-size: 20px;">${content.quote}</p>
                 <small style="color:#E0355D; font-size: 18px;">${content.author}</small>
        <span style="color:#E0355D; font-size: 18px;">${content.category}</span>
          <span style="color:#E0355D; font-size: 18px;">${content.likes}</span><br>

           <button type="button" id="copyBtn"
            style="background-color: #07D927; 
            color: white; border: none; 
            font-weight: bold;
            border-radius: 20px; 
            padding: 10px 20px; 
            cursor: pointer;"
            onclick="copyText('${content.quote}',this)">Copy</button> 

                <button 
                style="background-color:#D10202; 
            color: white; border: none; 
            font-weight: bold;
            border-radius: 20px; 
            padding: 10px 20px; 
            cursor: pointer;
            margin-top : 10px"
             onclick="Delete(${index}, this)">Delete</button>
                
            `;

      container.appendChild(shayariDiv);
      // Append to container
    });
  } else {
    container.innerHTML = "<p>No favorite shayaris found.</p>";
  }
  if (container.innerHTML === "") {
    container.innerHTML = "<p>No favorite shayaris found.</p>";
  }
}

function Delete(index, btn) {
  let fav = localStorage.getItem("shayaris"); // Get the favorite shayaris from localStorage
  let favData = fav ? JSON.parse(fav) : []; // Parse the JSON string into an array

  favData.splice(index, 1); // remove 1 item at index
  localStorage.setItem("shayaris", JSON.stringify(favData)); // Update the localStorage
  
  let shayariDiv = btn.parentElement; // Get the parent div of the button
  shayariDiv.remove();// Remove the shayari div from the DOM

}

function FilterShayari(category){

  let filtered = shayariData.filter(item =>
    item.category.toLowerCase() === category.toLowerCase()
   
  );

  renderShayari(filtered);

}

