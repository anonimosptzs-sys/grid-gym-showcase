
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'professor', 'funcionario', 'aluno');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create students table (registered by admin/staff)
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  professor_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_exercises table
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '12',
  weight TEXT,
  rest_seconds INTEGER DEFAULT 60,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_notifications table
CREATE TABLE public.billing_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  sent_by UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  whatsapp_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- USER_ROLES POLICIES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- STUDENTS POLICIES
CREATE POLICY "Admins can do anything with students" ON public.students FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view students" ON public.students FOR SELECT USING (public.has_role(auth.uid(), 'funcionario'));
CREATE POLICY "Staff can insert students" ON public.students FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'funcionario'));
CREATE POLICY "Staff can update students" ON public.students FOR UPDATE USING (public.has_role(auth.uid(), 'funcionario'));
CREATE POLICY "Professors can view students" ON public.students FOR SELECT USING (public.has_role(auth.uid(), 'professor'));
CREATE POLICY "Students can view own record" ON public.students FOR SELECT USING (auth.uid() = user_id);

-- WORKOUTS POLICIES
CREATE POLICY "Admins can view all workouts" ON public.workouts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Professors can manage workouts" ON public.workouts FOR ALL USING (public.has_role(auth.uid(), 'professor'));
CREATE POLICY "Students can view own workouts" ON public.workouts FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- WORKOUT_EXERCISES POLICIES
CREATE POLICY "Admins can view all exercises" ON public.workout_exercises FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Professors can manage exercises" ON public.workout_exercises FOR ALL USING (public.has_role(auth.uid(), 'professor'));
CREATE POLICY "Students can view own exercises" ON public.workout_exercises FOR SELECT USING (
  workout_id IN (
    SELECT w.id FROM public.workouts w
    JOIN public.students s ON s.id = w.student_id
    WHERE s.user_id = auth.uid()
  )
);

-- BILLING POLICIES
CREATE POLICY "Admins can manage billing" ON public.billing_notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can create billing" ON public.billing_notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'funcionario'));
CREATE POLICY "Staff can view billing" ON public.billing_notifications FOR SELECT USING (public.has_role(auth.uid(), 'funcionario'));
