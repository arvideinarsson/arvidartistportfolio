# Development Rules

## Rule #1: Always Review These Rules Before Making Changes
Before implementing any feature, fix, or modification, ALWAYS review this file to ensure compliance with project standards. This is the most important rule - never skip this step.

## Rule #2: No Emojis
- Never use emojis in code, comments, or user-facing text
- This includes UI elements, labels, buttons, and error messages
- Keep all text professional and clean

## Rule #3: No Scrollbars Ever
- Scrollbars must NEVER be visible anywhere in the application
- This applies to both vertical and horizontal scrollbars
- Use `overflow: hidden` or custom styling to hide scrollbars
- Ensure content is still scrollable, just without visible scrollbar UI
- Test on all browsers (Chrome, Firefox, Safari) as scrollbar behavior differs

## Rule #4: Always Use Local Dev Environment
- Always create and maintain a local development environment
- Test all changes locally before committing
- Use `npm run dev` to verify changes work correctly

## Rule #5: Always Set Up Git Repo
- Every project must have a git repository initialized
- Commit changes regularly with descriptive messages
- Never commit sensitive information (.env files, API keys)

## Rule #6: Folder Structure for New Pages
Every time a new page is created, create a dedicated folder with proper structure:
```
src/app/page-name/
├── page.tsx          # Main page component
├── layout.tsx        # Page-specific layout (if needed)
└── components/       # Page-specific components (if needed)
```
Always follow the established folder structure patterns.

## Rule #7: Automation Over Manual
- Always choose automatic systems over manual processes
- Implement dynamic data fetching instead of hardcoded content
- Use API integrations when available (Google Calendar, Google Drive, etc.)
- Minimize manual updates and maintenance work

## Rule #8: Update README on GitHub Push
- Every time changes are pushed to GitHub, update the README.md
- Ensure documentation reflects current features and setup
- Keep installation instructions current
- Document any new environment variables or configuration

## Rule #9: Token Efficiency
- Use as few tokens as possible while maintaining quality
- Never sacrifice code quality for token savings
- Be concise but complete
- Avoid unnecessary verbosity in responses

## Rule #10: Prefer Easier Fixes
- Always choose simpler solutions when they achieve the same result
- Easier fixes must NEVER sacrifice quality
- Avoid over-engineering
- Use existing patterns and components when possible

## Rule #11: Use Multi-Edit When Possible
- Utilize multi-edit capabilities for bulk changes
- Never sacrifice quality for speed
- Ensure all edits are verified and consistent
- Review changes after multi-edit operations

## Rule #12: React/Next.js Only
- Always code in React with Next.js framework
- Use Next.js 15 App Router
- Follow React best practices and hooks patterns
- Use TypeScript for all code

## Rule #13: Mobile-First Responsive Design
- Design for mobile first, then scale up
- Test all breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Ensure touch targets are appropriately sized

## Rule #14: Performance First
- Optimize images before adding to project
- Use lazy loading for below-the-fold content
- Minimize bundle size and dependencies
- Use React.memo and useMemo where appropriate

## Rule #15: Consistent Spacing
- Use Tailwind spacing utilities consistently
- Follow the established spacing patterns in existing components
- Maintain visual hierarchy through spacing

## Rule #16: Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers when possible

## Rule #17: Type Safety
- Always use TypeScript types, never `any`
- Define interfaces for all props and data structures
- Export reusable types from appropriate files

## Rule #18: Clean Code
- Remove console.logs before committing
- No commented-out code in production
- Keep components focused and single-purpose
- Extract reusable logic into hooks or utilities
