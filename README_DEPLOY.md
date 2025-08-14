# FITS Deployment Guide

This guide covers deploying the FITS project to AWS Amplify via GitHub.

## Prerequisites

- GitHub repository: https://github.com/MaxB-02/FITS
- AWS Amplify app configured
- Local project ready for deployment

## Deployment Steps

### 1. Set GitHub Repository Secret

1. Go to your GitHub repository: https://github.com/MaxB-02/FITS
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AMPLIFY_WEBHOOK_URL`
5. Value: Copy from Amplify Console (see step 2)

### 2. Get Amplify Webhook URL

1. Open AWS Amplify Console
2. Select your FITS app
3. Go to **App settings** → **Build settings**
4. Scroll to **Incoming webhooks**
5. Click **Create webhook**
6. Copy the webhook URL
7. Paste this URL as the `AMPLIFY_WEBHOOK_URL` secret in GitHub

### 3. Force-Push to GitHub

Run this command to replace the entire repository:

```bash
bash scripts/force_replace_repo.sh https://github.com/MaxB-02/FITS.git main
```

This will:
- Initialize git in the current directory
- Add all files
- Commit with message "Publish production-ready site"
- Force-push to the main branch

### 4. Automatic Deployment

Once you push to `main`:
1. GitHub Action will trigger automatically
2. Action calls Amplify webhook
3. Amplify starts building the site
4. Site goes live when build completes

## Environment Variables

Ensure these environment variables are configured in Amplify Console:

### Required
- `NEXTAUTH_SECRET` - Your NextAuth secret
- `NEXTAUTH_URL` - Your production URL
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password
- `SESSION_SECRET` - JWT session secret
- `BASE_URL` - Your production base URL

### Optional
- `RESEND_API_KEY` - For email notifications
- `BUSINESS_EMAIL` - Business email address

## Build Process

The build process uses npm for reliable builds:
1. Installs dependencies with `npm install`
2. Runs `npm run build` to build the Next.js app
3. Serves from `.next` directory
4. Caches build artifacts for faster subsequent builds

## Health Check

After deployment, verify the site is working:
- Main site: Your Amplify domain
- Health check: `{domain}/health` (should show "OK")
- Admin portal: `{domain}/admin` (login with configured credentials)

## Troubleshooting

- **Build fails**: Check Amplify build logs for Deno installation issues
- **Webhook not working**: Verify `AMPLIFY_WEBHOOK_URL` secret is set correctly
- **Environment variables**: Ensure all required vars are set in Amplify Console
- **Admin access**: Verify admin credentials are correctly configured

## Support

If you encounter issues:
1. Check Amplify build logs
2. Verify GitHub Action execution
3. Confirm environment variables are set
4. Test health endpoint: `{domain}/health` 