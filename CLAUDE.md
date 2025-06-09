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

## Push Workflow
When user says "push", follow this complete workflow:
1. Run `bun run build` to verify the code compiles without errors
2. Create a new feature branch with descriptive name
3. Stage and commit all changes with meaningful commit message
4. Push the branch to remote
5. Create a pull request using `gh pr create`