cd /D "%~dp0"
attrib -s -h -r /s /d *.*
forfiles /S /M *.png /C "cmd /c rename @file @fname.jpg"
@echo off
for /r "%~dp0" %%i in (.) do (
    @copy "%~dp0listJPG.bat" "%%i"
    if NOT %%i == %~dp0. (
        cd /D "%%i"
    	start /B CMD /C CALL "listJPG.bat"
    )
)
@echo on