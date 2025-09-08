import {
  collection,
  doc,
  addDoc,
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
  static async getDocument(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

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

  static async addDocument(collectionName: string, data: DocumentData) {
    return addDoc(collection(db, collectionName), data);
  }

  static async updateDocument(
    collectionName: string,
    docId: string,
    data: DocumentData
  ) {
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, data);
  }

  static async deleteDocument(collectionName: string, docId: string) {
    return deleteDoc(doc(db, collectionName, docId));
  }
}