const advanceHref = document.getElementById("advanceHref");
const advanceDiv = document.getElementById("advanceDiv");

advanceHref.onclick = switchAdvanceDiv;

function switchAdvanceDiv() {
    if (advanceDiv.style.display === "none") {
        advanceDiv.style.display = "block";
    } else {
        advanceDiv.style.display = "none";
    }  
    return false;// 阻止默认跳转行为
}

// 构建班级列表DIV
function constructClassListDiv() {
    const classListDivContent = document.getElementById('classListDivContent');
    const rowHtml = document.getElementById('sampleRow').innerHTML;
    classListDivContent.innerHTML = '';  // 清空现有内容
    // 遍历班级，生成行
    classNamesInLocalStorage.classNames.forEach((item, idx) => {
        const row = document.createElement('div');
        row.innerHTML = rowHtml.replace('className', item.className);// 设置班级名
        row.style.display = 'flex';

        // 选择班级事件
        const classNameA = row.querySelectorAll('a')[0];
        classNameA.onclick = selectClass;

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


