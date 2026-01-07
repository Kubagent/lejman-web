# Cloudflare Pages Deployment Guide

This guide will help you deploy your Next.js portfolio website to Cloudflare Pages with password protection via Cloudflare Access (Zero Trust).

## Prerequisites

- A Cloudflare account (free tier is sufficient)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Sanity CMS project set up and configured

## Part 1: Deploy to Cloudflare Pages

### Step 1: Connect Your Repository

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** in the left sidebar
3. Click **Create application** → **Pages** → **Connect to Git**
4. Authorize Cloudflare to access your Git provider
5. Select your repository from the list

### Step 2: Configure Build Settings

Use the following build configuration:

- **Production branch**: `main` (or your default branch)
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave empty)
- **Node version**: `18` or higher

### Step 3: Configure Environment Variables

Add the following environment variables in the Cloudflare Pages dashboard:

**Required Variables:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xcwag9wn
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-site.pages.dev
```

**Optional Variables (add when ready):**
```
SANITY_API_READ_TOKEN=your_token_here
CLOUDFLARE_TURNSTILE_SECRET=your_secret_here
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
RESEND_API_KEY=your_resend_key_here
```

### Step 4: Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be available at `https://your-project-name.pages.dev`

## Part 2: Set Up Password Protection (Cloudflare Access)

Cloudflare Access provides a professional login page that protects your entire site. The free tier supports up to 50 users.

### Step 1: Enable Cloudflare Access

1. In your Cloudflare Dashboard, go to **Zero Trust** (in the left sidebar)
2. If this is your first time, you'll need to:
   - Choose a team name (e.g., `lejman-art`)
   - This creates your Zero Trust dashboard at `https://your-team.cloudflareaccess.com`

### Step 2: Create an Access Application

1. In Zero Trust dashboard, navigate to **Access** → **Applications**
2. Click **Add an application**
3. Select **Self-hosted**
4. Configure the application:

   **Application Configuration:**
   - **Application name**: `Portfolio Website`
   - **Session Duration**: `24 hours` (or your preference)
   - **Application domain**:
     - Type: `Subdomain`
     - Domain: `your-project-name.pages.dev`
     - Path: Leave empty (protects entire site)

5. Click **Next**

### Step 3: Create Access Policy

Configure who can access your site:

**Policy name**: `Authorized Users`

**Action**: `Allow`

**Configure rules** - Choose one of these options:

**Option A: One-Time PIN (Easiest)**
- **Include**: `Emails`
- Add email addresses of people who should have access
- They'll receive a PIN code to their email each time they log in

**Option B: Password Authentication**
- Requires setting up an identity provider
- **Include**: `Emails` → Add authorized email addresses

**Option C: Public Access with Password**
- Use the **Cloudflare Access** → **Service Tokens** for a shared password approach
- Or use one-time PINs sent to a specific email list

6. Click **Next** → **Add application**

### Step 4: Test Access Protection

1. Open your site in an incognito/private browser window: `https://your-project-name.pages.dev`
2. You should see the Cloudflare Access login page
3. Enter an authorized email address
4. Check your email for the one-time PIN
5. Enter the PIN to access your site

### Step 5: Customize Access Login Page (Optional)

1. Go to **Settings** → **Custom Pages** in Zero Trust dashboard
2. Customize the login page with your branding:
   - Logo
   - Background color
   - Custom text
   - Header/footer links

## Part 3: Managing Access

### Add/Remove Users

1. Go to **Access** → **Applications**
2. Click on your **Portfolio Website** application
3. Edit the policy under the **Policies** tab
4. Add or remove email addresses as needed
5. Click **Save**

### View Access Logs

1. Navigate to **Logs** → **Access** in Zero Trust dashboard
2. See who accessed your site and when

### Temporary Access Links (Optional)

You can create temporary access tokens for specific users:

1. Go to **Access** → **Service Auth**
2. Create a **Service Token**
3. Share the token with users who need temporary access

## Part 4: Custom Domain (Optional)

If you want to use your own domain instead of `.pages.dev`:

### Step 1: Add Custom Domain in Cloudflare Pages

1. Go to your **Pages project** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `dominiklejman.com`)
4. Follow the DNS setup instructions

### Step 2: Update Access Application

1. Go back to **Zero Trust** → **Access** → **Applications**
2. Edit your **Portfolio Website** application
3. Update the **Application domain** to your custom domain
4. Save the changes

### Step 3: Update Environment Variables

Update `NEXT_PUBLIC_SITE_URL` in Cloudflare Pages:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Troubleshooting

### Build Failures

- Check build logs in Cloudflare Pages dashboard
- Ensure all required environment variables are set
- Verify Node.js version is 18 or higher

### Access Issues

- Clear browser cookies and try again
- Check that the email address is in the allowed list
- Verify the Access application domain matches your deployment URL
- Check Access logs for denied requests

### Environment Variables Not Working

- Environment variables require a new deployment to take effect
- Redeploy your site after adding/changing variables
- Use `NEXT_PUBLIC_` prefix for variables that need to be available in the browser

## Next Steps

1. Set up your custom domain
2. Configure Sanity API read token for draft content
3. Set up Cloudflare Turnstile for contact form spam protection
4. Configure Resend for email functionality
5. Monitor access logs regularly
6. Update authorized users list as needed

## Useful Links

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/applications/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Your Cloudflare Dashboard](https://dash.cloudflare.com/)

## Support

- Cloudflare Community: https://community.cloudflare.com/
- Next.js Discussions: https://github.com/vercel/next.js/discussions
