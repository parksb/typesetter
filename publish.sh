#!/bin/sh

GIVEN_PATH=$1
FORMAT=$2

BASENAME=${GIVEN_PATH##*/}
FILENAME="${BASENAME%%.*}"

if [ -z "$FILENAME" ]; then
  exit 1
fi

mkdir -p html
mkdir -p pdf

if [ -z "$FORMAT" ]; then
  ./publish.sh "$FILENAME" html && ./publish.sh "$FILENAME" pdf
elif [ "$FORMAT" = "html" ]; then
  echo "> HTML"
  npm run build -- "$FILENAME"
elif [ "$FORMAT" = "pdf" ]; then
  echo "> PDF"
  wkhtmltopdf -L 26 -R 26 -T 26 -B 26 --javascript-delay 5000 html/"$FILENAME".html pdf/"$FILENAME".pdf
else
  echo "unknwon format"
fi
