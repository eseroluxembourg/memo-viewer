#!/bin/bash

fresk=$1
memo_viewer=$2

pushd $fresk
node $memo_viewer/migrations/migrate.js
popd

rm -rf $memo_viewer/src/assets/_cards
ln -s $(pwd)/$fresk/_cards $(pwd)/$memo_viewer/src/assets

rm -rf $memo_viewer/src/assets/_links
ln -s $(pwd)/$fresk/_links $(pwd)/$memo_viewer/src/assets

rm -rf $memo_viewer/src/assets/_fresks
ln -s $(pwd)/$fresk/_fresks $(pwd)/$memo_viewer/src/assets

rm -rf $memo_viewer/src/assets/_pages
ln -s $(pwd)/$fresk/_pages $(pwd)/$memo_viewer/src/assets

rm -rf $memo_viewer/src/assets/styles/local.scss
ln -s $(pwd)/$fresk/assets/styles/local.scss $(pwd)/$memo_viewer/src/assets/styles/local.scss

rm -rf $memo_viewer/public/fonts
ln -s $(pwd)/$fresk/assets/fonts $(pwd)/$memo_viewer/public/

rm -rf $memo_viewer/public/cards
if [ -d $(pwd)/$fresk/cards ]; then
    ln -s $(pwd)/$fresk/cards $(pwd)/$memo_viewer/public
fi

rm -rf $memo_viewer/public/illustrations
if [ -d $(pwd)/$fresk/images/illustrations ]; then
    ln -s $(pwd)/$fresk/images/illustrations $(pwd)/$memo_viewer/public
fi

rm -rf $memo_viewer/src/assets/icons/card-number-icon.svg
ln -s $(pwd)/$fresk/images/icons/card-number-icon.svg $(pwd)/$memo_viewer/src/assets/icons/

rm -rf $memo_viewer/settings.json
ln -s $(pwd)/$fresk/settings.json $(pwd)/$memo_viewer/

rm -rf $memo_viewer/variants.json
ln -s $(pwd)/$fresk/variants.json $(pwd)/$memo_viewer/

rm -rf $memo_viewer/public/local
mkdir $memo_viewer/public/local

rm -rf $memo_viewer/public/local/logo
ln -s $(pwd)/$fresk/images/logo $(pwd)/$memo_viewer/public/local

rm -rf $memo_viewer/public/local/previews
ln -s $(pwd)/$fresk/images/previews $(pwd)/$memo_viewer/public/local

rm -rf $memo_viewer/public/local/unknown-card.png
ln -s $(pwd)/$fresk/images/unknown-card.png $(pwd)/$memo_viewer/public/local

rm -rf $memo_viewer/public/.htaccess
if [ -f $(pwd)/$fresk/.htaccess ]; then
    ln -s $(pwd)/$fresk/.htaccess $(pwd)/$memo_viewer/public
fi
