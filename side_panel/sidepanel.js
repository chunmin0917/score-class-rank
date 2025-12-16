const doScratchButton = document.getElementById("doScratch");
const classNamesTA = document.getElementById("classNames");
const progressDIV = document.getElementById("progress");
const allResultDIV = document.getElementById("allResult");
const resultSummaryDIV = document.getElementById("resultSummary");
const personalScoreDIV = document.getElementById("personalScore");
const inputNameAgainDiv = document.getElementById("inputNameAgain");
const inputNameAgainButton = document.getElementById("inputNameAgainBtn");
const copyResultButton = document.getElementById("copyResult");
const userDefinedSubjectInput = document.getElementById("userDefinedSubujectInput");
let classNames=[];

//invalidName:  无效姓名，可能是因为输入了不存在的姓名
let resultSummary = {totalName:0, validName:0, invalidName:0,invalidNames:[]};
let subjectSummary = [];
let scoreResult =[];
let currentTabID;
let index=0;
const delay =2000;//在发出消息后，等待2秒消息完成，然后执行后续的操作
let searchPageURL;
let classNamesTAValueIsChanged = false;
let keywordsforsubjectArray = [];//科目关键词数组
let allsubjectArray;//用户自定义科目关键词数组+科目关键词数组

classNamesTA.onchange = checkClassNames;
copyResultButton.onclick = copyResultToClipboard;

doScratchButton.onclick = function () {
    if (!classNamesTAValueIsChanged) {
        if(!confirm(`输入的姓名没有改变，是否继续？`)) {
            return;
        }
    }
    index = 0;
    scoreResult = [];
    if(!checkClassNames()) {
        return;
    }
    console.log("the input names are:" +classNames);
    if(!confirm(`1.建议抓取过程中请勿进行其他操作\n2.预计需要时间${(classNames.length-index)*delay*2/1000}秒.请耐心等待\n是否继续？`)) {
        return;
    }
    setProgressDIVText();

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) {
            alert("未找到活动标签页，请确保当前标签页是成绩查询页面！");
            return;
        }
        currentTabID = tabs[0].id;
        console.log("currentTabID is ", currentTabID);
        searchPageURL = tabs[0].url;
        console.log("searchPageURL is ", searchPageURL);
        if (isInternalPage(searchPageURL)) {
            alert("当前页面不是成绩查询页面！");
            return;
        } 
        setButtonAndInputNameAgainDivStatus();
        setAllSubjectArray();
        if (classNames.length === 2 && classNames[0] === "DEBUG") {
            doDebugMode();
            return;
        }
        sendInputAndSearchMessage();
    });
    classNamesTAValueIsChanged = false;
};

function isInternalPage(url) {
    return url.startsWith('chrome://') ||
           url.startsWith('chrome-extension://') ||
           url.startsWith('edge://') ||
           url.startsWith('about:') ||
           url.startsWith('moz-extension://');
}

function checkClassNames() {
    classNamesTAValueIsChanged = true;
    classNames = classNamesTA.value.split("\n").filter((name) => name.trim() !== "");
    // 使用 Set 去重，并将结果转换回数组
    classNames = [...new Set(classNames)];
    for (let i = 0; i < classNames.length; i++) {
        if (classNames[i].length < 2 || classNames[i].length > 5) {
            alert(`第${i+1}行姓名"${classNames[i]}"长度不符合要求，请检查！长度应在2到5个字符之间。`);
            return false;
        }
    }
    if (classNames.length === 0) {
        alert("请输入至少一个姓名！");
        return false;
    }
    if (classNames.length > 100) {
        alert("姓名数量超过100个，请减少！");
        return false;
    }
    setProgressDIVText()
    return true;
}

function setProgressDIVText() {
    progressDIV.innerHTML = `
    当前进度 <span class="highlightblue">${index}/${classNames.length}</span>,
    剩余时间 <span class="highlightblue">${(classNames.length - index) * delay * 2 / 1000}秒</span>
    `;
    //progressDIV.innerText = `当前进度${index}/${classNames.length},剩余时间${(classNames.length-index)*delay*2/1000}秒`;
}

function sendInputAndSearchMessage() {
    console.log("index is ", index);
    chrome.tabs.sendMessage(
        currentTabID,
        {
            messageType: "InputAndSearch",
            name: classNames[index],
        },
        function (response) {
            console.log("Received the response message by InputAndSearch type: ", response);
            if (response.status === "ERROR") {
                alert(response.detailMessage);
                setButtonAndInputNameAgainDivStatus(true);
                return;
            }
            setTimeout(() => {
                console.log(`延迟 ${delay / 1000} 秒后执行`);
                sendParseScoreMessage();
            }, delay);
        }
    );
}

