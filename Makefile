SHELL := /bin/sh

.PHONY: dev build test lint typecheck

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck
