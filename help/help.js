console.log("help.html is loaded");    
let subjectInLocalStorage = JSON.parse(localStorage.getItem("keywordsForSubjects"));
document.getElementById("subjectDIV").innerText ="'" + subjectInLocalStorage.subjects.join("', '") + "'";
