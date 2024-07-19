import { default as admin } from "./firebase.js";

export async function decodeAuthToken(token) {
  try {
    const Id = token?.split(" ")[1];
     console.log("em:", Id);
    const decodedValue = await admin.auth().verifyIdToken(Id);
    const email = decodedValue.email;
     console.log("@@", email);
    return email;
  } catch (error) {
    console.log(error.message);
  }
}

