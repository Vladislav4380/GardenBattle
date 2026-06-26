@echo off
cd /d "%~dp0"

echo Folder:
echo %cd%
echo.

echo Checking ImageMagick:
where magick
magick -version
echo.

echo Files:
dir /b
echo.

echo PNG files:
dir /b *.png
echo.

if not exist output mkdir output

for %%f in (*.png) do (
    echo Processing: %%f
    magick "%%f" -alpha on -fuzz 8%% -fill none -draw "color 1,1 floodfill" "output\%%~nf.png"
    echo ErrorLevel: %errorlevel%
)

echo.
echo Output:
dir /b output

pause