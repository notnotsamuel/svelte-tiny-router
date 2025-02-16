# Release process

This document describes the process of releasing a new version of the project.

## Prerequisites

- [ ] The `main` branch is up-to-date with the `origin/main` branch.

## Steps

1. Create a new tag from the `main` branch.

```bash
git checkout main
git pull origin main
npm version patch -m "[bump] new version"
```

2. Push the new tag to the remote repository.

```bash
git push origin main --tags
```

3. Create a new release on GitHub.

4. Let the CI/CD pipeline do the rest.
