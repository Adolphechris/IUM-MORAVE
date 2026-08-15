Branch protection setup (manual)

Repository: Adolphechris/IUM-MORAVE

Because API-based branch protection failed (requires higher plan for private repos), set protection manually:

1. Go to repository Settings -> Branches -> Branch protection rules -> Add rule
2. Pattern: main
3. Check options:
   - Require pull request reviews before merging (1)
   - Require status checks to pass before merging: add 'CI' (the GitHub Action name)
   - Require review from Code Owners
   - Include administrators (enforce)
   - Require linear history (optional)
4. Save changes

Notes:
- Ensure the workflow job name in .github/workflows/ci.yml is 'CI' so the status check name matches.
- Create required status checks after the first run of the workflow; then add them to the branch protection rule.
- Add teams/users as CODEOWNERS for automatic review assignments.
