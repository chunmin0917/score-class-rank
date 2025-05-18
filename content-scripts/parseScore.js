console.log("parseScore.js is loaded!");

// 修改keywordsforsubject时，同时更新keywordsforsubject.json文件
const keywordsforsubject = [
    '语文', '数学', '英语', '物理', '化学', '道法','历史','生物', '政治', '地理', 
    '道德与法治', '外语',
    '分数', '成绩', '总分'
];

// (?:^|\\s):
//      确保关键词前面是行首或空白字符。
// (${keywordsforsubject.join('|')}):
//      匹配 keywordsforsubject 数组中的任意一个关键词，并捕获为 match[1]。
// \\s*[：:]?\\s*:
//      匹配关键词后面的空白字符、冒号（可选）以及更多的空白字符。
// (\\d+(\\.\\d+)?|缺考|作弊):
//      匹配一个数字（整数或小数），或者匹配 缺考 或 作弊，并捕获为 match[2]。
// g 标志表示全局匹配
const regexString = `(?:^|\\s)(${keywordsforsubject.join('|')})\\s*[：:]?\\s*(\\d+(\\.\\d+)?|缺考|作弊)`;

// 创建正则表达式对象
const regex = new RegExp(regexString, 'g');

function doParseScore(name, sendResponse) {
    const bodyText = document.body.innerText;
    console.log(bodyText);
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