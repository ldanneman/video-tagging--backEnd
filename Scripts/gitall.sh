echo "<<<--TYPE GIT MESSAGE-->>>"
read message
git add -A
git commit -m $message
git push origin --all
git push heroku master