import supabase, { supabaseUrl } from "./supabase";

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
};

export const getCurrentUser = async () => {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;
  if (error) throw new Error(error.message);
  return session.session?.user;
};

export const signup = async ({ name, email, password, profile_pic }) => {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
  const { data, error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic);

  if (storageError) throw new Error(storageError.message);
  const {  error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // To store extra metaData
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;

};


export const logout = async () =>{
  const {error} = supabase.auth.signOut();
  if (error) throw new Error(error.message);

}