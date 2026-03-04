function startCountdown() {
    const eventDate = new Date("2026-03-10T00:00:00").getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            clearInterval(interval);
            ["days", "hours", "minutes", "seconds"].forEach(id => {
                document.getElementById(id).innerText = "00";
            });
            return;
        }
        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText    = String(days).padStart(2, '0');
        document.getElementById("hours").innerText   = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

//Security
function sanitizeString(value, { maxLen = 300 } = {}) {
    if (value === null || value === undefined) return "";
    let s = String(value);
    try { s = s.normalize("NFKC"); } catch (e) {}
    s = s.trim();
    s = s.replace(/[\u0000-\u001F\u007F]/g, ""); // control chars
    s = s.replace(/[<>]/g, ""); // reduce XSS risk
    if (s.length > maxLen) s = s.slice(0, maxLen);
    return s;
}

function sanitizeEmail(value) {
    return sanitizeString(value, { maxLen: 200 }).toLowerCase();
}

function sanitizePhone(value) {
    const s = sanitizeString(value, { maxLen: 12 });
    return s.replace(/[^0-9+\-() ]/g, "");
}

function safeGetQueryParam(name, allowedValues = []) {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(name) || "";
    const cleaned = sanitizeString(raw, { maxLen: 200 });

    if (allowedValues.length > 0 && !allowedValues.includes(cleaned)) {
        return null;
    }

    return cleaned;
}

