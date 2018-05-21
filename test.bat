echo off

if exist .nyc_output (
  rmdir /S /Q .nyc_output
)

if exist coverage (
  rmdir /S /Q coverage
)

npm test

