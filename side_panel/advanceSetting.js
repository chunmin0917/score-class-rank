const __CLASSNAMES__ = "classNameAndMembers";
const __USER_DEFINED_SUBJECT__ = "userDefinedSubjects";
const __WAITING_TIME_FOR_REFRESH__ = "waitingTimeForRefresh";
const CLASSNAME_NA = "";//"N/A"; // not available
//{"classNames":[{"className":"陈多多的班级","members":["陈多多","陈欢欢","陈豆豆"]}]}
let  classNamesInLocalStorage = {classNames:[]} ;

const advanceHref = document.getElementById("advanceHref");
const advanceDiv = document.getElementById("advanceDiv");
const classListDivContent = document.getElementById('classListDivContent');
const classRowTemplate = document.getElementById('classListTemplate');

userDefinedSubjectInput.onchange = saveUserDefinedSubjects;
waitingTimeForRefreshInput.onchange = saveWaitingTimeForRefresh;
saveClassNamesBtn.onclick = saveClass;
advanceHref.onclick = switchAdvanceDiv;

loadAllConfig();

function loadAllConfig(){
    loadAllClassNames();
    loadUserDefinedSubjects();
    loadWaitingTimeForRefresh();
}

function switchAdvanceDiv() {
    if (advanceDiv.style.display === "none") {
        advanceDiv.style.display = "block";
    } else {
        advanceDiv.style.display = "none";
    }  
    return false;// 阻止默认跳转行为
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
    if(CLASSNAME_NA !== theFirstClassName.className) {
        constructClassListDiv();
        classListDiv.style.display = "block";
    }
}

//when click save class button
function saveClass() {
    if(!checkStudentNames()) return;
    const classname = promptClassName(studentNames[0] + "的班级");
    if (!classname) return;
    if(classNamesInLocalStorage.classNames.length ===1 && classNamesInLocalStorage.classNames[0].className === CLASSNAME_NA) {
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
        classNamesInLocalStorage.classNames.push({className:CLASSNAME_NA, members:studentNames});
        localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
        return;
    }

    if(classNamesInLocalStorage.classNames.length ===1 && classNamesInLocalStorage.classNames[0].className === CLASSNAME_NA) {
        classNamesInLocalStorage.classNames[0].members = studentNames;
        localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
        return;
    }   
}



// 构建班级列表DIV
function constructClassListDiv() {
    classListDivContent.innerHTML = '';  // 清空现有内容
    // 遍历班级，生成行
    classNamesInLocalStorage.classNames.forEach((item, idx) => {
        const row = classRowTemplate.content.cloneNode(true);

        // 选择班级事件
        const classNameA = row.querySelectorAll('a')[0];
        classNameA.textContent = item.className;
        classNameA.onclick = selectClass;

        // 设置人数
        const classNumber = row.querySelectorAll('span')[1];//第二个span
        classNumber.textContent = item.members.length+"人";

        // 重命名事件
        const renameA = row.querySelectorAll('a')[1];
        renameA.onclick = renameClass;

        // 删除事件
        const deleteA = row.querySelectorAll('a')[2];
        deleteA.onclick = deleteClass;
        
        classListDivContent.appendChild(row);
    });
}

function selectClass(e) {
    e.preventDefault();
    const className = e.target.closest('div').querySelectorAll('a')[0].textContent;
    for (let i = 0; i < classNamesInLocalStorage.classNames.length; i++) {
        const item = classNamesInLocalStorage.classNames[i];
        if (item.className === className) {
            studentNamesTA.value = item.members.join("\n");
            studentNamesTAValueIsChanged = true;
            break;
        }
    }
}

function promptClassName(theDefaultName) {
    const classname = prompt("请输入班级名字：", theDefaultName);
    if (classname === null ) {
        return;
    }
    if (classname.trim() === "") {
        alert("班级名字不能为空，请重新输入！");
        return;
    }
    if (classname.length>10) {
        alert("班级名字不能超过10个字符，请重新输入！");
        return;
    }
    for (let i = 0; i < classNamesInLocalStorage.classNames.length; i++) {
        if (classNamesInLocalStorage.classNames[i].className === classname.trim()) {
            alert("班级名字已存在，请重新输入！");
            return;
        }
    }
    return classname.trim();
}

function renameClass(e) {
    e.preventDefault();
    const className = e.target.closest('div').querySelectorAll('a')[0].textContent;
    const newName = promptClassName(className);
    if (!newName) return;
    for (let i = 0; i < classNamesInLocalStorage.classNames.length; i++) {
        const item = classNamesInLocalStorage.classNames[i];
        if (item.className === className) {
            item.className = newName;
            localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
            constructClassListDiv();
            break;
        }
    }
}

function deleteClass(e) {
    e.preventDefault();
    const className = e.target.closest('div').querySelectorAll('a')[0].textContent;
    if(confirm('确定要删除该班级“' + className + '”吗？')) {
        for (let i = 0; i < classNamesInLocalStorage.classNames.length; i++) {
            const item = classNamesInLocalStorage.classNames[i];   
            if (item.className === className) {
                classNamesInLocalStorage.classNames.splice(i, 1);
                localStorage.setItem(__CLASSNAMES__, JSON.stringify(classNamesInLocalStorage));
                constructClassListDiv();
                break;
            }
        }
        if(classNamesInLocalStorage.classNames.length ===0) {
            classListDiv.style.display = "none";
        }
    }  
}


