import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';
import { Student, SchoolInfo } from '../types';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { DEFAULT_SCHOOL_INFO } from '../data/dapodikOptions';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Authenticate anonymously so rule requests succeed
signInAnonymously(auth).catch((err) => {
  console.warn('Firebase anonymous auth error:', err);
});

const STUDENTS_COLLECTION = 'students';
const SCHOOL_COLLECTION = 'school_info';
const SCHOOL_DOC_ID = 'main';

// Helper to format NISN
function formatNisn(nisn: string | number | undefined | null): string {
  if (nisn === undefined || nisn === null) return '';
  let clean = String(nisn).trim();
  if (!clean) return '';
  if (clean.length === 9) {
    clean = '0' + clean;
  } else if (/^\d+$/.test(clean) && clean.length > 0 && clean.length < 10) {
    clean = clean.padStart(10, '0');
  }
  return clean;
}

// Subscribe to students collection in real-time
export function subscribeStudents(
  onUpdate: (students: Student[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, STUDENTS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // If empty in Firestore, seed initial students
        console.log('Firestore students collection is empty. Seeding initial students...');
        await seedInitialStudents();
        return;
      }
      const studentsList: Student[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Student;
        studentsList.push({
          ...data,
          id: docSnap.id || data.id,
          nisn: formatNisn(data.nisn),
        });
      });
      // Sort by rombel then namaSiswa
      studentsList.sort((a, b) => {
        if (a.rombel === b.rombel) {
          return a.namaSiswa.localeCompare(b.namaSiswa);
        }
        return a.rombel.localeCompare(b.rombel);
      });
      onUpdate(studentsList);
    },
    (err) => {
      console.error('Firestore students snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

// Seed initial students into Firestore if empty
export async function seedInitialStudents(): Promise<Student[]> {
  try {
    const formatted = INITIAL_STUDENTS.map((s) => ({ ...s, nisn: formatNisn(s.nisn) }));
    const batch = writeBatch(db);
    for (const student of formatted) {
      const docRef = doc(db, STUDENTS_COLLECTION, student.id);
      batch.set(docRef, student);
    }
    await batch.commit();
    return formatted;
  } catch (err) {
    console.error('Error seeding initial students to Firestore:', err);
    return INITIAL_STUDENTS.map((s) => ({ ...s, nisn: formatNisn(s.nisn) }));
  }
}

// Save single student to Firestore
export async function saveStudentToFirestore(student: Student): Promise<void> {
  const formatted = { ...student, nisn: formatNisn(student.nisn), updatedAt: new Date().toISOString() };
  const docRef = doc(db, STUDENTS_COLLECTION, formatted.id);
  await setDoc(docRef, formatted, { merge: true });
}

// Save all/bulk students to Firestore (for import/sync)
export async function saveAllStudentsToFirestore(students: Student[]): Promise<void> {
  const batch = writeBatch(db);
  students.forEach((student) => {
    const formatted = { ...student, nisn: formatNisn(student.nisn), updatedAt: new Date().toISOString() };
    const docRef = doc(db, STUDENTS_COLLECTION, formatted.id);
    batch.set(docRef, formatted, { merge: true });
  });
  await batch.commit();
}

// Delete student from Firestore
export async function deleteStudentFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, STUDENTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Bulk delete students from Firestore
export async function deleteBulkStudentsFromFirestore(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    batch.delete(docRef);
  });
  await batch.commit();
}

// Subscribe to school info in Firestore
export function subscribeSchoolInfo(
  onUpdate: (info: SchoolInfo) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, SCHOOL_COLLECTION, SCHOOL_DOC_ID);
  return onSnapshot(
    docRef,
    async (docSnap) => {
      if (!docSnap.exists()) {
        await saveSchoolInfoToFirestore(DEFAULT_SCHOOL_INFO);
        onUpdate(DEFAULT_SCHOOL_INFO);
        return;
      }
      const data = docSnap.data() as SchoolInfo;
      onUpdate({ ...DEFAULT_SCHOOL_INFO, ...data });
    },
    (err) => {
      console.error('Firestore school info snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

// Save school info to Firestore
export async function saveSchoolInfoToFirestore(info: SchoolInfo): Promise<void> {
  const docRef = doc(db, SCHOOL_COLLECTION, SCHOOL_DOC_ID);
  await setDoc(docRef, info, { merge: true });
}
