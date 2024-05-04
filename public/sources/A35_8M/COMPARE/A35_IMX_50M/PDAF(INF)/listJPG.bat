cd /D "%~dp0"
attrib -s -h -r /s /d *.*
dir /b /a-d "*.jpg" > listImage.txt