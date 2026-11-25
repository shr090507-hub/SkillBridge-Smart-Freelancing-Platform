// ======================================
// SKILLBRIDGE SMART FREELANCING PLATFORM
// ======================================

// Sample freelance jobs
const sampleJobs = [
    {
        id: 1,
        title: "Responsive Website Redesign",
        company: "Northstar Studio",
        category: "Web Design",
        budget: 650,
        skills: ["HTML", "CSS", "Responsive Design", "Figma"],
        description: "Redesign a business website for desktop, tablet and mobile."
    },
    {
        id: 2,
        title: "SEO Blog Writer",
        company: "BrightWords Media",
        category: "Content Writing",
        budget: 320,
        skills: ["Content Writing", "SEO", "Research", "Grammar"],
        description: "Write blog posts about technology and digital marketing."
    },
    {
        id: 3,
        title: "Product Data Entry Specialist",
        company: "DataNest Solutions",
        category: "Data Entry",
        budget: 180,
        skills: ["Data Entry", "Excel", "Typing"],
        description: "Enter product records into a spreadsheet."
    },
    {
        id: 4,
        title: "Social Media Design Pack",
        company: "PixelHouse",
        category: "Graphic Design",
        budget: 280,
        skills: ["Graphic Design", "Photoshop", "Canva", "Branding"],
        description: "Create social media designs for a business."
    },
    {
        id: 5,
        title: "Flutter Mobile App Prototype",
        company: "AppOrbit Labs",
        category: "App Development",
        budget: 1200,
        skills: ["Flutter", "Dart", "UI Design", "API Integration"],
        description: "Build a mobile application prototype."
    },
    {
        id: 6,
        title: "YouTube Video Editor",
        company: "CreatorCraft",
        category: "Video Editing",
        budget: 400,
        skills: ["Video Editing", "Premiere Pro", "Storytelling"],
        description: "Edit YouTube videos with transitions and effects."
    },
    {
        id: 7,
        title: "Frontend Website Developer",
        company: "WebWorks",
        category: "Web Design",
        budget: 900,
        skills: ["HTML", "CSS", "JavaScript", "React"],
        description: "Develop a modern frontend website."
    },
    {
        id: 8,
        title: "Logo and Brand Designer",
        company: "Creative Studio",
        category: "Graphic Design",
        budget: 500,
        skills: ["Logo Design", "Illustrator", "Branding"],
        description: "Design a logo and brand identity."
    },
    {
        id: 9,
        title: "Mobile App UI Designer",
        company: "TechVision",
        category: "App Development",
        budget: 750,
        skills: ["UI Design", "Figma", "Wireframing"],
        description: "Design user-friendly mobile app screens."
    },
    {
        id: 10,
        title: "Excel Data Assistant",
        company: "OfficePro",
        category: "Data Entry",
        budget: 250,
        skills: ["Excel", "Data Entry", "Typing"],
        description: "Organise and manage business data."
    }
];

// Load data from browser storage
let profile = JSON.parse(localStorage.getItem("skillbridgeProfile")) || {};

let savedJobs = JSON.parse(localStorage.getItem("skillbridgeSaved")) || [];

let appliedJobs = JSON.parse(localStorage.getItem("skillbridgeApplied")) || [];

let postedJobs = JSON.parse(localStorage.getItem("skillbridgePosted")) || [];

let jobs = [...sampleJobs, ...postedJobs];

// ======================================
// HELPER FUNCTIONS
// ======================================

// Convert skills into lowercase and remove extra spaces
function normalizeSkills(skills) {
    return skills
        .map(skill => skill.trim().toLowerCase())
        .filter(skill => skill !== "");
}

// Calculate skill match percentage
function calculateMatch(userSkills, requiredSkills) {

    const userSet = new Set(normalizeSkills(userSkills));

    const required = normalizeSkills(requiredSkills);

    const matchedSkills = required.filter(skill => userSet.has(skill));

    const percentage = required.length === 0
        ? 0
        : Math.round((matchedSkills.length / required.length) * 100);

    return {
        matchedSkills: matchedSkills,
        missingSkills: required.filter(skill => !userSet.has(skill)),
        matchPercentage: percentage
    };
}

// Get freelancer skills
function getUserSkills() {

    if (!profile.skills) {
        return [];
    }

    return profile.skills.split(",");
}

// Save data into localStorage
function saveData() {

    localStorage.setItem("skillbridgeProfile", JSON.stringify(profile));

    localStorage.setItem("skillbridgeSaved", JSON.stringify(savedJobs));

    localStorage.setItem("skillbridgeApplied", JSON.stringify(appliedJobs));

    localStorage.setItem("skillbridgePosted", JSON.stringify(postedJobs));
}

// ======================================
// PROFILE MANAGEMENT
// ======================================

const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", function(event) {

    event.preventDefault();

    profile = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        experience: document.getElementById("experience").value,
        skills: document.getElementById("skills").value,
        category: document.getElementById("preferredCategory").value,
        bio: document.getElementById("bio").value
    };

    saveData();

    document.getElementById("profileMessage").textContent =
        "Profile saved successfully! Your job matches are updated.";

    renderJobs();
    renderSavedJobs();
});

// Load saved profile into form
function loadProfile() {

    if (!profile.name) {
        return;
    }

    document.getElementById("name").value = profile.name || "";
    document.getElementById("email").value = profile.email || "";
    document.getElementById("phone").value = profile.phone || "";
    document.getElementById("experience").value = profile.experience || "";
    document.getElementById("skills").value = profile.skills || "";
    document.getElementById("preferredCategory").value = profile.category || "";
    document.getElementById("bio").value = profile.bio || "";
}

