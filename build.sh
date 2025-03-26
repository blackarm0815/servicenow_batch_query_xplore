# eslint

echo
echo "eslint code.ts"
if npx eslint code.ts
then
  echo "done"
else
  exit
fi
echo

# transpile

echo "transpiling code.ts"
if npx tsc
then
  echo "done"
else
  exit
fi

# tidy up

grep -v '@ts-ignore' < code.js > foo.js
sed -r 's/    /  /g' < foo.js > code.js