#!/bin/sh
rm -rf android/app/src/main/res/drawable-hdpi/*
rm -rf android/app/src/main/res/drawable-mdpi/*
rm -rf android/app/src/main/res/drawable-xhdpi/*
rm -rf android/app/src/main/res/drawable-xxhdpi/*
rm -rf android/app/src/main/res/drawable-xxxhdpi/*

cd android/
./gradlew assembleRelease
cd ..
