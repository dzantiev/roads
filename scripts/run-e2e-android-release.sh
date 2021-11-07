#!/bin/bash

npm run dev:test &

# METRO_BUNDLER_PID=$!

npm run test:debug

# DETOX_EXIT_CODE=$?

# kill $METRO_BUNDLER_PID

# exit $DETOX_EXIT_CODE
