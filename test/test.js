const keywordsforsubject = [
    '语文', '数学', '英语', '物理', '化学', '道法', '历史', '生物', '政治', '地理',
    '道德与法治', '外语',
    '分数', '成绩', '总分'
];

// 修改正则表达式
const regexString = `(?:^|\\s)(${keywordsforsubject.join('|')})\\s*[：:]?\\s*(\\d+(\\.\\d+)?|缺考|作弊)`;
const regex = new RegExp(regexString, 'g');
console.log("正则表达式：", regex);

const bodyTexts = [];
bodyTexts.push(`             总分\t375`); // tab 分隔符
bodyTexts.push(`你好总分\t375`); // tab 分隔符
bodyTexts.push(`总分\t375`); // tab 分隔符
bodyTexts.push(`总分：375`); // 中文冒号
bodyTexts.push(`总分 375`); // 空格分隔符
bodyTexts.push(`总分 ： 375`);
bodyTexts.push(`总分\t\t \t ： 375`); 
bodyTexts.push(`总分
    375`);
bodyTexts.push(`总分	375
语文	87
数学	97
英语	107
历史	47
道法	37`);
bodyTexts.push(`陈朗汐
整体成绩
6
班级排名
373
总分
单科成绩
班名
6
47
排名
25.73
平均分
51
最高分
语文
86
16
排名
80.78
平均分
97
最高分
数学
104
1
排名
73.69
平均分
104
最高分
英语
89
15
排名
71.75
平均分
107
最高分
道法
40
19
排名
37.94
平均分
52
最高分
历史
48
3
排名
35.55
平均分
52
最高分
总分
367
6
排名
300.24
平均分
397
最高分
接龙管家
你也可以免费创建这样的接龙`);


for (const bodyText of bodyTexts) {
    console.log("文本内容：", bodyText);
    const matches = [...bodyText.matchAll(regex)];
    console.log("匹配结果数量：", matches.length);

    if (matches.length === 0) {
        console.log("没有找到匹配的成绩信息！");
    } else {
        const results = matches.map(match => ({
            subject: match[1], // 科目名称
            score: match[2] // 成绩
        }));
        // 显示结果
        for (const result of results) {
            console.log(`科目：${result.subject}，成绩：${result.score}`);
        }
    }
    console.log("");
}