/**
 * depends on other js files
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
const NA = "";//"N/A"; // not available
let  subjectInLocalStorage = {from:"", lastFetchedTime:new Date().toISOString(), subjects:[]};
//{"classNames":[{"className":"陈多多的班级","members":["陈多多","陈欢欢","陈豆豆"]}]}
let  classNamesInLocalStorage = {classNames:[]} ;

userDefinedSubjectInput.onchange = saveUserDefinedSubjects;
waitingTimeForRefreshInput.onchange = saveWaitingTimeForRefresh;
saveClassNamesBtn.onclick = saveClass;

loadAllConfig();

function loadAllConfig(){
    loadAllClassNames();
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


function loadAllClassNames() {
    // Load class names from local storage
    console.log("loadAllClassNames() ");
    if (!localStorage.getItem(__CLASSNAMES__)) return;
    classNamesInLocalStorage = JSON.parse(localStorage.getItem(__CLASSNAMES__));   
    if(classNamesInLocalStorage.classNames.length ===0) return;
    const theFirstClassName = classNamesInLocalStorage.classNames[0];
    studentNamesTA.value = theFirstClassName.members.join("\n");
    studentNamesTAValueIsChanged = true;
    if(NA !== theFirstClassName.className) {
        constructClassListDiv();
        classListDiv.style.display = "block";
    }
}

//when click save class button
function saveClass() {
    if(!checkStudentNames()) return;
    const classname = promptClassName(studentNames[0] + "的班级");
    if (!classname) return;
    if(classNamesInLocalStorage.classNames.length ===1 && classNamesInLocalStorage.classNames[0].className === NA) {
        classNamesInLocalStorage.classNames.pop();//remove the default one
    }   
    classNamesInLocalStorage.classNames.push({className: classname, members: studentNames});
    localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
    constructClassListDiv();
    classListDiv.style.display = "block";
}

/**
 * when finish doing scratch,
 * if no class saved yet, save the current one with default class name NA = ""
 * */
function saveClassIfNecessary() {
    if(classNamesInLocalStorage.classNames.length ===0) {
        classNamesInLocalStorage.classNames.push({className:NA, members:studentNames});
        localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
        return;
    }

    if(classNamesInLocalStorage.classNames.length ===1 && classNamesInLocalStorage.classNames[0].className === NA) {
        classNamesInLocalStorage.classNames[0].members = studentNames;
        localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
        return;
    }   
}