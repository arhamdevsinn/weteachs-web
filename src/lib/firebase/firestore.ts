// @ts-nocheck
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

export class FirestoreService {
  // Get a single document
  static async getDocument(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  // Get multiple documents with optional queries
  static async getDocuments(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ) {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Smart create/update
  static async saveDocument(
    collectionName: string,
    data: DocumentData,
    docId?: string
  ) {
    if (!docId) {
      // 👉 No docId means create a new document
      const newDoc = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
      });
      return { id: newDoc.id, ...data };
    }

    // 👉 docId provided: check if it exists
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      // Update existing
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return { id: docId, ...data };
    } else {
      // Create new with given id
      await setDoc(docRef, { ...data, createdAt: new Date() });
      return { id: docId, ...data };
    }
  }

  // Delete document
  static async deleteDocument(collectionName: string, docId: string) {
    return deleteDoc(doc(db, collectionName, docId));
  }
}
async function saveTeacherDetails(uid: string, teacherData) {
  try {
    // Always create or overwrite the doc
    await setDoc(doc(db, "TeacherDetails", uid), {
      ...teacherData,
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Teacher details saved successfully!");
  } catch (error) {
    console.error("❌ Error saving teacher details:", error);
  }
}
