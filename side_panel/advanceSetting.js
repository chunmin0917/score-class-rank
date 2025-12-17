const advanceHref = document.getElementById("advanceHref");
const advanceDiv = document.getElementById("advanceDiv");

advanceHref.onclick = switchAdvanceDiv;

function switchAdvanceDiv() {
    if (advanceDiv.style.display === "none") {
        advanceDiv.style.display = "block";
    } else {
        advanceDiv.style.display = "none";
    }  
    return false;// 阻止默认跳转行为
}

