# إطلاق Zaffa (زفة) — خطوات اليوم

## 1) تفعيل Supabase
- افتح [Supabase Dashboard](https://supabase.com/dashboard).
- المشروع الحالي على الحساب **متوقف (Paused/Inactive)** — اضغط **Restore project**.
- من **SQL Editor** شغّل الملف `supabase/schema.sql` بالكامل.
- من **Project Settings → API** انسخ:
  - `Project URL`
  - `anon` public key
- من **Database → Connection string** انسخ `DATABASE_URL` (pooler).

## 2) متغيرات البيئة
انسخ `.env.example` إلى `.env` محلياً، وفي Vercel أضف نفس القيم:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**مهم:** لا تضع `service_role` داخل `NEXT_PUBLIC_*`.

## 3) Git + GitHub
بعد تثبيت Git:

```powershell
cd "D:\main projects root\zfa"
git init -b main
git add -A
git commit -m "Zaffa wedding platform ready for launch"
```

على GitHub: **New repository** → اسم مثل `zaffa` → بدون README.

```powershell
git remote add origin https://github.com/YOUR_USER/zaffa.git
git push -u origin main
```

## 4) النشر على Vercel

```powershell
cd "D:\main projects root\zfa"
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
vercel --prod
```

## 5) تجربة التطبيق
1. افتح `/ar/auth` — سجّل أو استخدم الحساب التجريبي.
2. بعد OTP افتح **Dashboard** — checklist، budget، bookings، vendors.
3. `/ar/admin` للإدارة (حساب admin@zaffa.com في الوضع التجريبي).

## ما زال اختياري لاحقاً
- Supabase Auth بدل OTP المحلي
- مزامنة `wedding_plans` مع قاعدة البيانات
- دومين مخصص + SMS OTP حقيقي
