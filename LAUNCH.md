# Launch Checklist

## Pre-Launch Requirements

### 1. Environment Variables
Ensure all required environment variables are set in production:

```env
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_api_key
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
NEXT_PUBLIC_GOOGLE_DRIVE_PARENT_FOLDER_ID=your_folder_id
NEXT_PUBLIC_CONCERT_TAG_FILTER=[CONCERT]
NEXT_PUBLIC_MAX_CONCERTS_DISPLAY=5
```

### 2. Google Calendar Setup
- [ ] Calendar created and configured
- [ ] API key generated with Calendar API access
- [ ] Calendar ID copied and added to environment variables
- [ ] Test events created with `[CONCERT]` tag
- [ ] Event format verified: "Concert Name at Venue"
- [ ] Ticket URLs added to event descriptions

### 3. Google Drive Setup
- [ ] Parent folder created for concert images
- [ ] Folder ID copied and added to environment variables
- [ ] Sub-folders created for each concert (matching concert names)
- [ ] Images uploaded to respective folders
- [ ] Folder permissions set to public/accessible

### 4. Static Concert Images
Verify all images exist in `/public/assets/images/concerts/recent/`:
- [ ] Himlakull-Kaffe-2025.jpg
- [ ] Torsjö-Live-2025.jpg
- [ ] Lunds-Nation-NSA-2025.jpg
- [ ] Examenskonsert-2025.jpg
- [ ] Torsjö-Live-2024.jpg
- [ ] Mejeriet-Lund-2024.jpg
- [ ] Penthouse.Lunds-Nation-Valborg-2023.jpg
- [ ] Torsjö-Live-2023.jpg
- [ ] Lundakarnevalen-2022.jpg
- [ ] Hässlehomfestivalen-2022.jpg
- [ ] Jamboree-2022.jpg
- [ ] Idol-Kvalfinal-2022.jpg

### 5. Hero & Background Images
- [ ] `/public/assets/images/hero/heropage.jpg` exists
- [ ] `/public/assets/images/backgrounds/Crowd-background.jpg` exists
- [ ] Images optimized for web (compressed, appropriate dimensions)

### 6. Code Quality
- [ ] Remove all console.logs
- [ ] Remove commented-out code
- [ ] Run TypeScript type check: `npm run build`
- [ ] Verify no `any` types remain
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)

### 7. Performance
- [ ] Images optimized and compressed
- [ ] Build succeeds without errors: `npm run build`
- [ ] Test build locally: `npm start`
- [ ] Lighthouse score checked (aim for >90)
- [ ] Mobile responsiveness verified

### 8. Functionality Testing
- [ ] Navigation carousel displays upcoming concerts
- [ ] "Stay Tuned" message appears when no upcoming concerts
- [ ] Home page concert grid shows 4 concerts (API + static fallback)
- [ ] Concerts page displays all concerts (API + static)
- [ ] Most recent concert appears as hero on concerts page
- [ ] "Read More" button links to concerts page
- [ ] All animations work smoothly
- [ ] No scrollbars visible anywhere
- [ ] Click sparks work on all pages

### 9. API Integration
- [ ] Google Calendar API responding correctly
- [ ] Past concerts API endpoint working
- [ ] Upcoming concerts API endpoint working
- [ ] Google Drive images loading
- [ ] 24-hour cache functioning
- [ ] Fallback to static concerts works when API fails

### 10. SEO & Meta
- [ ] Page titles set correctly
- [ ] Meta descriptions added
- [ ] Open Graph tags configured
- [ ] Favicon added
- [ ] robots.txt configured (if needed)
- [ ] sitemap.xml generated (if needed)

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables**
   - Go to Vercel dashboard
   - Project Settings > Environment Variables
   - Add all variables from `.env.local`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or use `vercel --prod` for manual deployment

### Domain Configuration
- [ ] Custom domain configured in Vercel
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] www redirect configured (if needed)

## Post-Launch

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor API usage and quotas
- [ ] Check Google Calendar API limits
- [ ] Monitor Google Drive API limits
- [ ] Set up uptime monitoring

### Analytics
- [ ] Google Analytics configured
- [ ] Track concert page visits
- [ ] Monitor ticket link clicks
- [ ] Track navigation carousel interactions

### Maintenance
- [ ] Document how to add new concerts
- [ ] Document how to update static concert images
- [ ] Set calendar reminder to check API quotas monthly
- [ ] Plan regular content updates

## Common Issues & Solutions

### Issue: Concerts not appearing
- Check Google Calendar API key is valid
- Verify calendar ID is correct
- Ensure events have `[CONCERT]` tag
- Check event dates are in the future (for upcoming)

### Issue: Images not loading
- Verify Google Drive folder permissions
- Check folder ID is correct
- Ensure image files are in correct folders
- Verify static image paths are correct

### Issue: Build fails
- Run `npm install` to update dependencies
- Check for TypeScript errors
- Verify all environment variables are set
- Clear `.next` folder and rebuild

### Issue: Scrollbars visible
- Check global CSS is applied
- Verify no component overrides scrollbar styles
- Test on different browsers

## Emergency Rollback
If issues occur post-launch:

1. **Vercel**: Rollback to previous deployment in dashboard
2. **Git**: Revert to last working commit
   ```bash
   git revert HEAD
   git push origin main
   ```

## Success Criteria
- [ ] Website loads in under 3 seconds
- [ ] All images display correctly
- [ ] Concert carousel shows current data
- [ ] Mobile experience is smooth
- [ ] No console errors
- [ ] Analytics tracking works
- [ ] Contact information correct and functional

---

**Launch Date**: _____________

**Launched By**: _____________

**Production URL**: _____________
