#!/bin/bash

rm -rf .nyc_output &&
rm -rf coverage &&
npm test
