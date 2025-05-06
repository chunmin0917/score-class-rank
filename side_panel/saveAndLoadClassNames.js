/**
 * depends on: sidePanel.js
 */
console.log("saveAndLoadClassNames.js loaded");
loadClassNames();

function loadClassNames() {
    // Load class names from local storage
    console.log("loadClassNames() ");
    const classNames = localStorage.getItem('classNames');
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
        localStorage.setItem('classNames', classNamesTA.value);
    }
}