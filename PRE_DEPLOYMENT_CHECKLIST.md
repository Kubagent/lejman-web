# Pre-Deployment Checklist

This checklist ensures your application is production-ready before deploying to Cloudflare Pages.

## ✅ Phase 1: Code Quality & Type Safety

### 1.1 TypeScript Validation
```bash
# Run TypeScript compiler without emitting files
npx tsc --noEmit
```
**Expected**: No errors

**Common Issues:**
- Missing type definitions
- Incorrect type assignments
- Missing required properties in objects

### 1.2 Linting
```bash
# Run ESLint
npm run lint
```
**Expected**: No errors or warnings (or only acceptable warnings)

**Common Issues:**
- Unused variables
- Missing dependencies in useEffect
- Accessibility issues

### 1.3 Mock Data Validation
- [ ] All mock data matches TypeScript type definitions
- [ ] No `mainImage` properties in Project objects (use `images` array)
- [ ] All `venue` properties use `LocalizedText` format
- [ ] All projects have `location` string field

## ✅ Phase 2: Local Testing

### 2.1 Development Server
```bash
npm run dev
```
**Test:**
- [ ] Home page loads without errors
- [ ] All navigation links work
- [ ] Projects page displays correctly
- [ ] Works page displays correctly
- [ ] About section pages load
- [ ] No console errors in browser

### 2.2 Production Build Test
```bash
npm run build
```
**Expected**: Build completes successfully

**What This Tests:**
- Static page generation works
- All pages can be pre-rendered
- Environment variables are available
- No build-time errors

**Common Issues:**
- Missing environment variables
- Runtime code running at build time
- API calls failing during static generation

### 2.3 Production Server Test
```bash
npm run build && npm start
```
**Test:**
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Navigation works
- [ ] No console errors

## ✅ Phase 3: Environment Configuration

### 3.1 Environment Variables Check
Review `.env.local`:
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` is set
- [ ] `NEXT_PUBLIC_SANITY_DATASET` is set
- [ ] `NEXT_PUBLIC_SITE_URL` is set

### 3.2 Required vs Optional Variables
**Required for Build:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` ✅ CRITICAL
- `NEXT_PUBLIC_SANITY_DATASET` ✅ CRITICAL
- `NEXT_PUBLIC_SITE_URL` ✅ CRITICAL

**Optional (add later):**
- `SANITY_API_READ_TOKEN` - For draft content
- `CLOUDFLARE_TURNSTILE_SECRET` - For contact form
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - For contact form
- `RESEND_API_KEY` - For email functionality

### 3.3 Git Status Check
```bash
git status
```
- [ ] All changes are committed
- [ ] Working directory is clean
- [ ] You're on the correct branch
- [ ] Changes are pushed to GitHub

## ✅ Phase 4: Dependency Audit

### 4.1 Security Audit
```bash
npm audit
```
**Review:**
- Critical vulnerabilities: Must fix
- High vulnerabilities: Should fix
- Moderate/Low: Review and decide

### 4.2 Outdated Packages
```bash
npm outdated
```
**Decision**: Update before deploy or after?

## ✅ Phase 5: Deployment Configuration

### 5.1 Cloudflare Pages Settings
Before clicking "Deploy":
- [ ] Build command: `npm run build`
- [ ] Build output directory: `.next`
- [ ] Root directory: `/` (empty)
- [ ] Node version: `18` or higher

### 5.2 Environment Variables in Cloudflare
**CRITICAL**: Set these BEFORE first deployment:
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID=xcwag9wn`
- [ ] `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] `NEXT_PUBLIC_SITE_URL=https://your-site.pages.dev`

### 5.3 Build Configuration
- [ ] `.npmrc` file exists with `legacy-peer-deps=true`
- [ ] `package.json` has correct build script
- [ ] `next.config.js` is properly configured

## ✅ Phase 6: Post-Deployment Verification

### 6.1 Build Success
- [ ] Cloudflare build completes without errors
- [ ] Check build logs for warnings

### 6.2 Site Functionality
- [ ] Visit deployed URL
- [ ] Test all main pages
- [ ] Check browser console for errors
- [ ] Verify images load correctly
- [ ] Test navigation

### 6.3 Performance Check
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify images are optimized

## ✅ Phase 7: Access Control (After Successful Deployment)

### 7.1 Cloudflare Access Setup
- [ ] Navigate to Zero Trust dashboard
- [ ] Create Access application
- [ ] Configure access policies
- [ ] Test login flow

### 7.2 Access Verification
- [ ] Test in incognito window
- [ ] Verify authorized users can access
- [ ] Verify unauthorized users are blocked

## 🚨 Common Deployment Issues & Solutions

### Issue: "Configuration must contain projectId"
**Cause**: Missing environment variables in Cloudflare
**Solution**: Add `NEXT_PUBLIC_SANITY_PROJECT_ID` in Cloudflare Pages settings

### Issue: "Module not found" errors
**Cause**: Dependency issues or incorrect imports
**Solution**:
- Check `package.json` dependencies
- Run `npm install`
- Verify import paths

### Issue: TypeScript errors during build
**Cause**: Type mismatches in code
**Solution**: Run `npx tsc --noEmit` locally to find and fix errors

### Issue: Images not loading
**Cause**: Missing image domain in `next.config.js`
**Solution**: Add domain to `remotePatterns` in `next.config.js`

### Issue: 404 errors on dynamic routes
**Cause**: Missing `generateStaticParams` or build-time data fetch issue
**Solution**: Check dynamic route files have proper static generation

## 📋 Quick Pre-Deployment Command Sequence

Run these commands in order before deploying:

```bash
# 1. Clean install dependencies
npm ci

# 2. Run linting
npm run lint

# 3. Type check
npx tsc --noEmit

# 4. Build production bundle
npm run build

# 5. Check git status
git status

# 6. If all clear, commit and push
git add .
git commit -m "Pre-deployment checks passed"
git push
```

## 🎯 Deployment Readiness Score

Answer YES to all these questions:

- [ ] Local dev server runs without errors?
- [ ] Production build completes successfully?
- [ ] All TypeScript errors resolved?
- [ ] All required environment variables documented?
- [ ] All changes committed and pushed to GitHub?
- [ ] Cloudflare environment variables configured?
- [ ] Build configuration verified in Cloudflare?

**If any answer is NO, do NOT deploy yet.**

## 📝 Recommended Workflow

### For Every Deployment:
1. Make code changes
2. Test locally with `npm run dev`
3. Run `npm run build` to test production build
4. Review and fix any errors
5. Commit changes
6. Push to GitHub
7. Monitor Cloudflare build
8. Test deployed site
9. If issues arise, rollback and fix

### For First Deployment:
1. Complete ALL checklist items above
2. Set environment variables in Cloudflare FIRST
3. Then trigger deployment
4. Monitor build carefully
5. Test thoroughly after deployment

## 🔄 Rollback Plan

If deployment fails:
1. Check Cloudflare build logs for specific error
2. Fix issue locally
3. Test fix with local build
4. Commit and push fix
5. Trigger new deployment

If site is broken after deployment:
1. Use Cloudflare's "Rollback" feature to previous working version
2. Fix issue locally
3. Test thoroughly
4. Deploy fix

---

**Remember**: Taking 10 minutes for proper testing saves hours of debugging production issues.
