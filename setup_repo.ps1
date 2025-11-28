Write-Host "Initializing Git Repository..."
git init
git add .
git commit -m "Initial commit - Banpreset Web"
git branch -M main

Write-Host "Setting remote to https://github.com/justinmakabe/banpreset-web.git"
# Try to remove origin if it exists to avoid errors
try { git remote remove origin 2>$null } catch {}
git remote add origin https://github.com/justinmakabe/banpreset-web.git

Write-Host "Pushing to GitHub..."
Write-Host "Note: You may be asked to sign in to GitHub."
git push -u origin main

Write-Host "Done!"
Pause
