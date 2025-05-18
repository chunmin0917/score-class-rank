/**
 * depends on: sidePanel.js
 */
const CLASSNAMES = "classNames";
const KEYWORDS_FOR_SUBJECT_URL = "https://github.com/chunmin0917/score-class-rank/raw/refs/heads/main/content-scripts/keywordsforsubject.json";
const KEYWORDS_FOR_SUBJECT = "keywordsforsubject";

loadAllConfig();
function loadAllConfig(){
    loadClassNames();
    loadSubjectFromLocal();
    loadSubjectFromUrlandSave();
}

function loadSubjectFromUrlandSave() {
    // Load keywords for subject from URL and save to local storage
    console.log("loadSubjectFromUrlandSave()");
    fetch(chrome.runtime.getURL(KEYWORDS_FOR_SUBJECT_URL))
        .then(response => response.json())
        .then(data => {
            keywordsforsubjectArray = data;
            localStorage.setItem(KEYWORDS_FOR_SUBJECT, data);
        })
        .catch(error => {
            console.error("Error loading keywords for subject:", error);
        });
}

function loadSubjectFromLocal() {
    console.log("loadSubjectFromLocal()");
    const subjects = localStorage.getItem(KEYWORDS_FOR_SUBJECT);
    if (subjects) {
        keywordsforsubjectArray =subjects;
    }      
}

function loadClassNames() {
    // Load class names from local storage
    console.log("loadClassNames() ");
    const classNames = localStorage.getItem(CLASSNAMES);
    if (classNames) {
        classNamesTA.value = classNames;
        classNamesTAValueIsChanged = true;
    }      
}

function saveClassName() {
    // Save class name to local storage
    console.log("saveClassName()");
    let classNames = classNamesTA.value.split("\n").filter((name) => name.trim() !== "");
    classNames = [...new Set(classNames)];
    if (classNames.length > 0) {
        localStorage.setItem(CLASSNAMES, classNamesTA.value);
    }
}