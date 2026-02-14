@echo off
chcp 65001
cls

echo ========================================================
echo 🚀 Withle 프로젝트 배포 업데이트 도구
echo ========================================================
echo.

:: 1. Git 상태 확인
echo [1/3] 변경 변경 사항을 확인합니다...
git status
echo.

:: 2. 사용자 확인
set /p confirm="위 변경사항을 GitHub에 업로드하고 배포하시겠습니까? (Y/N): "
if /i "%confirm%" neq "Y" goto :EXIT

:: 3. Git 명령 실행
echo.
echo [2/3] 변경 사항을 스테이징(Add)합니다...
git add .

echo [3/3] 커밋(Commit) 및 푸시(Push)를 진행합니다...
set "timestamp=%date% %time%"
git commit -m "Update: %timestamp%"
git push origin main

echo.
echo ========================================================
echo ✅ GitHub 업로드 완료!
echo 🚀 Vercel에서 자동으로 배포가 시작되었습니다.
echo 잠시 후 https://withle.vercel.app/ 에서 확인하세요.
echo ========================================================
pause
exit

:EXIT
echo 배포가 취소되었습니다.
pause
