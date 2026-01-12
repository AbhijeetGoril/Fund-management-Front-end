import { auth } from "../firebase/firebaseConfig";

export const getToken = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    console.log("Firebase user not ready yet");
    return null;
  }

  const token = await user.getIdToken();
  return token;
};
