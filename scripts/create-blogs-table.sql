-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own blogs" ON blogs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blogs" ON blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blogs" ON blogs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blogs" ON blogs
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON blogs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 