// ======================================
// DISPLAY JOBS
// ======================================

function renderJobs() {

    const container = document.getElementById("jobContainer");

    const searchTerm = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    const category = document.getElementById("categoryFilter").value;

    const sortType = document.getElementById("sortFilter").value;

    let filteredJobs = jobs.filter(job => {

        const text = (
            job.title + " " +
            job.company + " " +
            job.category + " " +
            job.skills.join(" ")
        ).toLowerCase();

        const matchesSearch = text.includes(searchTerm);

        const matchesCategory =
            category === "All" || job.category === category;

        return matchesSearch && matchesCategory;
    });

    // Sort jobs
    if (sortType === "budget") {

        filteredJobs.sort((a, b) => b.budget - a.budget);

    } else {

        filteredJobs.sort((a, b) => {

            const matchA = calculateMatch(getUserSkills(), a.skills).matchPercentage;

            const matchB = calculateMatch(getUserSkills(), b.skills).matchPercentage;

            return matchB - matchA;
        });
    }

    document.getElementById("jobCount").textContent =
        filteredJobs.length + " jobs found";

    container.innerHTML = "";

    if (filteredJobs.length === 0) {

        container.innerHTML =
            '<p class="empty">No jobs found. Try another search.</p>';

        return;
    }

    filteredJobs.forEach(job => {

        const result = calculateMatch(getUserSkills(), job.skills);

        const isSaved = savedJobs.includes(job.id);

        const isApplied = appliedJobs.includes(job.id);

        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `
            <span class="category">${job.category}</span>

            <h3>${job.title}</h3>

            <p><strong>${job.company}</strong></p>

            <p class="budget">$${job.budget}</p>

            <p>${job.description}</p>

            <p><strong>Required Skills:</strong></p>

            <p>${job.skills.join(", ")}</p>

            <div class="match">
                Smart Match: ${result.matchPercentage}%
            </div>

            <p>
                Matched: ${result.matchedSkills.join(", ") || "None"}
            </p>

            <p>
                Missing: ${result.missingSkills.join(", ") || "None"}
            </p>

            <button class="btn ${isSaved ? "saved" : ""}"
                    onclick="toggleSave(${job.id})">
                ${isSaved ? "Saved" : "Save Job"}
            </button>

            <button class="btn"
                    onclick="applyJob(${job.id})">
                ${isApplied ? "Applied" : "Apply"}
            </button>
        `;

        container.appendChild(card);
    });
}

// ======================================
// SEARCH AND FILTER
// ======================================

document.getElementById("searchInput").addEventListener("input", function() {

    sessionStorage.setItem("skillbridgeSearch", this.value);

    renderJobs();
});

document.getElementById("categoryFilter").addEventListener("change", renderJobs);

document.getElementById("sortFilter").addEventListener("change", renderJobs);

// Restore last search
document.getElementById("searchInput").value =
    sessionStorage.getItem("skillbridgeSearch") || "";

// ======================================
// SAVE AND UNSAVE JOBS
// ======================================

function toggleSave(jobId) {

    if (savedJobs.includes(jobId)) {

        savedJobs = savedJobs.filter(id => id !== jobId);

    } else {

        savedJobs.push(jobId);
    }

    saveData();

    renderJobs();

    renderSavedJobs();
}

// ======================================
// APPLY FOR JOB
// ======================================

function applyJob(jobId) {

    if (!profile.name) {

        alert("Please create your freelancer profile first.");

        location.href = "#profile";

        return;
    }

    if (appliedJobs.includes(jobId)) {

        alert("You have already recorded interest in this job.");

        return;
    }

    appliedJobs.push(jobId);

    saveData();

    renderJobs();

    alert("Your application interest has been recorded!");
}

// ======================================
// DISPLAY SAVED JOBS
// ======================================

function renderSavedJobs() {

    const container = document.getElementById("savedJobs");

    container.innerHTML = "";

    const savedList = jobs.filter(job => savedJobs.includes(job.id));

    if (savedList.length === 0) {

        container.innerHTML =
            '<p class="empty">You have not saved any jobs yet.</p>';

        return;
    }

    savedList.forEach(job => {

        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `
            <span class="category">${job.category}</span>
            <h3>${job.title}</h3>
            <p>${job.company}</p>
            <p class="budget">$${job.budget}</p>
            <button class="btn" onclick="toggleSave(${job.id})">
                Remove Saved Job
            </button>
        `;

        container.appendChild(card);
    });
}

// ======================================
// POST A NEW JOB
// ======================================

const jobForm = document.getElementById("jobForm");

jobForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newJob = {

        id: Date.now(),

        title: document.getElementById("jobTitle").value,

        company: document.getElementById("company").value,

        category: document.getElementById("jobCategory").value,

        budget: Number(document.getElementById("budget").value),

        skills: document.getElementById("requiredSkills")
            .value.split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== ""),

        description: document.getElementById("description").value
    };

    postedJobs.push(newJob);

    jobs.push(newJob);

    saveData();

    renderJobs();

    document.getElementById("jobMessage").textContent =
        "Job posted successfully!";

    jobForm.reset();
});

// ======================================
// INITIALIZE WEBSITE
// ======================================

loadProfile();

renderJobs();

renderSavedJobs();