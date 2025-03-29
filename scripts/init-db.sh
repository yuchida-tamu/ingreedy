#!/bin/bash

# Compile TypeScript
echo "Compiling TypeScript..."
npx tsc -p tsconfig.build.json && npx tsc-alias -p tsconfig.build.json

# Run the initialization script
echo "Initializing database..."
node -r tsconfig-paths/register -e "require('./dist/infrastructure/database/client.js').db.initialize().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); })" 