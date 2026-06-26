@echo off
cd /d "%~dp0"

if not exist output_clean mkdir output_clean

for %%f in (*.png) do (
    echo Cleaning %%f

    magick "%%f" ^
        -alpha on ^
        -fuzz 12%% ^
        -fill none ^
        -draw "color 1,1 floodfill" ^
        -alpha extract ^
        -morphology erode square:1 ^
        -blur 0x0.5 ^
        -write mpr:mask ^
        +delete ^
        "%%f" ^
        mpr:mask ^
        -alpha off ^
        -compose CopyOpacity ^
        -composite ^
        "output_clean\%%~nf.png"
)

echo Done.
pause