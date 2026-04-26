#!/bin/bash
set -e

cd /Users/ryankolean/flytrap-website

echo "Installing dependencies with pnpm..."
pnpm install

echo "Building the Next.js project..."
pnpm build

echo "Checking TypeScript..."
pnpm typecheck

echo "Running linter..."
pnpm lint || true

echo "Build complete!"