function sendParseScoreMessage() {
    console.log("index is ", index);
    chrome.tabs.sendMessage(
        currentTabID,
        {
            messageType: "ParseScore",
            name: classNames[index],
            subjects: allsubjectArray,
        },
        function (response) {
            console.log("Received the response message by ParseScore type: ", response);
            // if (response.status === "ERROR") {
            //     alert(response.detailMessage);
            //     rankResult.push("ERROR");
            // }else{
            //     rankResult.push(response.theResult);
            // }
            scoreResult.push(response.result);
            goBackToMainPage();
        }
    );
}

function goBackToMainPage() {
    chrome.tabs.update(currentTabID, { url: searchPageURL }, function() {
        console.log("地址已回到查询页面为:", searchPageURL);
    });
    index++;
    setProgressDIVText()
    if (index >= classNames.length) {
        index =0
        setButtonAndInputNameAgainDivStatus();
        parseRankResult();
        displayRankResult();
        copyResultToClipboard() ;
        if (typeof saveClassName === "function") {
            // 函数存在，可以安全调用
            saveClassName();
        } 
        return;
    }
    setTimeout(() => {
        console.log(`延迟 ${delay / 1000} 秒后执行`);
        sendInputAndSearchMessage();
    }, delay);
}

function copyResultToClipboard() {
     // 确保窗口处于焦点状态
     window.focus();

    let resultString = personalScoreDIV.innerText;
    navigator.clipboard.writeText(resultString).then(() => {
        console.log("抓取结果已成功复制到剪贴板！");
        alert("抓取完成，结果已经保存到了剪贴板，可以直接粘贴！");
    }).catch(err => {
        console.error("复制抓取结果到剪贴板失败：", err);
        alert("抓取完成，复制抓取结果到剪贴板失败！");
    });
}

function setButtonAndInputNameAgainDivStatus(failFlag) {
    if (doScratchButton.disabled) {
        classNamesTA.disabled = false;
        doScratchButton.disabled = false;
        doScratchButton.innerText = "开始抓取";
        if (!failFlag) {
            inputNameAgainDiv.style.display = "block";
        }
    } else {
        classNamesTA.disabled = true;
        doScratchButton.disabled = true;
        doScratchButton.innerText = "正在抓取...";
        inputNameAgainDiv.style.display = "none";
    }
}

function displayRankResult() {
    allResultDIV.style.display = "block";

    //display 抓取结果
    let resultSummaryString = '';
    resultSummaryString += `输入总姓名数：${resultSummary.totalName}<br>`;
    resultSummaryString += `抓取成功姓名数：${resultSummary.validName}<br>`;
    if (resultSummary.invalidName > 0) {
        resultSummaryString += `抓取失败姓名数：<span class="highlightred">${resultSummary.invalidName}</span>，`;
        resultSummaryString += `失败姓名：${resultSummary.invalidNames.join(",")}<br>`
    }
    resultSummaryDIV.innerHTML = resultSummaryString;

    displayPersonalScore([scoreResult[0]]);//显示第一个人的成绩
} 

function displayPersonalScore(personalScore) {
    let scoreString = '';
    for (let i = 0; i < personalScore.length; i++) {
        //scoreString += `${JSON.stringify(personalScore[i])}<br>`;
        
        scoreString += `姓名：${personalScore[i].name}<br>`;
        let oneScore = personalScore[i].score;
        if (oneScore === null) {
            scoreString += `成绩：未能抓取<br>`;
            scoreString += "<br>";
            continue;
        }
        for (let j = 0; j < oneScore.length; j++) {
            scoreString += `${oneScore[j].subject}:`;
            scoreString += `${oneScore[j].score}，`;
            scoreString += `名次：${oneScore[j].rank}，`;
            scoreString += `最高分：${subjectSummary[j].max}，`;
            scoreString += `最低分：${subjectSummary[j].min}，`;
            scoreString += `平均分：${subjectSummary[j].average}。`;
            scoreString += "<br>";
        }
        scoreString += "<br>";
    }
    personalScoreDIV.innerHTML = scoreString;
}

