-- Create the monitors table
CREATE TABLE public.monitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    method TEXT DEFAULT 'GET',
    headers JSONB DEFAULT '{}'::jsonb,
    payload JSONB,
    expected_response TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the ping_logs table
CREATE TABLE public.ping_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    monitor_id UUID REFERENCES public.monitors(id) ON DELETE CASCADE,
    is_up BOOLEAN NOT NULL,
    latency_ms INTEGER NOT NULL,
    status_code INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ping_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monitors (Allows users to manage their own monitors)
CREATE POLICY "Users can view their own monitors"
ON public.monitors FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monitors"
ON public.monitors FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitors"
ON public.monitors FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitors"
ON public.monitors FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for ping_logs (Allows users to view logs belonging to their monitors)
CREATE POLICY "Users can view their own ping logs"
ON public.ping_logs FOR SELECT
USING (
    monitor_id IN (
        SELECT id FROM public.monitors WHERE user_id = auth.uid()
    )
);

-- Note: We assume your Hugging Face background daemon uses the Supabase SERVICE_ROLE key 
-- to bypass RLS when inserting new ping_logs. If it uses the anon key, you will need to add an insert policy here.