//Form
document.addEventListener("DOMContentLoaded", function () {

    startCountdown();

    // Elements
    const roleSelect = document.getElementById("roleSelect");
    const emailInput = document.getElementById("emailInput");

    const form1   = document.getElementById("form1");
    const form2   = document.getElementById("form2");
    const form3   = document.getElementById("form3");
    const form4   = document.getElementById("form4");
    const final   = document.getElementById("final");

    const steps = document.querySelectorAll(".step");

    let currentRole = "participant";

    document.querySelectorAll("input, select").forEach(field => {
        field.addEventListener("input", function () {
            this.classList.remove("input-error");            // retire la bordure rouge
            const next = this.nextElementSibling;
            if (next && next.classList.contains("error-msg")) next.remove(); // retire le texte d'erreur
        });
    });


    // Fake allowlist (replace with real backend check later)
    const clubMembers = [
        "member1@omc.com",
        "member2@omc.com",
        "mentor@omc.com",
        "member@gmail.com"
    ];

    // ===== Email → unlock roles =====
    emailInput.addEventListener("blur", function () {
        const email = sanitizeEmail(emailInput.value);
        const isMember = clubMembers.includes(email);

        roleSelect.innerHTML = `<option value="participant">Participant</option>`;
        if (isMember) {
            roleSelect.innerHTML += `
                <option value="mentor">Mentor</option>
                <option value="staff">Staff</option>
            `;
        }
    });

    function hideAll() {
        [form1, form2, form3, form4, final].forEach(f => f.style.display = "none");
    }

    function show(el) {
        el.style.display = "block";
    }

    function setStep(index) {
        steps.forEach((s, i) => s.classList.toggle("active", i <= index));
    }


    function validateForm(formEl) {
        formEl.querySelectorAll(".error-msg").forEach(e => e.remove());
        formEl.querySelectorAll(".input-error").forEach(e => e.classList.remove("input-error"));

        const requiredFields = formEl.querySelectorAll("input[required], select[required]");
        let valid = true;

        requiredFields.forEach(field => {
            // Cas spécial radio : vérifie qu'une option est cochée dans le groupe
            if (field.type === "radio") {
                const group = formEl.querySelectorAll(`input[name="${field.name}"]`);
                const checked = [...group].some(r => r.checked);
                if (!checked) {
                    const groupContainer = field.closest(".radio-group");
                    if (groupContainer && !groupContainer.querySelector(".error-msg")) {
                        showError(groupContainer, "Please select an option.");
                    }
                    valid = false;
                }
                return;
            }

            // Champ vide
            if (!field.value.trim()) {
                field.classList.add("input-error");
                showError(field, "This field is required.");
                valid = false;
                return;
            }

            // Built-in constraints (pattern/minlength/maxlength/type=url/email)
            if (field.checkValidity && !field.checkValidity()) {
                field.classList.add("input-error");
                showError(field, field.validationMessage || "Invalid value.");
                valid = false;
            }
        });

        return valid;
    }

     function showError(el, message) {
        const err = document.createElement("span");
        err.className = "error-msg";
        err.textContent = message;
        el.insertAdjacentElement("afterend", err);
    }

    //to step 2
       document.getElementById("next1").addEventListener("click", function () {
        if (!validateForm(form1)) return;

        currentRole = roleSelect.value;
        hideAll();

        if (currentRole === "participant") show(form2);
        else if (currentRole === "mentor")  show(form3);
        else if (currentRole === "staff")   show(form4);

        setStep(1);
    });

    //back to step 1
    ["back2", "back3", "back4"].forEach(id => {
        document.getElementById(id).addEventListener("click", function () {
            hideAll();
            show(form1);
            setStep(0);
        });
    });
    //step 2 to fnal
    //participant 
    document.getElementById("next2").addEventListener("click", function () {
        if (!validateForm(form2)) return;
        hideAll();
        show(final);
        setStep(2);
    });

    //mentor
    document.getElementById("next3").addEventListener("click", function () {
        if (!validateForm(form3)) return;
        hideAll();
        show(final);
        setStep(2);
    });

    //staff
    document.getElementById("next4").addEventListener("click", function () {
        if (!validateForm(form4)) return;
        hideAll();
        show(final);
        setStep(2);
    });

    //back
    document.getElementById("backFinal").addEventListener("click", function () {
        hideAll();

        if (currentRole === "participant") { show(form2); setStep(1); }
        else if (currentRole === "mentor") { show(form3); setStep(1); }
        else if (currentRole === "staff")  { show(form4); setStep(1); }
    });
    //submit
     document.getElementById("submitFinal").addEventListener("click", function () {
        const payload = {
            firstName: sanitizeString(document.getElementById("firstName").value, { maxLen: 80 }),
            lastName: sanitizeString(document.getElementById("lastName").value, { maxLen: 80 }),
            email: sanitizeEmail(document.getElementById("emailInput").value),
            phone: sanitizePhone(document.getElementById("phone").value),
            discordUsername: sanitizeString(document.getElementById("discordUsername").value, { maxLen: 64 }),
            university: sanitizeString(document.getElementById("university").value, { maxLen: 120 }),
            fieldOfStudy: sanitizeString(document.getElementById("fieldOfStudy").value, { maxLen: 120 }),
            role: sanitizeString(roleSelect.value, { maxLen: 20 })
        };

        if (payload.university === "") delete payload.university;
        if (payload.fieldOfStudy === "") delete payload.fieldOfStudy;

        if (currentRole === "participant") {
            payload.teamName = sanitizeString(document.getElementById("teamName").value, { maxLen: 80 });
            payload.tools = sanitizeString(document.getElementById("tools").value, { maxLen: 200 });
            payload.motivation = sanitizeString(document.getElementById("motivation").value, { maxLen: 300 });
            payload.expectations = sanitizeString(document.getElementById("expectations").value, { maxLen: 300 });
            payload.mainSkills = sanitizeString(document.getElementById("mainSkills").value, { maxLen: 200 });
            payload.skillLevel = sanitizeString(document.getElementById("skillLevelSelect").value, { maxLen: 20 });

            if (payload.teamName === "") delete payload.teamName;
            if (payload.expectations === "") delete payload.expectations;
            if (payload.mainSkills === "") delete payload.mainSkills;
        } else if (currentRole === "mentor") {
            payload.yearsExperience = sanitizeString(document.getElementById("yearsExperience").value, { maxLen: 40 });
            payload.linkedin = sanitizeString(document.getElementById("linkedin").value, { maxLen: 200 });
            payload.portfolio = sanitizeString(document.getElementById("portfolio").value, { maxLen: 200 });
            payload.expertiseArea = sanitizeString(document.getElementById("expertiseArea").value, { maxLen: 120 });
            payload.masteredTools = sanitizeString(document.getElementById("masteredTools").value, { maxLen: 200 });
            payload.mentoredBefore = sanitizeString(document.querySelector('input[name="mentored"]:checked')?.value, { maxLen: 10 });
            payload.availability = sanitizeString(document.getElementById("availabilityMentor").value, { maxLen: 120 });

            if (payload.portfolio === "") delete payload.portfolio;
            if (payload.expertiseArea === "") delete payload.expertiseArea;
            if (payload.masteredTools === "") delete payload.masteredTools;
        } else if (currentRole === "staff") {
            payload.preferredRole = sanitizeString(document.getElementById("preferredRole").value, { maxLen: 120 });
            payload.organizedBefore = sanitizeString(document.getElementById("organizedBefore").value, { maxLen: 10 }).toLowerCase();
            payload.availability = sanitizeString(document.getElementById("availabilityStaff").value, { maxLen: 120 });
        }
            
    });
});