/*
主函数，解析成绩结果。
每个科目的成绩都存储在一个对象中，包含科目名称、最高分、最低分、平均分和成绩列表。
成绩列表是一个数组，包含每个学生的姓名和对应的分数和名次
todo:不使用scores.sort((a, b) => b.score - a.score); 在调用displayPersonalScore生成rank，科目名称、最高分、最低分、平均分，提高性能
*/
function parseRankResult() {
    resultSummary = {totalName:0, validName:0,invalidName:0,invalidNames:[]};
    subjectSummary = [];

    resultSummary.totalName = scoreResult.length;

    //初始化subjectSummary 和 needTotalSubject
    let needTotalSubject = true;//是否需要动态添加‘总分’科目
    for (let i = 0; i < scoreResult.length; i++) {
        let oneScore = scoreResult[i].score;
        if (oneScore === null) {
            continue;
        }
        let subjectLength = oneScore.length;
        for (let j = 0; j < subjectLength; j++) {
            let subject = oneScore[j].subject;
            subjectSummary.push({ subject:subject,max:null, min:null, average:null,scores: []});
            //判断是否需要添加‘总分’科目
            if (subject === '总分') needTotalSubject = false;
        }
        if (subjectLength === 1) needTotalSubject = false;
        if (needTotalSubject) {
            subjectSummary.push({ subject: '总分', max:null, min:null, average:null, scores: [] });
        }
        break;
    }

    //把各科分数放入subjectSummary.scores中
    for (let i = 0; i < scoreResult.length; i++) {
        let oneScore = scoreResult[i].score;
        if (oneScore === null) {//不存在的姓名
            resultSummary.invalidName++;
            resultSummary.invalidNames.push(scoreResult[i].name);
            continue;
        }

        let subjectLength = oneScore.length;
        let totalScore = 0;
        for (let j = 0; j < subjectLength; j++) {
            let score = oneScore[j].score;
            if(isNaN(parseFloat(score))){//缺考，作弊等情况
                continue;
            }
            subjectSummary[j].scores.push({ index: i, name: scoreResult[i].name, score: parseFloat(score)});
            if (needTotalSubject) {
                totalScore += parseFloat(score);
            }
        }
        if (needTotalSubject) {
            oneScore.push({ subject: '总分', score: totalScore });
            subjectSummary[subjectLength].scores.push({ index: i, name: scoreResult[i].name, score: totalScore });
        }
    }
    resultSummary.validName = resultSummary.totalName - resultSummary.invalidName ;

    // 计算每个科目的最高分、最低分和平均分，并生成名次
    for (let j = 0; j < subjectSummary.length; j++) {
        let scores = subjectSummary[j].scores;
        if (scores.length === 0) {
            continue;
        }
        // 按总分从高到低排序
        scores.sort((a, b) => b.score - a.score);
        subjectSummary[j].max = scores[0].score;
        subjectSummary[j].min = scores[scores.length - 1].score; 

        // 生成名次（处理并列情况）
        let rank = 1;
        let sum =0;
        for (let i = 0; i < scores.length; i++) {
            sum += scores[i].score;
            if (i > 0 && scores[i].score < scores[i - 1].score) {
                rank = i + 1; // 更新名次
            }
            let nameIndex = scores[i].index;
            scoreResult[nameIndex].score[j].rank = rank;
        }
        subjectSummary[j].average = (sum / scores.length).toFixed(1); 
    }
}

// Debug Mode 下， 主页直接是classNames[1]成绩查询结果页面
function doDebugMode() {
    console.log("Debug mode is activated.");
    classNames.shift(); // 移除第一个元素 'DEBUG'
    sendParseScoreMessage();
}

const maxInputNameAgainTimes = 3;//最多容许查询次数
let inputNameAgainTimes = 0;
inputNameAgainButton.onclick = function () {
    let inputNameAgain = document.getElementById("inputNameAgainInput").value;
    if (inputNameAgain.trim() === "") {
        alert("请输入至少一个姓名！");
        return;
    }
    let inputNameAgainArray = inputNameAgain.split(" ").filter((name) => name.trim() !== "");
    // 使用 Set 去重，并将结果转换回数组
    inputNameAgainArray = [...new Set(inputNameAgainArray)];
    if (inputNameAgainArray.length > 3) {
        alert("输入的姓名超过3个，请重新输入！");
        return;
    }
    if (inputNameAgainArray.length === 1&&inputNameAgainArray[0]=== "ALL") {//for debug
        displayPersonalScore(scoreResult);
        return;
    }
    if (inputNameAgainTimes >= maxInputNameAgainTimes) {
        alert(`查询次数超过${maxInputNameAgainTimes}次,不容许再次查询了！`);
        return;
    }
    
    inputNameAgainTimes++;
    let personalScore = [];
    for (let i = 0; i < inputNameAgainArray.length; i++) {
        let name = inputNameAgainArray[i].trim();
        for (let j = 0; j < scoreResult.length; j++) {
            if (scoreResult[j].name === name) {
                personalScore.push(scoreResult[j]);
                break;
            }
        }
    }
    if (personalScore.length === 0) {
        alert("没有查询到该姓名的成绩，请重新输入姓名！");
        return;
    }
    displayPersonalScore(personalScore);
}

showExtentionSource();
function showExtentionSource() {
    //debugger; // 这会自动触发断点
    const extensionId = chrome.runtime.id;
    const officialId = "niddenggcmdgoijjcopoehlpmbjokmok";
    if (extensionId != officialId) {
       // 获取第一个 h1 元素
        const h1 = document.querySelector('h1');
        // 在原有内容后添加内容
        h1.innerHTML += '（Local）';
    } 
}

function setAllSubjectArray() {
    let theArray = [];
    if (userDefinedSubjectInput.value.trim() != "") {
        theArray = userDefinedSubjectInput.value.split(" ").filter((subject) => subject.trim() !== "");
    }
    theArray = theArray.concat(keywordsforsubjectArray);
    // 使用 Set 去重，并将结果转换回数组
    allsubjectArray = [...new Set(theArray)];
    console.log("allsubjectArray:", allsubjectArray);
}
