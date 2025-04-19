#!/bin/bash

# Compile TypeScript
echo "Compiling TypeScript..."
npx tsc -p tsconfig.build.json && npx tsc-alias -p tsconfig.build.json

# Copy SQL file to dist
echo "Copying SQL files..."
mkdir -p dist/infrastructure/database
cp src/infrastructure/database/*.sql dist/infrastructure/database/

# Run the initialization script
echo "Initializing database..."
node -r tsconfig-paths/register -e "require('./dist/infrastructure/database/database-init.js').initializeDatabase().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); })" 