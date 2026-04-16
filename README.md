# AR Learn

This project is an Ionic + React + Capacitor app.

## Save Every Version

Use this flow whenever you finish a small piece of work:

```powershell
git status
git add -A
git commit -m "Describe the change"
git push
```

Good commit message examples:

- `add ar library and viewer pages`
- `fix heart ar experience`
- `restore old opencv threejs heart viewer`

## First GitHub Setup

If this repo is not connected to GitHub yet:

```powershell
git remote -v
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

If `origin` already exists and you need to change it:

```powershell
git remote set-url origin https://github.com/YOUR_NAME/YOUR_REPO.git
```

## Helpful Commands

See changed files:

```powershell
git status
```

See commit history:

```powershell
git log --oneline --decorate --graph
```

Create a safe feature branch:

```powershell
git switch -c fix/short-name
```

Restore one file from an older commit:

```powershell
git checkout COMMIT_ID -- path/to/file
```

## Notes

- `node_modules`, `dist`, local `.env`, screenshots, and native build outputs are ignored.
- Commit `src`, `public`, `android`, and `ios` so the full app can be restored later.
