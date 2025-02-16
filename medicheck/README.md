
## Running locally

Rename `.env.example` to `.env.local`

Set Open AI And postgres API keys

```bash
pnpm install

# Database migrations need to be run before the application can work properly.
pnpm tsx lib/db/migrate.ts && pnpm run build
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).
