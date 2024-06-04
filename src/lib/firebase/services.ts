import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import app from "./init";

const firestore = getFirestore(app);

export async function signIn(email: string) {
  const q = query(collection(firestore, "users"), where("email", "==", email));

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data) {
    return data[0];
  } else {
    return null;
  }
}

export async function loginWithGoogle(userData: any, callback: any) {
    const q = query(collection(firestore, "users"), where("email", "==", userData.email));

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length > 0) {
      callback(false)
    } else {
      userData.role = "member";
      await addDoc(collection(firestore, "users"), userData)
        .then(() => callback(userData))
        .catch(() => callback(false));
    }
}