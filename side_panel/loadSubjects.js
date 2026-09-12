/**
 * depends on other js files
 */
const KEYWORDS_FOR_SUBJECT_LOCALFILE ="keywordsforsubject.json";
const KEYWORDS_FOR_SUBJECT_URL = "https://gitee.com/chunmin0917/score-class-rank/raw/main/side_panel/"+KEYWORDS_FOR_SUBJECT_LOCALFILE;
const TIME_INTERVAL_FOR_FETCH_SUBJECT = 24*60*60*1000;// fetch subject from URL every 1 day
const SUBJECT_FROM_URL = "URL";
const SUBJECT_FROM_LOCALFILE ="LOCALFILE";
let  subjectInLocalStorage = {from:"", lastFetchedTime:new Date().toISOString(), subjects:[]};

loadSubjects();

function loadSubjects() {
    const subjectInLocalStorageStr = localStorage.getItem(__KEYWORDS_FOR_SUBJECT__);
    console.log("Subjects in localStrage are:", subjectInLocalStorageStr);
    if(needFetchSubject(subjectInLocalStorageStr)) {
        loadSubjectFromFile(SUBJECT_FROM_LOCALFILE);//local loading is much faster than URL loading
        loadSubjectFromFile(SUBJECT_FROM_URL);//URL loading is NOT relialble
    } else {
        setSubjectInputTitle();   
    }
}

function loadSubjectFromFile(fromSource) {
    let filePath ="";
    if(fromSource === SUBJECT_FROM_LOCALFILE) {
        console.log("fetch subjects from local file.");
        filePath = KEYWORDS_FOR_SUBJECT_LOCALFILE;
    }else if(fromSource === SUBJECT_FROM_URL) {
        console.log("fetch subjects from URL.");
        filePath = KEYWORDS_FOR_SUBJECT_URL;
    }

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            console.log("subjects fetched from file", fromSource, "are:", data);
            subjectInLocalStorage = {from:fromSource, lastFetchedTime:new Date().toISOString(), subjects:data};
            localStorage.setItem(__KEYWORDS_FOR_SUBJECT__,JSON.stringify(subjectInLocalStorage));
            setSubjectInputTitle();
        })
        .catch(error => {
            console.error("Error loading keywords for subject:", error);
        });
}


function needFetchSubject(subjectInLocalStorageStr) {
    if (subjectInLocalStorageStr){
        subjectInLocalStorage = JSON.parse(subjectInLocalStorageStr);
        if(subjectInLocalStorage.from && subjectInLocalStorage.from === SUBJECT_FROM_URL) {
            if(subjectInLocalStorage.lastFetchedTime) {
                const fetchTime = new Date(subjectInLocalStorage.lastFetchedTime).getTime();
                if (Math.abs(Date.now() - fetchTime) < TIME_INTERVAL_FOR_FETCH_SUBJECT) {
                    return false;
                }   
            }
        } 
    } 
    return true;    
}

function setSubjectInputTitle() {
    userDefinedSubujectInput.title = "如果成绩结果页面为'单元测试 98'，可以输入：'单元测试'作为自定义科目名称。默认支持的科目名称为："
    + subjectInLocalStorage.subjects
    +"。";
}
