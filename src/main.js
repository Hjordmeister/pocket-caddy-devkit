let course = null
document.querySelector('#app').innerHTML = `
<div style="
  background:#111827;
  min-height:100vh;
  color:white;
  padding:2rem;
  font-family:sans-serif;
">
  <h1 style="color:#22d3ee;">
    Pocket Caddy DevKit
  </h1>

  <p>Skapa och exportera banor till Pocket Caddy.</p>

  <input
    id="courseName"
    type="text"
    placeholder="Banans namn"
    style="
      padding:10px;
      border-radius:8px;
      border:none;
      margin-right:10px;
    "
  />

  <button
    id="createCourse"
    style="
      background:#22d3ee;
      border:none;
      padding:10px 14px;
      border-radius:8px;
      cursor:pointer;
    "
  >
    Skapa bana
  </button>

  <div id="output" style="margin-top:2rem;"></div>
</div>
`

document.getElementById("createCourse").addEventListener("click", () => {
  const name = document.getElementById("courseName").value
  course = {
  id: name.toLowerCase().replaceAll(" ", "-"),
  name,
  holes: []
}

  document.getElementById("output").innerHTML = `
  <div style="
    background:#1f2937;
    padding:1rem;
    border-radius:12px;
    margin-top:1rem;
  ">
    <h2>${name}</h2>

    <button id="addHole">
      Lägg till hål
    </button>
<button id="exportCourse">
  Exportera bana
</button>

    <div id="holes"></div>
  </div>
`
document.getElementById("addHole").addEventListener("click", () => {
  course.holes.push({
  number: course.holes.length + 1,
  par: 3,
  distance: "",
  tee: null,
  basket: null,
  mandos: [],
  ob: [],
  dz: [],
  fairway: []
})
  renderHoles()
 
})
})
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeHole")) {
    const holeCard = e.target.closest(".holeCard")

    if (!holeCard) return

    holeCard.remove()
  }
})
function renderHoles() {
  document.getElementById("holes").innerHTML = course.holes.map(hole => `
    <div class="holeCard" style="
      background:#111827;
      padding:1rem;
      border-radius:10px;
      margin-top:1rem;
    ">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">
        <h3>Hål ${hole.number}</h3>

        <button class="removeHole" data-hole="${hole.number}">
          ❌
        </button>
      </div>

      <input value="${hole.par}" placeholder="Par" />
<input value="${hole.distance}" placeholder="Längd" />
<input placeholder="Beskrivning" />

<button class="setTee" data-hole="${hole.number}">Sätt tee GPS</button>
${hole.tee ? `<p>Tee: ${hole.tee.lat.toFixed(6)}, ${hole.tee.lng.toFixed(6)}</p>` : ""}
<button class="setBasket" data-hole="${hole.number}">Sätt korg GPS</button>
<button class="addFairwayPoint" data-hole="${hole.number}">
  + Fairwaypunkt
</button>
${hole.fairway.length > 0 ? `
  <p>Fairwaypunkter: ${hole.fairway.length} st</p>
` : ""}
<button class="addMando" data-hole="${hole.number}">+ Mando</button>
<button class="addOb" data-hole="${hole.number}">+ OB</button>
<button class="addDz" data-hole="${hole.number}">+ DZ</button>

    </div>
  `).join("")
}
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeHole")) {
    const holeNumber = Number(e.target.dataset.hole)

    course.holes = course.holes
      .filter(hole => hole.number !== holeNumber)
      .map((hole, index) => ({
        ...hole,
        number: index + 1
      }))

    renderHoles()
  }
})
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("setTee")) {
    const holeNumber = Number(e.target.dataset.hole)
    const hole = course.holes.find(h => h.number === holeNumber)

    navigator.geolocation.getCurrentPosition((pos) => {
      hole.tee = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      }

      renderHoles()
      alert(`Tee sparad för hål ${holeNumber}`)
    })
  }
})
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("addFairwayPoint")) {
    const holeNumber = Number(e.target.dataset.hole)
    const hole = course.holes.find(h => h.number === holeNumber)

    navigator.geolocation.getCurrentPosition((pos) => {
      hole.fairway.push({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      })

      renderHoles()
      alert(`Fairwaypunkt sparad för hål ${holeNumber}`)
    })
  }
})
document.addEventListener("click", (e) => {
  if (e.target.id === "exportCourse") {
    const data = JSON.stringify([course], null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${course.id || "course"}.json`
    a.click()

    URL.revokeObjectURL(url)
  }
})
document.addEventListener("click", (e) => {
  console.log("KLICK:", e.target)
})