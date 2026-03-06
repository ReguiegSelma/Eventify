const createBtn = document.getElementById("createBtn")
const form = document.getElementById("createForm")
const saveBtn = document.getElementById("saveEvent")
const container = document.querySelector(".event-container")
const daysInput = document.getElementById("daysNumber")
const agendaContainer = document.getElementById("agendaContainer")

createBtn.addEventListener("click", () => {

    form.style.display = "block"

})


daysInput.addEventListener("input", () => {

    agendaContainer.innerHTML = ""

    const days = daysInput.value

    for(let i = 1 ; i <= days ; i++){

        const block = document.createElement("div")

        block.classList.add("agenda-day")

        block.innerHTML = `

            <h4>Day ${i}</h4>

            <input
                type="text"
                class="dayTitle"
                placeholder="Title"
            >

            <textarea
                class="dayDesc"
                placeholder="Description"
            ></textarea>

        `

        agendaContainer.appendChild(block)

    }

})


saveBtn.addEventListener("click", () => {

    const name = document.getElementById("eventName").value
    const date = document.getElementById("eventDay").value
    const time = document.getElementById("eventTime").value
    const type = document.getElementById("eventType").value
    const participants = document.getElementById("participants").value
    const staff = document.getElementById("staff").value
    const mentor = document.getElementById("mentor").value
    const days = document.getElementById("daysNumber").value


    const titles = document.querySelectorAll(".dayTitle")
    const descs = document.querySelectorAll(".dayDesc")

    let agendaHTML = ""

    titles.forEach((title,index)=>{

        agendaHTML += `

            <p><strong>Day ${index+1}:</strong> ${title.value}</p>
            <p>${descs[index].value}</p>

        `

    })



    const eventBox = document.createElement("div")

    eventBox.classList.add("event-box")


 eventBox.innerHTML = `

    <h2>Event Overview</h2>

    <p><strong>Event Name:</strong> ${name}</p>
    <p><strong>Participants:</strong> ${participants}</p>
    <p><strong>Date & time:</strong> ${date} , ${time}</p>
    <p><strong>Number of days:</strong> ${days} days</p>
    <div class="event-actions">
        <button class="edit-btn">Edit event</button>
        <button class="delete-btn">Delete event</button>
    </div>
`
    container.appendChild(eventBox)
    form.style.display = "none"

    const deleteBtn = eventBox.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", () => {

        eventBox.remove()

    })
    const editBtn = eventBox.querySelector(".edit-btn")
    editBtn.addEventListener("click", () => {
        document.getElementById("eventName").value = name
        document.getElementById("eventDay").value = date
        document.getElementById("eventTime").value = time
        document.getElementById("eventType").value = type
        document.getElementById("participants").value = participants
        document.getElementById("staff").value = staff
        document.getElementById("mentor").value = mentor
        document.getElementById("daysNumber").value = days

        eventBox.remove()
        form.style.display = "block"

    })

})