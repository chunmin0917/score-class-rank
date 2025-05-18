/**
 * depends on: sidePanel.js
 */
const CLASSNAMES = "classNames";
const keywordsforsubject_URL = "keywordsforsubject";
const keywordsforsubject = "keywordsforsubject";

loadAllConfig();

function loadAllConfig(){
    loadClassNames();
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