@echo on
SETLOCAL ENABLEDELAYEDEXPANSION

:: 定义输出 ZIP 文件名
set OUTPUT=score-class-rank.zip

:: 定义要打包的内容
set FILES_TO_ZIP=_locales side_panel help content-scripts icon128.png manifest.json service-worker.js

:: 遍历文件列表并拼接成 PowerShell 可识别的逗号分隔字符串
set PATHS=
for %%F in (%FILES_TO_ZIP%) do (
    if not defined PATHS (
        set PATHS="%%F"
    ) else (
        set PATHS=!PATHS!,"%%F"
    )
)

:: 如果目标 ZIP 已存在，则加上时间戳备份
:: 获取当前日期时间并格式化
for /f "tokens=2 delims==." %%a in ('"wmic os get localdatetime /value"') do set datetime=%%a
set timestamp=%datetime:~0,8%_%datetime:~8,6%
if exist "%OUTPUT%" (
    :: 重命名旧文件
    ren "%OUTPUT%" "%OUTPUT%_%timestamp%.zip"
)

:: 打包文件
powershell -Command "Compress-Archive -Path %PATHS% -DestinationPath '%OUTPUT%'"

:: 输出完成信息
echo finish %OUTPUT%
pause