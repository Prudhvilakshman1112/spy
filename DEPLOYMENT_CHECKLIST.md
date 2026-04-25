# Pre-Deployment Checklist

## Environment Variables (Set in Vercel Dashboard)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Database Setup
- [ ] Run SQL migration from `supabase/migrations/001_performance_indexes.sql` in Supabase SQL Editor
- [ ] Verify all indexes created:
```sql
SELECT indexname, tablename FROM pg_indexes
WHERE tablename IN ('products', 'product_images', 'categories', 'subcategories');
```

## Local Build Test
```bash
npm run build
npm start
# Visit http://localhost:3000 and test all pages
```

## Performance Test
- [ ] Run Lighthouse on homepage (target: 95+)
- [ ] Run Lighthouse on product page (target: 90+)
- [ ] Test on mobile device (LAN: http://192.168.0.109:3000)
- [ ] Verify images load with WebP format
- [ ] Check Network tab — all images should show Next.js optimization

## Vercel Deployment
```bash
vercel --prod
```
- [ ] Verify production URL works
- [ ] Test all routes
- [ ] Check Vercel Analytics dashboard
- [ ] Monitor Speed Insights for Core Web Vitals

## Expected Metrics
- FCP: < 1s
- LCP: < 2.5s
- CLS: < 0.1
- TTI: < 3s
- Lighthouse: 95+
