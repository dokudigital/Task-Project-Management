import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Project, Task, Document, ActivityLog } from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_DOCUMENTS, 
  INITIAL_ACTIVITIES 
} from '../data/initialData';

const USERS_COL = 'users';
const PROJECTS_COL = 'projects';
const TASKS_COL = 'tasks';
const DOCS_COL = 'documents';
const ACTIVITIES_COL = 'activities';

// Seed initial data if Firestore database is empty
export async function seedInitialDataIfEmpty() {
  try {
    const usersSnap = await getDocs(collection(db, USERS_COL));
    if (usersSnap.empty) {
      console.log('Seeding initial data into Firestore...');
      const batch = writeBatch(db);

      INITIAL_USERS.forEach(u => {
        batch.set(doc(db, USERS_COL, u.id), u);
      });

      INITIAL_PROJECTS.forEach(p => {
        batch.set(doc(db, PROJECTS_COL, p.id), p);
      });

      INITIAL_TASKS.forEach(t => {
        batch.set(doc(db, TASKS_COL, t.id), t);
      });

      INITIAL_DOCUMENTS.forEach(d => {
        batch.set(doc(db, DOCS_COL, d.id), d);
      });

      INITIAL_ACTIVITIES.forEach(a => {
        batch.set(doc(db, ACTIVITIES_COL, a.id), a);
      });

      await batch.commit();
      console.log('Firestore seeding completed successfully.');
    }
  } catch (err) {
    console.error('Error seeding Firestore initial data:', err);
  }
}

// Real-time subscriptions
export function subscribeUsers(onData: (users: User[]) => void) {
  return onSnapshot(collection(db, USERS_COL), (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data() as User);
    onData(users);
  }, (err) => {
    console.error('Firestore Users listener error:', err);
  });
}

export function subscribeProjects(onData: (projects: Project[]) => void) {
  return onSnapshot(collection(db, PROJECTS_COL), (snapshot) => {
    const projects = snapshot.docs.map(doc => doc.data() as Project);
    onData(projects);
  }, (err) => {
    console.error('Firestore Projects listener error:', err);
  });
}

export function subscribeTasks(onData: (tasks: Task[]) => void) {
  return onSnapshot(collection(db, TASKS_COL), (snapshot) => {
    const tasks = snapshot.docs.map(doc => doc.data() as Task);
    onData(tasks);
  }, (err) => {
    console.error('Firestore Tasks listener error:', err);
  });
}

export function subscribeDocuments(onData: (docs: Document[]) => void) {
  return onSnapshot(collection(db, DOCS_COL), (snapshot) => {
    const docs = snapshot.docs.map(doc => doc.data() as Document);
    onData(docs);
  }, (err) => {
    console.error('Firestore Documents listener error:', err);
  });
}

export function subscribeActivities(onData: (activities: ActivityLog[]) => void) {
  return onSnapshot(collection(db, ACTIVITIES_COL), (snapshot) => {
    const activities = snapshot.docs.map(doc => doc.data() as ActivityLog);
    onData(activities);
  }, (err) => {
    console.error('Firestore Activities listener error:', err);
  });
}

// CRUD operations
export async function saveUserToFirestore(user: User) {
  await setDoc(doc(db, USERS_COL, user.id), user, { merge: true });
}

export async function deleteUserFromFirestore(userId: string) {
  await deleteDoc(doc(db, USERS_COL, userId));
}

export async function saveProjectToFirestore(project: Project) {
  await setDoc(doc(db, PROJECTS_COL, project.id), project, { merge: true });
}

export async function deleteProjectFromFirestore(projectId: string) {
  await deleteDoc(doc(db, PROJECTS_COL, projectId));
}

export async function saveTaskToFirestore(task: Task) {
  await setDoc(doc(db, TASKS_COL, task.id), task, { merge: true });
}

export async function deleteTaskFromFirestore(taskId: string) {
  await deleteDoc(doc(db, TASKS_COL, taskId));
}

export async function saveDocumentToFirestore(document: Document) {
  await setDoc(doc(db, DOCS_COL, document.id), document, { merge: true });
}

export async function deleteDocumentFromFirestore(documentId: string) {
  await deleteDoc(doc(db, DOCS_COL, documentId));
}

export async function addActivityToFirestore(activity: Omit<ActivityLog, 'id'>) {
  const newId = 'act-' + Date.now();
  const fullActivity: ActivityLog = { ...activity, id: newId };
  await setDoc(doc(db, ACTIVITIES_COL, newId), fullActivity);
}
