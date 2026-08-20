const internships = [
    {
        title: "Frontend Development Intern",
        company: "TechNova",
        domain: "Web Development",
        location: "Remote",
        duration: "3 Months"
    },

    {
        title: "UI/UX Design Intern",
        company: "DesignHub",
        domain: "UI/UX",
        location: "Chennai",
        duration: "2 Months"
    },

    {
        title: "AI/ML Intern",
        company: "InnovateAI",
        domain: "Artificial Intelligence",
        location: "Remote",
        duration: "3 Months"
    },

    {
        title: "Data Science Intern",
        company: "DataWorks",
        domain: "Data Science",
        location: "Bangalore",
        duration: "6 Months"
    },

    {
        title: "Cyber Security Intern",
        company: "SecureTech",
        domain: "Cyber Security",
        location: "Remote",
        duration: "4 Months"
    },

    {
        title: "Full Stack Developer Intern",
        company: "CodeCraft",
        domain: "Web Development",
        location: "Hyderabad",
        duration: "3 Months"
    },

    {
        title: "Product Designer Intern",
        company: "CreativeLabs",
        domain: "UI/UX",
        location: "Remote",
        duration: "3 Months"
    },

    {
        title: "Machine Learning Intern",
        company: "FutureAI",
        domain: "Artificial Intelligence",
        location: "Chennai",
        duration: "6 Months"
    }
];


const internshipList =
    document.getElementById("internshipList");

const searchInput =
    document.getElementById("search");

const domainFilter =
    document.getElementById("domain");

const emptyState =
    document.getElementById("emptyState");

const errorState =
    document.getElementById("errorState");

const retryButton =
    document.getElementById("retryButton");


function createInternshipCard(internship) {

    const article = document.createElement("article");

    article.className = "internship-card";

    article.innerHTML = `
        <span class="card-domain">
            ${internship.domain}
        </span>

        <h3>
            ${internship.title}
        </h3>

        <p class="company">
            ${internship.company}
        </p>

        <div class="card-details">

            <span>
                📍 ${internship.location}
            </span>

            <span>
                ⏱ ${internship.duration}
            </span>

        </div>

        <button
            type="button"
            class="apply-btn"
        >
            Apply Now
        </button>
    `;

    return article;
}


function displayInternships(data) {

    internshipList.innerHTML = "";

    emptyState.hidden = true;
    errorState.hidden = true;


    if (data.length === 0) {

        emptyState.hidden = false;

        return;
    }


    data.forEach((internship) => {

        const card =
            createInternshipCard(internship);

        internshipList.appendChild(card);

    });
}


function filterInternships() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedDomain =
        domainFilter.value;


    const filtered =
        internships.filter((internship) => {

            const matchesSearch =
                internship.title
                    .toLowerCase()
                    .includes(searchValue) ||

                internship.company
                    .toLowerCase()
                    .includes(searchValue);


            const matchesDomain =
                selectedDomain === "all" ||
                internship.domain === selectedDomain;


            return matchesSearch && matchesDomain;

        });


    displayInternships(filtered);
}


function loadInternships() {

    try {

        if (!Array.isArray(internships)) {
            throw new Error("Internship data is invalid.");
        }

        displayInternships(internships);

    } catch (error) {

        internshipList.innerHTML = "";

        emptyState.hidden = true;

        errorState.hidden = false;

        console.error(error);

    }
}


searchInput.addEventListener(
    "input",
    filterInternships
);


domainFilter.addEventListener(
    "change",
    filterInternships
);


retryButton.addEventListener(
    "click",
    loadInternships
);


loadInternships();