const usersList = document.getElementById("usersList");
const userDetailsBox = document.getElementById("userDetails");
const userRoleFilter = document.getElementById("userRoleFilter");

let allUsers = JSON.parse(localStorage.getItem("registrations")) || [];

function renderUsers(data) {
    usersList.innerHTML = "";

    if (data.length === 0) {
        usersList.innerHTML = "<p>No users yet.</p>";
        return;
    }

    const header = document.createElement("div");
    header.className = "users-header";
    header.innerHTML = `
        <span>Last name</span>
        <span>First name</span>
        <span>Role</span>
        <span></span>
    `;
    usersList.appendChild(header);

    data.forEach((user) => {
        const row = document.createElement("div");
        row.className = "user-row";
        row.innerHTML = `
            <span>${user.lastName || "-"}</span>
            <span>${user.firstName || "-"}</span>
            <span>${user.role || "-"}</span>
            <button class="details-link">View details</button>
        `;
        row.querySelector(".details-link").addEventListener("click", () => {
            showUserDetails(user);
        });
        usersList.appendChild(row);
    });
}

function buildRoleSpecificDetails(user) {
    if (user.role === "staff") {
        return `
            <p>Preferred role</p>
            <p>${user.preferredRole || "-"}</p>
            <p>Organized before</p>
            <p>${user.organizedBefore || "-"}</p>
            <p>Availability</p>
            <p>${user.availability || "-"}</p>
        `;
    }

    if (user.role === "mentor") {
        return `
            <p>Years of experience</p>
            <p>${user.yearsExperience || "-"}</p>
            <p>Expertise area</p>
            <p>${user.expertiseArea || "-"}</p>
            <p>Mentored before</p>
            <p>${user.mentoredBefore || "-"}</p>
            <p>Availability</p>
            <p>${user.availability || "-"}</p>
        `;
    }

    // participant
    return `
        <p>Team name</p>
        <p>${user.teamName || "-"}</p>
        <p>Main skills</p>
        <p>${user.mainSkills || "-"}</p>
        <p>Skill level</p>
        <p>${user.skillLevel || "-"}</p>
    `;
}

function showUserDetails(user) {
    userDetailsBox.style.display = "block";
    userDetailsBox.innerHTML = `
        <h3>User details</h3>
        <div class="details-grid">
            <p>First Name</p>
            <p>${user.firstName || "-"}</p>
            <p>Last Name</p>
            <p>${user.lastName || "-"}</p>
            <p>Email</p>
            <p>${user.email || "-"}</p>
            <p>Discord username</p>
            <p>${user.discordUsername || "-"}</p>
            <p>University</p>
            <p>${user.university || "-"}</p>
            <p>Field of study</p>
            <p>${user.fieldOfStudy || "-"}</p>
            <p>Role</p>
            <p>${user.role || "-"}</p>
            ${buildRoleSpecificDetails(user)}
        </div>
        <div class="details-actions">
            <button class="approve-btn">Approve</button>
            <button class="reject-btn">Reject</button>
        </div>
    `;
}

userRoleFilter.addEventListener("change", () => {
    const role = userRoleFilter.value;
    if (role === "all") {
        renderUsers(allUsers);
    } else {
        renderUsers(allUsers.filter((u) => u.role === role));
    }
});

document.addEventListener("click", (e) => {
    if (
        userDetailsBox.style.display === "block" &&
        !userDetailsBox.contains(e.target) &&
        !e.target.classList.contains("details-link")
    ) {
        userDetailsBox.style.display = "none";
    }
});

renderUsers(allUsers);

