# Project Rules

## Build System
- This project uses Bun as its JavaScript runtime and package manager
- Use `bun` commands instead of `npm` or `yarn`
- For example: `bun install`, `bun run dev`, `bun test`, etc.
- IMPORTANT: Never run `bun run dev` - the user will always run this command themselves

## Git Workflow
- Always create feature branches for new work
- Use descriptive branch names like `feature/feature-name`
- Never push directly to main branch
- Create pull requests for all changes