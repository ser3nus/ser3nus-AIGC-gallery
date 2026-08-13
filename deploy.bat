@echo off
echo === Building ===
rmdir /s /q out 2>nul
call npm run build
if errorlevel 1 exit /b %errorlevel%

echo === Deploying ===
cd /d "%~dp0out"
:: kill stale .git with corrupt objects
rmdir /s /q .git 2>nul
copy nul .nojekyll 2>nul
git init
git config --local core.compression 0
git config --local pack.compression 0
git config --local http.postBuffer 524288000
git checkout -B gh-pages
git add --all
git commit -m "deploy"
git push -f git@github.com:ser3nus/ser3nus-AIGC-gallery.git gh-pages

echo === Done ===
pause
