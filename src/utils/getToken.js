import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const getToken = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // stop listening after first run

      if (!user) {
        resolve(null);
        return;
      }
      try {
        const token = await user.getIdToken();
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
};
