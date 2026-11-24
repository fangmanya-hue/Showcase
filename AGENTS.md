# Repository workflow

- Treat `https://github.com/fangmanya-hue/Showcase.git` as the canonical backup repository.
- After completing and verifying user-requested code changes, commit the relevant workspace changes and push them to `origin` unless the user explicitly asks not to push.
- Never commit secrets, local environment files, generated build output, databases, or credentials.
- Run the relevant automated checks before pushing and report the commit and push result to the user.
