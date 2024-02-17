#bin/bash

rm -rf dist.zip
grunt minify
zip -r dist.zip dist/
rm -rf dist