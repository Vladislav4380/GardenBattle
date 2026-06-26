@echo off
cd /d "%~dp0"

if not exist output mkdir output

for %%f in (*.png) do (
    echo Processing %%f

    magick "%%f" ^
        -alpha on ^
        -fuzz 5%% ^
        -fill none ^
        -draw "color 1,1 floodfill" ^
        "output\%%~nf.png"
)

echo Done.
pause