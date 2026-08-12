const textarea = document.querySelector("textarea");
const button = document.querySelector(".analyze-btn");
const resultBox = document.getElementById("result");

button.addEventListener("click", analyzeThreat);

async function analyzeThreat() {

    const input = textarea.value.trim();

    if (!input) {

        alert("Please enter a suspicious email, URL, or message.");

        return;

    }

    resultBox.innerHTML = "Analyzing...";

    try {

        const response = await fetch("/.netlify/functions/analyze", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                prompt: input

            })

        });

        const data = await response.json();

        resultBox.innerHTML = `
            <h3>Threat Analysis</h3>
            <p>${data.result}</p>
        `;

    }

    catch(error){

        console.error(error);

        resultBox.innerHTML =
        "Something went wrong while analyzing.";

    }

}