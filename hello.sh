# echo "What's your name?"
# read name
# echo "Hello there, $name!"
git add -A
echo "type git message"
read message
git commit -m $message
git push origin master