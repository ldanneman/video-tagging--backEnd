git add -A
echo "type git message"
read message
git commit -m $message
git push origin --all