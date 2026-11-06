ALTER TABLE public.profiles ADD COLUMN semester text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email, semester)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'semester'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;