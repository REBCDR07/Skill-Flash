# Production Seeding Guide for Supabase

If your deployed application on Vercel is missing course data or profiles, follow these steps to seed your production database.

## Prerequisites

1. **Supabase project**: Ensure your Supabase project is "Active" (not paused).
2. **Environment Variables**: You need the `VITE_SUPABASE_URL` and `VITE_SUPABASE_SERVICE_ROLE_KEY` from your Supabase Project Settings -> API.

## Step-by-Step Instructions

1. **Open your local `.env` file**.
2. **Temporarily Replace** the values with your **Production** credentials:

    ```env
    VITE_SUPABASE_URL=https://your-prod-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-prod-anon-key
    VITE_SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
    ```

    > [!IMPORTANT]
    > Using the `SERVICE_ROLE_KEY` is required because the seeding script needs to bypass Row Level Security (RLS) to insert data.

3. **Run the seeding script** from your terminal:

    ```bash
    npx ts-node --esm scripts/seed-supabase.ts
    ```

4. **Verify the data** in the Supabase Dashboard (Table Editor -> `courses`).

5. **Restore your `.env`** to your local development credentials once finished.

---

## Troubleshooting

- **"Timeout reached"**: If the script hangs, check your internet connection or if the Supabase project is waking up from a pause.
- **"401 Unauthorized"**: Ensure the `VITE_SUPABASE_SERVICE_ROLE_KEY` is correct.
- **Missing Chapters/Tests**: The script automatically reads from `public/courses` and `public/tests`. Ensure these folders are present in your local environment when running the script.
