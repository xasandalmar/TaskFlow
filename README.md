# TaskFlow - Simple & Powerful Task Manager

TaskFlow waa codsi buuxa (Fullstack Application) oo lagu dhisay **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase Auth & PostgreSQL**, iyo **AI Task Assistant**. Waxaa loogu talagalay inuu kuu fududeeyo maareynta hawlaha maalinlaha ah, habaynta mudnaanta, iyo qorshaynta mashaariicda iyadoo la adeegsanayo caqliga macmalka ah (AI).

---

## 🌟 Astaamaha Ugu Waaweyn (Key Features)

1. **Authentication Buuxda (Supabase Auth)**:
   - Is-diiwaangelin (Register), Soo galid (Login), iyo Ka bixid (Logout).
   - Maaraynta session-ka ee Next.js App Router iyadoo la adeegsanayo `@supabase/ssr`.
   - **Authentication Middleware** oo ilaalinaya `/dashboard` islamarkaana qofka aan soo gelin u weecinaya `/login`.

2. **Keydka Xogta & Amniga (PostgreSQL + RLS)**:
   - Jadwallada `profiles` iyo `tasks` oo xiriir toos ah la leh `auth.users`.
   - **Row Level Security (RLS)**: Qof kastaa wuxuu arki karaa, wax ka beddeli karaa, ama tirtiri karaa kaliya hawlihiisa gaarka ah.
   - Database triggers oo si toos ah u cusboonaysiiya `updated_at` iyo xogta profile-ka marka qof cusub is-diiwaangeliyo.

3. **RESTful API Routes (CRUD Operations)**:
   - `POST /api/auth/register` - Diiwaangelinta isticmaalaha cusub.
   - `POST /api/auth/login` - Gelitaanka koontada.
   - `POST /api/auth/logout` - Ka bixidda nidaamka.
   - `GET /api/auth/me` - Soo qaadashada xogta qofka hadda soo galay.
   - `GET /api/tasks` - Soo qaadashada hawlaha (Filter by `status`, `priority`, `search`).
   - `POST /api/tasks` - Abuurista hawl cusub.
   - `GET /api/tasks/[id]` - Faahfaahinta hawl gaar ah.
   - `PUT /api/tasks/[id]` - Wax ka beddelka hawl (title, description, status, priority, due date).
   - `DELETE /api/tasks/[id]` - Tirtiridda hawl.

4. **AI Task Planner (OpenAI API + Smart Planner)**:
   - `POST /api/ai/suggest` - U beddel hadafkaaga (Goal) hawlo la taaban karo oo hal gujin lagu dari karo liiskaaga.
   - Wuxuu si toos ah ula shaqeeyaa **OpenAI API** (`gpt-4o-mini`), isagoo sidoo kale leh qorsheeye maxalli ah oo shaqaynaya xataa haddii aan API key la gelin.

5. **Labada Luqadood & Habka Maalinta/Habeenka (Bilingual & Day/Night Mode)**:
   - **Somali & English**: Hal gujin ku kala beddel luqadda (`SO 🇸🇴` iyo `EN 🇬🇧`). Dhammaan qoraallada iyo taariikhaha ayaa toos ula qabsanaya.
   - **Day & Night Mode**: Hal gujin ku shid ama ku demi Dark Mode / Light Mode, iyadoo xulashada lagu keydinayo `localStorage` si aanay u lumin marka bogga dib loo furo.

6. **Interface Casri ah oo Jawaab-celin Leh (Modern UI/UX)**:
   - **Xisaabaadka Hawlaha (Stats Cards)**: Total Tasks, To Do, In Progress, Completed, iyo Completion Rate bar.
   - **Shaandhaynta & Raadinta (Search & Filters)**: Raadin degdeg ah iyo kala soocid xaalad & mudnaan.
   - **Hawlgal degdeg ah (Quick Status Toggle)**: Hal gujin ku beddel xaaladda hawsha.
   - Naqshad nadiif ah oo ku dhisan Tailwind CSS iyo Icons ka socda Lucide React.

---

## 🛠️ Qaabka Loo Bilaabayo (Local Setup)

### 1. Ku shub Dependencies-ka:
```bash
npm install
```

### 2. Habaynta Furayaasha Deegaanka (Environment Variables):
Nuqul ka sameyso faylka `.env.example` una bixi `.env.local`:
```bash
cp .env.example .env.local
```
Geli xogtaada Supabase iyo OpenAI:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key-optional
```

### 3. Habaynta Database-ka Supabase:
1. Gal bogga [Supabase Dashboard](https://supabase.com/dashboard).
2. Dooro mashruucaaga ama sameyso mashruuc cusub.
3. Dhinaca bidix ka dooro **SQL Editor**.
4. Nuqul ka qaad koodhka ku jira faylka [`supabase/schema.sql`](./supabase/schema.sql) oo ku dhaji SQL Editor-ka.
5. Guji badhanka **Run**. Tani waxay abuuri doontaa jadwallada, siyaasadaha amniga (RLS), iyo triggers-ka lagama maarmaanka ah.

### 4. Kici Codsiga (Development Server):
```bash
npm run dev
```
Fur browser-kaaga oo gal [http://localhost:3000](http://localhost:3000).

---

## 🚀 Tilmaamaha Faafinta (Deployment Guide)

### 1. Ku Shibidda GitHub (Push to GitHub):
```bash
git init
git add .
git commit -m "Initial release: TaskFlow with Supabase & Next.js 15"
git branch -M main
git remote add origin https://github.com/magacaaga/taskflow.git
git push -u origin main
```

### 2. Faafinta Vercel (Deploy to Vercel):
1. Gal bogga [Vercel](https://vercel.com) oo ku gal koontadaada GitHub.
2. Guji **Add New...** -> **Project**.
3. Dooro kaydkaaga GitHub ee `taskflow`.
4. Qaybta **Environment Variables**, ku dar furayaasha soo socda:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Supabase Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Supabase Anon Key)
   - `OPENAI_API_KEY` = (OpenAI API Key - haddii aad haysato)
5. Guji **Deploy**.
6. Vercel ayaa si toos ah u dhisi doona mashruuca oo ku siin doona URL live ah!

---

## 📁 Qaab-dhismeedka Mashruuca (Project Structure)

```
TaskFlow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── me/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── ai/
│   │   │       └── suggest/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AiPlannerModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskModal.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── supabase/
│   └── schema.sql
├── .env.example
├── package.json
└── tsconfig.json
```
