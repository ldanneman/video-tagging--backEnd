echo "<<<--TYPE GIT MESSAGE-->>>"
read message
git add -A
git commit -m $message
git push heroku master