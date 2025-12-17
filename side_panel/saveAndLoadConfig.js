/**
 * depends on: sidePanel.js`
 */
const __CLASSNAMES__ = "classNameAndMembers";
const __KEYWORDS_FOR_SUBJECT__ = "keywordsForSubjects";
const __USER_DEFINED_SUBJECT__ = "userDefinedSubjects";
const __WAITING_TIME_FOR_REFRESH__ = "waitingTimeForRefresh";
const KEYWORDS_FOR_SUBJECT_LOCALFILE ="keywordsforsubject.json";
const KEYWORDS_FOR_SUBJECT_URL = "https://gitee.com/chunmin0917/score-class-rank/raw/main/side_panel/"+KEYWORDS_FOR_SUBJECT_LOCALFILE;
const TIME_INTERVAL_FOR_FETCH_SUBJECT = 5*60*1000;// fetch subject from URL every 5 minutes
const SUBJECT_FROM_URL = "URL";
const SUBJECT_FROM_LOCALFILE ="LOCALFILE";
let  subjectInLocalStorage = {from:"", lastFetchedTime:new Date().toISOString(), subjects:[]};

userDefinedSubjectInput.onchange = saveUserDefinedSubjects;
waitingTimeForRefreshInput.onchange = saveWaitingTimeForRefresh;

loadAllConfig();

function loadAllConfig(){
    loadClassNames();
    loadUserDefinedSubjects();
    loadWaitingTimeForRefresh();
    if(needFetchSubject()) {
        loadSubjectFromLocalFile();
        loadSubjectFromUrl();
    } else {
        loadSubjectFromLocalStorage()
    }
}


function needFetchSubject() {
    if (localStorage.getItem(__KEYWORDS_FOR_SUBJECT__)) {
        subjectInLocalStorage = JSON.parse(localStorage.getItem(__KEYWORDS_FOR_SUBJECT__));
        if(subjectInLocalStorage.from && subjectInLocalStorage.from === SUBJECT_FROM_URL) {
            if(subjectInLocalStorage.lastFetchedTime) {
                const fetchTime = new Date(subjectInLocalStorage.lastFetchedTime).getTime();
                if ((Date.now() - fetchTime) < TIME_INTERVAL_FOR_FETCH_SUBJECT) {
                    return false;
                }   
            }
        } 
    } 
    return true;    
}

function loadSubjectFromLocalFile() {
    console.log("loadSubjectFromLocalFile()");
    fetch(KEYWORDS_FOR_SUBJECT_LOCALFILE)
        .then(response => response.json())
        .then(data => {
            if(needFetchSubject()) {
                keywordsforsubjectArray = data;
                saveSubjectInLocalStorage(SUBJECT_FROM_LOCALFILE, data);
                setSubjectInputTitle();
            }
            console.log("keywordsforsubjectArray from local:", data);
        })
        .catch(error => {
            console.error("Error loading keywords for subject:", error);
        });
}

function loadSubjectFromUrl() {
    // Load keywords for subject from URL
    console.log("loadSubjectFromUrl()");
    fetch(KEYWORDS_FOR_SUBJECT_URL)
        .then(response => response.json())
        .then(data => {
            keywordsforsubjectArray = data;
            saveSubjectInLocalStorage(SUBJECT_FROM_URL, data);
            setSubjectInputTitle();
            console.log("keywordsforsubjectArray from URL:", data);
        })
        .catch(error => {
            console.error("Error loading keywords for subject:", error);
        });
}

function loadSubjectFromLocalStorage() {
    console.log("loadSubjectFromLocalStorage()");
    subjectInLocalStorage = JSON.parse(localStorage.getItem(__KEYWORDS_FOR_SUBJECT__));
    keywordsforsubjectArray =subjectInLocalStorage.subjects;
    setSubjectInputTitle();   
}

function saveSubjectInLocalStorage(from, subjects) {
    subjectInLocalStorage = {from:from, lastFetchedTime:new Date().toISOString(), subjects:subjects};
    localStorage.setItem(__KEYWORDS_FOR_SUBJECT__,JSON.stringify(subjectInLocalStorage));
}

function setSubjectInputTitle() {
    userDefinedSubujectInput.title = "如果成绩结果页面为'单元测试 98'，可以输入：'单元测试'作为自定义科目名称。缺省支持的科目名称为："
    + keywordsforsubjectArray
    +"。";
}


function saveUserDefinedSubjects() {
    localStorage.setItem(__USER_DEFINED_SUBJECT__, userDefinedSubujectInput.value);
}

function loadUserDefinedSubjects() {
    const values = localStorage.getItem(__USER_DEFINED_SUBJECT__);
    if (values) {
        userDefinedSubujectInput.value = values;
    }   
}

function saveWaitingTimeForRefresh() {
    if(waitingTimeForRefreshInput.value.trim() === "") {
        localStorage.removeItem(__WAITING_TIME_FOR_REFRESH__);
        return;
    }
    let waitingTime = parseInt(waitingTimeForRefreshInput.value);
    if(isNaN(waitingTime) || waitingTime <2 || waitingTime >5) {
        alert("等待页面刷新时间取值范围为2-5秒，请重新输入！");
        return;
    }
    localStorage.setItem(__WAITING_TIME_FOR_REFRESH__, waitingTime);
    delay = waitingTime;
}

function loadWaitingTimeForRefresh() {
    const values = localStorage.getItem(__WAITING_TIME_FOR_REFRESH__);
    if (values) {
        waitingTimeForRefreshInput.value = values;
        delay = values;
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
    // console.log("saveClassName()");
    // let classNames = classNamesTA.value.split("\n").filter((name) => name.trim() !== "");
    // classNames = [...new Set(classNames)];
    // if (classNames.length > 0) {
    //     localStorage.setItem(__CLASSNAMES__, classNamesTA.value);
    // }
}