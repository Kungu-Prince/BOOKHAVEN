// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
// import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-functions.js";
// import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, doc, setDoc, getDocs, query, orderBy, limit, getDoc, where, startAfter, writeBatch, arrayUnion, updateDoc, deleteDoc, getCountFromServer, arrayRemove, serverTimestamp, increment } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// * Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBquRDfnpjcgArMe_wIfO0efewg8ntpums",
  authDomain: "bookhaven-df029.firebaseapp.com",
  projectId: "bookhaven-df029",
  storageBucket: "bookhaven-df029.appspot.com",
  messagingSenderId: "613195968870",
  appId: "1:613195968870:web:0809690b93b17fa79f58a7",
  measurementId: "G-CPD87LHH90"
};

// * Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const firestore = getFirestore(app);
const storage = getStorage();
const auth = getAuth();
auth.useDeviceLanguage();
export { auth, onAuthStateChanged }

export async function signInWithEP(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      console.log(idTokenResult.claims.role);
      const role = idTokenResult.claims && idTokenResult.claims.role ? idTokenResult.claims.role : 'user';
      return { success: true, role };
    }).catch((error) => {
      console.error('Error signing in :', error);
      return { success: false, error: error.message || 'An error occurred' };
    });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const idTokenResult = await user.getIdTokenResult(true);
    const role = idTokenResult.claims && idTokenResult.claims.role ? idTokenResult.claims.role : 'user';

    // Check if the user's document already exists in the Users collection
    const userDocRef = doc(firestore, 'Users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      const userData = {
        dateJoined: serverTimestamp(),
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'user'
      };
      await setDoc(userDocRef, userData);
    }

    return { success: true, role };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

export async function newAccountWithEP(name, email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, {
        displayName: name,
      })
        .then(() => {
          const user = userCredential.user;
          const uid = user.uid;
          const displayName = user.displayName;
          const userEmail = user.email;

          const documentRef = doc(firestore, 'Users', uid);
          return setDoc(documentRef, {
            email: userEmail,
            displayName,
            photoURL: null,
            role: 'user',
            dateJoined: Timestamp.now(),
          })
            .then(() => true)
            .catch((error) => {
              console.error('Error creating user doc:', error.message);
              return false;
            });
        })
        .catch((error) => {
          console.error('Error updating user profile:', error.message);
          return false;
        });
    })
    .catch((error) => {
      console.error('Error creating user account:', error);
      return { success: false, error: error.message || 'An error occurred' };
    });
}

export async function signout() {
  return signOut(auth).then(() => {
    return { success: true };
  }).catch((error) => {
    return { success: false, error: error.message || 'An error occurred' };
  });
}

export async function getBooks(bookLimit, lastDoc, category) {
  const books = [];
  let queryRef = collection(firestore, "Products");

  if (category) {
    queryRef = query(queryRef, where("category", "==", category));
  }

  queryRef = query(queryRef, orderBy("title"));
  if (lastDoc) {
    queryRef = query(queryRef, startAfter(lastDoc));
  }
  queryRef = query(queryRef, limit(bookLimit || 30));


  const querySnapshot = await getDocs(queryRef);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    books.push({ ...doc.data(), id: doc.id });
  });
  // console.log({books, lastDoc: lastVisible});
  return { books, lastDoc: lastVisible };
}

export async function getCart(cartLimit, lastDoc) {
  const user = auth.currentUser;
  if (user) {
    const cart = [];
    let queryRef = collection(firestore, `Users/${user.uid}/cart`);


    queryRef = query(queryRef, orderBy("title"));
    if (lastDoc) {
      queryRef = query(queryRef, startAfter(lastDoc));
    }
    queryRef = query(queryRef, limit(cartLimit || 30));


    const querySnapshot = await getDocs(queryRef);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      cart.push({ ...doc.data(), id: doc.id });
    });
    return { success: true, cart, lastDoc: lastVisible };
  } else {
    return { success: false, error: 'Log in to view cart' };
  }
}

export async function getOrders(orderLimit, lastDoc) {
  const user = auth.currentUser;
  if (user) {
    const orders = [];
    let queryRef = collection(firestore, `Users/${user.uid}/orders`);


    queryRef = query(queryRef, orderBy("title"));
    if (lastDoc) {
      queryRef = query(queryRef, startAfter(lastDoc));
    }
    queryRef = query(queryRef, limit(orderLimit || 30));


    const querySnapshot = await getDocs(queryRef);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      orders.push({ ...doc.data(), id: doc.id });
    });
    return { success: true, orders, lastDoc: lastVisible };
  } else {
    return { success: false, error: 'Log in to view orders' };
  }
}

