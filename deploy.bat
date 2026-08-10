@echo off
echo === Building ===
rmdir /s /q out 2>nul
call npm run build
if errorlevel 1 exit /b %errorlevel%

echo === Deploying ===
cd out
rem kill stale .git that may have corrupt objects
rmdir /s /q .git 2>nul
copy nul .nojekyll >nul
git init
rem disable compression — large encrypted files are already high-entropy
git config core.compression 0
git config pack.compression 0
git config http.postBuffer 524288000
git checkout -b gh-pages
git add -A
git commit -m "deploy"
git push -f git@github.com:ser3nus/ser3nus-AIGC-gallery.git gh-pages

echo === Done ===
pause
