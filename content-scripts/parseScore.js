console.log("parseScore.js is loaded!");

function doParseScore(name,subjects, sendResponse) {
    const bodyText = document.body.innerText;
    console.log(bodyText);
    const regex = getSubjectRegex(subjects);
    const matches = [...bodyText.matchAll(regex)];

    //可能是因为输入了不存在的姓名
    if (matches.length === 0) {
        console.log("没有找到匹配的成绩信息！");
        sendResponse({ status: "ERROR", detailMessage: "没有找到匹配的成绩信息！" ,result: {name:name,score:null}});
        return;
    }
    const results = matches.map(match => ({
        subject: match[1], // 科目名称
        score: match[2] // 成绩
    }));
    console.log("成绩查询结果：", results);
    sendResponse({ status: "OK", result: {name:name,score:results} }); 
    return;
}

// (?:^|\\s):
//      确保关键词前面是行首或空白字符。
// (${subjectsSet.join('|')}):
//      匹配 subjectsSet 数组中的任意一个关键词，并捕获为 match[1]。
// \\s*[：:]?\\s*:
//      匹配关键词后面的空白字符、冒号（可选）以及更多的空白字符。
// (\\d+(\\.\\d+)?|缺考|作弊):
//      匹配一个数字（整数或小数），或者匹配 缺考 或 作，并捕获为 match[2]。
// g 标志表示全局匹配
function getSubjectRegex(subjects) {
    const regexString = `(?:^|\\s)(${subjects.join('|')})\\s*[：:]?\\s*(\\d+(\\.\\d+)?|缺考|作弊)`;
    const regex = new RegExp(regexString, 'g');
    console.log("正则表达式：", regex);
    return regex;
}