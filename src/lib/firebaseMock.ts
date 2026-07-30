// Mock Firebase Implementation for Local Demo
import { v4 as uuidv4 } from 'uuid';

// --- AUTH MOCK ---
export const getAuth = (app?: any) => ({
  currentUser: null
});

export const signInWithEmailAndPassword = async (auth: any, email: string, password: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock_user', JSON.stringify({ uid: 'mock-user-1', email }));
  }
  return { user: { uid: 'mock-user-1', email } };
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock_user', JSON.stringify({ uid: 'mock-user-1', email }));
  }
  return { user: { uid: 'mock-user-1', email } };
};

export const signOut = async (auth: any) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mock_user');
  }
};

export const onAuthStateChanged = (auth: any, callback: any) => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('mock_user');
    if (userStr) {
      callback(JSON.parse(userStr));
      return () => {};
    }
  }
  callback(null);
  return () => {};
};

// --- FIRESTORE MOCK ---
export const getFirestore = (app?: any) => ({});

// Simple local storage adapter
const getStore = (col: string) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(`mock_db_${col}`);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

const setStore = (col: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`mock_db_${col}`, JSON.stringify(data));
  }
};

export const collection = (db: any, path: string) => ({ path });
export const doc = (db: any, path: string, id?: string) => ({ path, id: id || uuidv4() });

export const getDoc = async (docRef: any) => {
  const store = getStore(docRef.path);
  const item = store.find((i: any) => i.id === docRef.id);
  return {
    exists: () => !!item,
    id: docRef.id,
    data: () => item
  };
};

export const getDocs = async (queryRef: any) => {
  let store = getStore(queryRef.path);
  
  if (queryRef.whereClauses) {
    queryRef.whereClauses.forEach((w: any) => {
      store = store.filter((item: any) => {
        if (w.op === '==') return item[w.field] === w.value;
        return true;
      });
    });
  }

  return {
    empty: store.length === 0,
    size: store.length,
    docs: store.map((item: any) => ({
      id: item.id,
      data: () => item,
      ref: { path: queryRef.path, id: item.id }
    }))
  };
};

export const query = (colRef: any, ...constraints: any[]) => {
  return {
    path: colRef.path,
    whereClauses: constraints.filter(c => c.type === 'where')
  };
};

export const where = (field: string, op: string, value: any) => ({ type: 'where', field, op, value });
export const orderBy = (field: string, direction?: string) => ({ type: 'orderBy', field, direction });

export const setDoc = async (docRef: any, data: any) => {
  const store = getStore(docRef.path);
  const index = store.findIndex((i: any) => i.id === docRef.id);
  const newItem = { id: docRef.id, ...data };
  if (index >= 0) {
    store[index] = newItem;
  } else {
    store.push(newItem);
  }
  setStore(docRef.path, store);
};

export const addDoc = async (colRef: any, data: any) => {
  const store = getStore(colRef.path);
  const newItem = { id: uuidv4(), ...data };
  store.push(newItem);
  setStore(colRef.path, store);
  return { id: newItem.id };
};

export const updateDoc = async (docRef: any, data: any) => {
  const store = getStore(docRef.path);
  const index = store.findIndex((i: any) => i.id === docRef.id);
  if (index >= 0) {
    store[index] = { ...store[index], ...data };
    setStore(docRef.path, store);
  }
};

export const deleteDoc = async (docRef: any) => {
  const store = getStore(docRef.path);
  setStore(docRef.path, store.filter((i: any) => i.id !== docRef.id));
};

// Exports to replace firebase/app
export const initializeApp = (config: any) => ({});
export const getApps = () => [];
export const getApp = () => ({});

// Setup mock products if empty
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('mock_db_products')) {
    localStorage.setItem('mock_db_products', JSON.stringify([]));
  }
}