export async function addToCart(product, amount) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    if (product.stockLeft < amount) {
      return { success: false, error: 'Please select a lower quantity.' };
    }
    try {
      // Check if the product is already in the cart
      const productDocRef = doc(firestore, `Users/${userId}/cart`, product.id);
      if (amount > 0) {
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          if (productDoc.data().quantity == amount) {
            // Product already in cart, return an error
            return { success: false, error: 'Item already in cart' };
          } else {
            await updateDoc(productDocRef, {
              quantity: amount
            });
            return { success: true };
          }
        } else {
          // Product not in cart, add it
          await setDoc(productDocRef, {
            quantity: amount,
            image: product.image,
            title: product.title,
            price: product.price,
          });
          return { success: true };
        }
      } else {
        await deleteDoc(productDocRef);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return { success: false, error: error.message || 'An error occured' };
    }
  } else {
    return { success: false, error: 'Log in to add item to cart' };
  }
}

export async function getBookFromCart(bookId) {
  const user = auth.currentUser;
  if (user) {
    try {
      const productDocRef = doc(firestore, `Users/${user.uid}/cart`, bookId);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        return { success: true, isInCart: true, quantity: productDoc.data().quantity };
      } else {
        return { success: true, isInCart: false };
      }
    } catch (error) {
      console.error('Error getting book from cart:', error);
      return { success: false, error: error.message || 'An error occured' };
    }
  } else {
    return { success: false, error: 'Log in to view cart item' }
  }
}

export async function getBook(bookId) {
  try {
    const bookDocRef = doc(firestore, 'Products', bookId);
    const bookDocSnapshot = await getDoc(bookDocRef);
    if (bookDocSnapshot.exists()) {
      return { success: true, book: { id: bookId, ...bookDocSnapshot.data() } }
    } else {
      return { success: false, error: 'Book not found' };
    }
  } catch (error) {
    console.error('Error getting book:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

export async function sendMessage(name, email, phone, message) {
  try {
    const messagesCollection = collection(firestore, 'Messages');

    await addDoc(messagesCollection, {
      name,
      email,
      phone,
      message,
      status: 'unread',
      date: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

export async function makeOrder(cart, number, address) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    try {
      const ordersCollectiondRef = collection(firestore, `Users/${user.uid}/orders`);

      for (const item of cart) {
        const bookDocRef = doc(firestore, 'Products', item.id);
        const bookDocSnapshot = await getDoc(bookDocRef);
        if (bookDocSnapshot.exists()) {
          if (bookDocSnapshot.data().stockLeft >= item.quantity) {
            await updateDoc(bookDocRef, { stockLeft: increment(-item.quantity) })
            await addDoc(ordersCollectiondRef, {
              status: 'In Shipping',
              date: Timestamp.now(),
              productId: item.id,
              title: item.title,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              reviewed: false,
              address,
              paymentNumber: `+254${number}`,
              paymentStatus: 'paid'
            });
            deleteDoc(doc(firestore, `Users/${user.uid}/cart`, item.id));

          } else {
            return { success: false, error: `Only ${bookDocSnapshot.data().stockLeft} ${bookDocSnapshot.data().title} books left.` }
          }

        } else {
          return { success: false, error: 'book not found' }
        }
      }
      return { success: true }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return { success: false, error: error.message || 'An error occured' };
    }
  } else {
    return { success: false, error: 'Log in to finish ordering' };
  }
}

export async function addBook(title, category, price, description, total, image) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    try {
      const productsCollection = collection(firestore, "Products");
      const storageRef = ref(storage, `books/${title}.png`);
      await uploadBytes(storageRef, image);
      const imageURL = await getDownloadURL(storageRef);
      await addDoc(productsCollection, {
        title,
        category,
        price,
        description,
        total,
        image: imageURL,
        merchantID: userId,
        reviews: [],
        stockLeft: total,
        rating: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
      });
      return { success: true }
    } catch (error) {
      console.error('Error adding items:', error);
      return { success: false, error: error.message || 'An error occured' };
    }
  } else {
    return { success: false, error: 'Log in to add items' };
  }
}

export async function updateUser(image, type, name, email) {
  try {
    var updates = {}
    const user = auth.currentUser;
    if (image) {
      const storageRef = ref(storage, `displayPicture/${user.uid}.${type}`);
      await uploadBytes(storageRef, image);
      updates.photoURL = await getDownloadURL(storageRef);
    }
    if (name) {
      updates.displayName = name;
    }
    if (email && !user.providerData.some((provider) => provider.providerId !== 'password')) {
      updates.email = email;
    }
    await updateProfile(user, updates);
    const userDocRef = doc(firestore, 'Users', user.uid);
    await updateDoc(userDocRef, updates);

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

export async function addReview(bookId, orderId, rating, review) {
  const user = auth.currentUser;
  if (user) {
    try {
      const bookDocRef = doc(firestore, 'Products', bookId);
      const orderDocRef = doc(firestore, `Users/${user.uid}/orders`, orderId);
      await updateDoc(bookDocRef, {
        reviews: arrayUnion({
          userName: user.displayName,
          rating,
          review,
          date: Timestamp.now()
        })
      });
      await updateDoc(orderDocRef, { reviewed: true });
      return { success: true }
    } catch (error) {
      console.error('Error adding review:', error);
      return { success: false, error: error.message || 'An error occured' };
    }
  } else {
    return { success: false, error: 'Log in to review' };
  }
}
