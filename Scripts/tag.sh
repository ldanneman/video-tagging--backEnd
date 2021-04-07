

echo "<<<--TYPE VERSION NUMBER-->>>"
read version
git add -A
git commit -m $version
git tag -a v$version -m $version
git push origin v$version

