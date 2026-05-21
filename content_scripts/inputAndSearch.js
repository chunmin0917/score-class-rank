let inputElement;
let searchButton;

console.log("inputAndSearch.js is injected!");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //https://x4snq96d.yichafen.com/qz/150UHofcut
  console.log("the injected js receive message name:", request.name);
  console.log("the injected js receive message type:", request.messageType);

  if(request.messageType === "InputAndSearch") {
    doInputAndSearch (request.name, sendResponse);
  }

  if(request.messageType === "ParseScore") {
    doParseScore (request.name,request.subjects, sendResponse);
  }
  
});

function doInputAndSearch (name, sendResponse) {
  if (!isScoreSearchWebPage()) { 
    console.log("当前页面不是成绩查询页面！");
    sendResponse({ status: "ERROR", detailMessage: "当前页面不是成绩查询页面！" }); 
    return;
  }
  sendResponse({ status: "OK"}); 
  inputElement.value = name;
  searchButton.click();
}

function isScoreSearchWebPage() {
  // 查找页面中是否包含关键字“姓名”
  const bodyText = document.body.innerText;
  if (!bodyText.includes("姓名")) {
      console.log("页面不包含关键字 '姓名'");
      return false;
  }

  inputElement = findNameTextInput();
  console.log("inputElement：", inputElement);
  if (inputElement === null){
    return false;
  }

  searchButton = findSearchButton();
  console.log("searchButton：", searchButton);
  if (searchButton === null){
    return false;
  }

  return true;
}

function findNameTextInput() {
  //找到：姓名text input
  const inputElements = document.querySelectorAll('input[type="text"], input[type="search"]');
  console.log("查找姓名text input个数为："+inputElements.length);
  if (inputElements.length ===0) {
    return null;
  }else if (inputElements.length ===1) {
    return inputElements[0];
  } else {
    for (const [index, input] of inputElements.entries()) {
      if (isNameTextInput(input)) {
        console.log("找到目标输入框，退出循环");
        return input;
      }
    }
  }
  return null;
}

function isNameTextInput(nameInput) {
  if (
    (nameInput.placeholder && nameInput.placeholder.includes("姓名")) ||
    (nameInput.name && nameInput.name.includes("姓名"))
  ) {
    return true;
  }

  if (
    (nameInput.placeholder && nameInput.placeholder.toLowerCase().includes("name")) ||
    (nameInput.name && nameInput.name.toLowerCase().includes("name"))
  ) {
    return true;
  }

  if (nameInput.id) {
    const label = document.querySelector(`label[for="${nameInput.id}"]`);
    if (label && label.innerText.includes("姓名")) {
      return true;
    }
  }

  return false;
}

function findSearchButton() {
  //找到：查询按钮
  const buttonElements = document.querySelectorAll('input[type="button"], input[type="submit"], button');
  console.log("查询button的个数："+buttonElements.length);
  if (buttonElements.length ===0) {
    return null;
  }else if (buttonElements.length ===1) {
    return buttonElements[0];
  } else {
    for (const [index, button] of buttonElements.entries()) {
      if (isSearchButton(button)) {
        return button;
      }
    }
  }
  return null;
}

function isSearchButton(buttonElement) {
  // if (
  //   (buttonElement.value && buttonElement.value.includes("查询")) || // 检查 value 属性
  //   (buttonElement.innerText && buttonElement.innerText.includes("查询")) || // 检查 innerText
  //   (buttonElement.textContent && buttonElement.textContent.includes("查询")) // 检查 textContent
  // ) {
  //   return true;
  // }
  // return false;
  const value = (buttonElement.value || "").trim();
  const text = (buttonElement.innerText || buttonElement.textContent || "").trim();
  const keywordPattern = /查询|提交/;
  return keywordPattern.test(value) || keywordPattern.test(text);
}