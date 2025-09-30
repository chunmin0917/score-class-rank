/**
 * depends on: sidePanel.js
 */
const __CLASSNAMES__ = "classNames";
const __KEYWORDS_FOR_SUBJECT_URL__ = "https://github.com/chunmin0917/score-class-rank/raw/refs/heads/main/content-scripts/keywordsforsubject.json";
const __KEYWORDS_FOR_SUBJECT__ = "keywordsforsubject";

loadAllConfig();

function loadAllConfig(){
    loadClassNames();
    loadSubjectFromLocal();
    loadSubjectFromUrlandSave();
}

function loadSubjectFromUrlandSave() {
    // Load keywords for subject from URL and save to local storage
    console.log("loadSubjectFromUrlandSave()");
    fetch(__KEYWORDS_FOR_SUBJECT_URL__)
        .then(response => response.json())
        .then(data => {
            keywordsforsubjectArray = data;
            localStorage.setItem(__KEYWORDS_FOR_SUBJECT__, JSON.stringify(data));
            console.log("keywordsforsubjectArray from URL:", keywordsforsubjectArray);
        })
        .catch(error => {
            console.error("Error loading keywords for subject:", error);
        });
}

function loadSubjectFromLocal() {
    console.log("loadSubjectFromLocal()");
    const subjects = localStorage.getItem(__KEYWORDS_FOR_SUBJECT__);
    if (subjects) {
        keywordsforsubjectArray =JSON.parse(subjects);
        console.log("keywordsforsubjectArray from local:", keywordsforsubjectArray);
    }      
}

function loadClassNames() {
    // Load class names from local storage
    console.log("loadClassNames() ");
    const classNames = localStorage.getItem(__CLASSNAMES__);
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
        localStorage.setItem(__CLASSNAMES__, classNamesTA.value);
    }
}