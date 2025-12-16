const advanceBtn = document.getElementById("advanceBtn");
const advanceDiv = document.getElementById("advanceDiv");

advanceBtn.onclick = switchAdvanceDiv;

function switchAdvanceDiv() {
    if (advanceDiv.style.display === "none") {
        advanceDiv.style.display = "block";
    } else {
        advanceDiv.style.display = "none";
    }   
}

