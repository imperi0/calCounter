function showPage(pageId){
  document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

function toggleCustomFood(){
  const customDiv = document.getElementById('customFoodDiv');
  if(document.getElementById('foodSelect').value === 'custom'){
    customDiv.classList.remove('hidden');
  } else {
    customDiv.classList.add('hidden');
  }
}

document.getElementById('recommendForm').addEventListener('submit', function(e){
  e.preventDefault();
  const age = +document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const height = +document.getElementById('height').value;
  const weight = +document.getElementById('weight').value;
  const activity = +document.getElementById('activity').value;

  let bmr = gender==='male'
    ? 10*weight + 6.25*height - 5*age + 5
    : 10*weight + 6.25*height - 5*age -161;

  const dailyCalories = Math.round(bmr * activity);

  const recDiv = document.getElementById('calorieRec');
  recDiv.innerText = `Estimated daily calories: ${dailyCalories} kcal`;
  recDiv.classList.remove('hidden');
});

// Predefined food calories per 100g
const foodCalories = { rice:130, bread:265, chicken:239, apple:52, banana:96, egg:155 };
let entries = [];

document.getElementById("foodForm").addEventListener("submit", function(e){
  e.preventDefault();
  const date = document.getElementById("trackDate").value;
  let food = document.getElementById("foodSelect").value;
  let calPer100g;

  if(food==='custom'){
    food = document.getElementById("customFoodName").value.trim();
    calPer100g = +document.getElementById("customFoodCal").value;
    if(!food || !calPer100g){
      alert('Enter valid food and calories!');
      return;
    }
  } else {
    calPer100g = foodCalories[food];
  }

  const quantity = +document.getElementById("quantity").value;
  if(quantity<=0){ alert('Enter valid quantity'); return; }

  const calories = (calPer100g * quantity)/100;
  entries.push({date, food, quantity, calories});

  renderEntries();
  this.reset();
  toggleCustomFood();
});

function renderEntries(){
  const tbody = document.querySelector("#entriesTable tbody");
  const tfoot = document.getElementById("totalsFooter");
  tbody.innerHTML = '';
  tfoot.innerHTML='';

  const totals = {};
  entries.forEach(e=>{
    const row = document.createElement('tr');
    row.innerHTML=`<td>${e.date}</td><td>${e.food}</td><td>${e.quantity}</td><td>${Math.round(e.calories)} kcal</td>`;
    tbody.appendChild(row);
    totals[e.date] = (totals[e.date] || 0) + e.calories;
  });

  for(const date in totals){
    const row=document.createElement('tr');
    row.innerHTML=`<td colspan="3" style="text-align:right;font-weight:bold;">Total for ${date}:</td><td style="font-weight:bold;">${Math.round(totals[date])} kcal</td>`;
    tfoot.appendChild(row);
  }
}
