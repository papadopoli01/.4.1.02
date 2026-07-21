import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  QueryConstraint,
  serverTimestamp,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';

export interface PaginatedResult<T> {
  data: T[];
  lastVisible: DocumentSnapshot | null;
  total?: number;
}

export const getItems = async <T>(
  collectionName: string, 
  companyId: string,
  isSuperAdmin: boolean,
  conditions: QueryConstraint[] = []
): Promise<T[]> => {
  const qConstraints: QueryConstraint[] = [];
  
  if (!isSuperAdmin) {
    qConstraints.push(where('companyId', '==', companyId));
  }
  
  qConstraints.push(...conditions);
  
  const q = query(collection(db, collectionName), ...qConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

export const getPaginatedItems = async <T>(
  collectionName: string,
  companyId: string,
  isSuperAdmin: boolean,
  pageSize: number = 10,
  lastVisibleSnap: DocumentSnapshot | null = null,
  conditions: QueryConstraint[] = [],
  orderByField: string = 'createdAt',
  orderDirection: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResult<T>> => {
  const qConstraints: QueryConstraint[] = [];
  
  if (!isSuperAdmin) {
    qConstraints.push(where('companyId', '==', companyId));
  }
  
  qConstraints.push(...conditions);
  qConstraints.push(orderBy(orderByField, orderDirection));
  
  if (lastVisibleSnap) {
    qConstraints.push(startAfter(lastVisibleSnap));
  }
  
  qConstraints.push(limit(pageSize));
  
  const q = query(collection(db, collectionName), ...qConstraints);
  const snapshot = await getDocs(q);
  
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  
  return { data, lastVisible };
};

export const getItem = async <T>(
  collectionName: string,
  id: string,
  companyId: string,
  isSuperAdmin: boolean
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  const data = { id: snapshot.id, ...snapshot.data() } as any;
  
  if (!isSuperAdmin && data.companyId !== companyId) {
    return null;
  }
  
  return data as T;
};

export const createItem = async <T>(
  collectionName: string,
  companyId: string,
  data: Partial<T>
): Promise<T> => {
  const itemData = {
    ...data,
    companyId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, collectionName), itemData);
  return { id: docRef.id, ...itemData } as unknown as T;
};

export const updateItem = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  const updateData = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  
  await updateDoc(docRef, updateData);
};

export const deleteItem = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
