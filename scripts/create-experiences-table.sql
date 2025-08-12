-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_start_date ON experiences(start_date);
CREATE INDEX IF NOT EXISTS idx_experiences_current ON experiences(current);

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own experiences" ON experiences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" ON experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON experiences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON experiences
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experiences_updated_at 
  BEFORE UPDATE ON experiences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 