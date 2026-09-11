console.log("help.html is loaded");    
let subjectInLocalStorage = JSON.parse(localStorage.getItem(__KEYWORDS_FOR_SUBJECT__));
document.getElementById("subjectDIV").innerText ="'" + subjectInLocalStorage.subjects.join("', '") + "'";
