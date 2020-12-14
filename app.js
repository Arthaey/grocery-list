const data = {
	getItem: (key) => localStorage.getItem(key),
	setItem: (key, value) => localStorage.setItem(key, value),
	clear: () => localStorage.clear(),
}

const form = document.getElementById('form');

// initialize elements 
let items = JSON.parse(data.getItem("items"));
let recipes = JSON.parse(data.getItem("recipes"));

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!items) {
	items = defaultItems;
	updateLocalStorage("items", items);
}

if(!recipes) {
	recipes = defaultRecipes
	updateLocalStorage("recipes", recipes);
}

// adds each grocery item to a bulleted list
displayGroceryItems(items);

// adds each recipe to a bulleted list
const links = document.getElementById('links');

recipes.forEach(recipe => {
	const listItem = document.createElement('li');

	if(recipe.url) {
		const url = document.createElement('a');
		url.setAttribute('href', `${recipe.url}`);
		url.textContent = recipe.name;
		listItem.appendChild(url);
		links.appendChild(listItem);
	} else {
		listItem.textContent = recipe.name;
		links.appendChild(listItem);
	}

	if(recipe.notes) {
		let splitNotes = recipe.notes.split(';');

		const noteContainer = document.createElement('ul');

		splitNotes.forEach(note => {
			const listNote = document.createElement('li');
			listNote.textContent = note;
			noteContainer.appendChild(listNote);
			listItem.appendChild(noteContainer);
		});
	}
});

const priceInput = document.getElementById('number');
const priceButton = document.getElementById('calc-button');
const prices = document.getElementById('prices');

let math = JSON.parse(data.getItem("prices"));

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!math) {
	math = [];
	updateLocalStorage("prices", math);
} else {
	// displays price
	math.forEach(price => {
		const entry = document.createElement('li');
		entry.textContent = `$${price.toFixed(2)}`;
		prices.appendChild(entry);
	});

	priceInput.value = "";

	// add prices together and display
	if(math.length >= 1) {
		const results = document.getElementById('results');
		const sums = (accumulator, currentValue) => accumulator + currentValue;
		results.textContent = `$${math.reduce(sums).toFixed(2)}`;
	}
}

// input and display prices
priceButton.addEventListener('click', function(e) {
	e.preventDefault();

	// input individual price
	if(priceInput.value) {
		math.push(priceInput.value);
		math = math.map(Number);
		data.setItem("prices", JSON.stringify(math));

		// clears prices display so there aren't duplicate prices listed
		prices.textContent = "";

		// displays price
		math.forEach(price => {
			const entry = document.createElement('li');
			entry.textContent = `$${price.toFixed(2)}`;
			prices.appendChild(entry);
			priceInput.value = "";
		});

		// add prices together and display
		const results = document.getElementById('results');
		const sums = (accumulator, currentValue) => accumulator + currentValue;
		results.textContent = `$${math.reduce(sums).toFixed(2)}`;
	}
});

const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');

// display new items in UI on click
itemButton.addEventListener('click', function(e) {
	e.preventDefault();
	addAdditionalItem(itemInput.value);
	itemInput.value = '';
});

// clears localStorage when clicked
clear.addEventListener('click', function(e) {
	e.preventDefault();

	data.clear();
	window.location.reload();
});

// input and display additional items
function addAdditionalItem(item) {
	items.push({"item": item, "state": false,});
	updateLocalStorage("items", items);
	window.location.reload();
}

// adds items to UI
function displayGroceryItems(items) {
let itemId = 0;

items.forEach(item => {
	// debugger;
	const newGrocery = document.createElement('li');
	newGrocery.setAttribute("id", itemId);
	newGrocery.classList.add("col1")
	itemId+= 1;
	newGrocery.textContent = item.item;
	form.appendChild(newGrocery);

	// create edit button
	const editBtn = document.createElement('div');
	editBtn.classList.add("col2");
	editBtn.classList.add("btn");
	editBtn.classList.add("edit");
	editBtn.textContent = "E";
	form.appendChild(editBtn);
	editBtn.addEventListener('click', editBtnClicked);

	// create delete button
	const deleteBtn = document.createElement('div');
	deleteBtn.classList.add("col3");
	deleteBtn.classList.add("btn");
	deleteBtn.classList.add("delete");
	deleteBtn.textContent = "X";
	form.appendChild(deleteBtn);

	// create save button
	const saveBtn = document.createElement('div');
	saveBtn.classList.add("col4");
	saveBtn.classList.add("btn");
	saveBtn.classList.add("save");
	saveBtn.classList.add("hidden");
	saveBtn.textContent = "Save";
	form.appendChild(saveBtn);

	// adds strikethrough if already checked
	if(item.state === true) {
		newGrocery.classList.add("checked");
	}

	// toggles strikethrough on repeat clicks
	newGrocery.addEventListener('click', function(e) {
		newGrocery.classList.toggle("checked");
		if(items[e.target.id].state === true) {
			items[e.target.id].state = false;
			updateLocalStorage("items", items);
		} else {
			items[e.target.id].state = true;
			updateLocalStorage("items", items);
		}
	});
});
}

function updateLocalStorage(name, elements) {
	data.setItem(name, JSON.stringify(elements));
}

function editBtnClicked(e) {
	console.log(e.target);
}