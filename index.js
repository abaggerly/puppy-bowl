// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2507-Amador"; // Make sure to change this!
const API = BASE + COHORT;

let puppies = [];
let selectedPuppy;

const getPuppies = async () => {
  try {
    const res = await fetch(`${API}/players`);
    const data = await res.json();
    puppies = data.data;
    main();
  } catch (e) {
    console.error(e);
  }
};

const getPuppy = async (id) => {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const data = await res.json();

    selectedPuppy = data.data;

    main();
  } catch (e) {
    console.error(e);
  }
};



const deletePuppy = async (id) => {
  try {
    await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });
    await getPuppies();
    main();
  } catch (e) {
    console.error(e);
  }
};

const addPuppy = async (puppy) => {
  try {
    const res = await fetch(`${API}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(puppy),
    });

    const data = await res.json();
    newPuppy = data.data;
    await getPuppies();
    main();
  } catch (e) {
    console.error(e);
  }
};

const PuppyRosterList = (puppy) => {
  const $li = document.createElement("li");
  $li.innerHTML = `

<span>
<img class="rounded float-start" src="${puppy.imageUrl}" height="80" alt="Puppy pic">

<a href="#selected" class="link">${puppy.name}</a> 
</span>




`;
  $li.addEventListener("click", (e) => {
    getPuppy(puppy.id);
  });

  return $li;
};

const PuppyRoster = () => {
  const $div = document.createElement("div");
  for (const puppy of puppies.players) {
    $div.append(PuppyRosterList(puppy));
  }
  return $div;
};

const newPuppyForm = () => {
  const $form = document.createElement("form");
  $form.innerHTML = `
 <div class="row">
  <div class="col-12">
    <label for="name"class="form-label">Name</label>  
        <input name="name" class="form-control" required />
    </div>
     <div class="col-12">
    <label for="breed" class="form-label">Breed</label> 
        <input class="form-control" name="breed" required />
    </div>
     <div class="col-12">
    <label for="status" class="form-label">Status</label> 
        <select class ="form-select" name="status" required>
            <option>Choose Status</option>
            <option value="bench">Bench</option>
            <option value="field">Field</option>
        </select>
    </div>  
     <div class="col-12">
    <label for="image" class="form-label">Image URL</label> 
        <input class="form-control" name="image" type="url" alt="Puppy" required />
  </div>
     <div class="col-12">
    <label for="teamId"class="form-label">TeamID</label> 
        <input name="teamId" class="form-control" />
    </div>
  </div><br><center>
    <button type="submit" class="btn btn-outline-primary submit">Invite Puppy</button>
    </center>
   `;

  $form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData($form);
    const teamIdValue = data.get("teamId")?.trim();

    addPuppy({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      image: data.get("image"),
      teamId: teamIdValue === "" ? null : teamIdValue,
    });
  });
  return $form;
};

const PuppyDetails = () => {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $section = document.createElement("section");
  $section.innerHTML = `
  <img src="${selectedPuppy.player.imageUrl}" class="img-fluid" width="200" alt="Puppy Pic">
  <p><b>Name:</b>  ${selectedPuppy.player.name}</p>
  <p><b>ID:</b> ${selectedPuppy.player.id}</p>
  <p><b>Breed:</b> ${selectedPuppy.player.breed}</p>
  <p><b>Team:</b> ${selectedPuppy.player.teamId}</p>
  <p><b>Status:</b> ${selectedPuppy.player.status}</p>
  <button class="btn btn-outline-danger delete">Remove from Roster</button>
  `;

  const $delete = $section.querySelector(".delete");
  $delete.addEventListener("click", () => deletePuppy(selectedPuppy.player.id));


  return $section;
};

const main = () => {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
<center><h1>Puppy Bowl</h1></center>
<main>
    <section class="section1">
      <h2>Puppy roster</h2>
        <PuppyRoster></PuppyRoster>
        <newPuppyForm></newPuppyForm>
    </section>
    <section class="float-left"id="selected">
    
        <h2>Puppy Details</h2>
        <PuppyDetails></PuppyDetails>
    
    </section>
</main>
`;

  $app.querySelector("PuppyRoster").replaceWith(PuppyRoster());
  $app.querySelector("newPuppyForm").replaceWith(newPuppyForm());
  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails());
};

const init = async () => {
  await getPuppies();
  main();
};

init();
