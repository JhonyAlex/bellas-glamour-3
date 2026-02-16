# Deployment Guide - Bellas Glamour

## Quick Start

```bash
./deploy.sh
```

That's it. The script does everything automatically.

---

## Step-by-Step: What to do BEFORE running the script

### 1. Make your changes locally
Edit files, add translations, fix bugs, etc.

Example:
```bash
# Edit a component
nano src/components/model-card.tsx

# Edit translations
nano src/locales/es.json

# Edit constants
nano src/lib/constants.ts
```

### 2. Verify it builds locally
```bash
npm run build
```

If you see errors, fix them before continuing.

### 3. Commit your changes to GitHub
```bash
git add .
git commit -m "Add feature or fix description"
git push origin main
```

### 4. Run the deploy script
```bash
./deploy.sh
```

The script will:
- ✓ Build locally (again)
- ✓ Create a tarball
- ✓ Upload via SCP
- ✓ Extract on server
- ✓ Restart Passenger
- ✓ Verify site is up

---

## What the script does automatically

1. **Checks for uncommitted changes** - Prevents accidents
2. **Builds locally** - Ensures no errors before upload
3. **Creates tarball** - Compresses .next, public, etc
4. **Uploads via SCP** - Sends to server
5. **Cleans old files** - Removes old .next/public
6. **Extracts safely** - Uses `--no-same-permissions` to avoid permission issues
7. **Copies .env.production** - Adds environment variables
8. **Touches tmp/restart.txt** - Tells Passenger to restart
9. **Verifies HTTP 200** - Confirms site is up

---

## Manual steps (if something goes wrong)

If the script fails, you can debug manually on the server:

```bash
# SSH into server
ssh -p 21098 -i C:/Users/jhony/Downloads/id_rsa otfidqlcuq@server5.shared.spaceship.host

# Check current status
cd /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3
ls -la .next/standalone/
ps aux | grep node

# Check Passenger logs
cat /var/log/messages  # or
tail -f /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3/log/production.log
```

---

## Troubleshooting

### "Permission denied" on SCP
Make sure you have the SSH key in: `C:/Users/jhony/Downloads/id_rsa`

### "Cannot mkdir" on tar
The script uses `--no-same-permissions --no-same-owner` to prevent this. If still happens:
```bash
ssh -p 21098 -i C:/Users/jhony/Downloads/id_rsa otfidqlcuq@server5.shared.spaceship.host
cd /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3
chmod -R u+rwx .next public
rm -rf .next public
```

Then run `./deploy.sh` again.

### Site returns HTTP 500
Check server logs:
```bash
ssh -p 21098 -i C:/Users/jhony/Downloads/id_rsa otfidqlcuq@server5.shared.spaceship.host
tail -50 /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3/log/production.log
```

---

## Database Migrations (if needed)

If you modify `schema.prisma`, you need to migrate manually:

```bash
# Locally
npx prisma migrate dev --name "your_migration_name"

# On server (after deploy)
ssh -p 21098 -i C:/Users/jhony/Downloads/id_rsa otfidqlcuq@server5.shared.spaceship.host
cd /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3
source /home/otfidqlcuq/nodevenv/bellasglamour.com/bellas-glamour-3/20/bin/activate
npx prisma migrate deploy
```

---

## Tips

- ✓ Always `git commit` before deploying
- ✓ Test locally with `npm run build` first
- ✓ The script checks for uncommitted changes to prevent accidents
- ✓ The script only works if you're on the `main` branch
- ✓ Keep your SSH key at `C:/Users/jhony/Downloads/id_rsa`

