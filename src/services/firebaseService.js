import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const EXPENSES_COLLECTION = 'expenses';
const SETTINGS_COLLECTION = 'settings';

export const firebaseService = {
  // Add a new expense
  addExpense: async (expense) => {
    try {
      const expenseWithTimestamp = {
        ...expense,
        createdAt: Timestamp.now(),
        date: Timestamp.fromDate(new Date(expense.date))
      };
      const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), expenseWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  // Get all expenses
  getExpenses: async () => {
    try {
      const q = query(collection(db, EXPENSES_COLLECTION), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate()
      }));
    } catch (error) {
      console.error('Error getting expenses:', error);
      throw error;
    }
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    try {
      await deleteDoc(doc(db, EXPENSES_COLLECTION, expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  // Update an expense
  updateExpense: async (expenseId, expense) => {
    try {
      const expenseWithTimestamp = {
        ...expense,
        date: Timestamp.fromDate(new Date(expense.date))
      };
      await updateDoc(doc(db, EXPENSES_COLLECTION, expenseId), expenseWithTimestamp);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Save user settings (salary)
  saveSettings: async (settings) => {
    try {
      const settingsDoc = doc(db, SETTINGS_COLLECTION, 'user');
      // Try to update first, if it fails because document doesn't exist, create it
      try {
        await updateDoc(settingsDoc, settings);
      } catch (error) {
        if (error.code === 'not-found') {
          // Document doesn't exist, create it
          await addDoc(collection(db, SETTINGS_COLLECTION), {
            ...settings,
            userId: 'user'
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  // Get user settings
  getSettings: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, SETTINGS_COLLECTION));
      if (querySnapshot.empty) {
        return { monthlySalary: 0 };
      }
      // Look for the user document or return the first one
      const userDoc = querySnapshot.docs.find(doc => doc.id === 'user') || querySnapshot.docs[0];
      return userDoc.data();
    } catch (error) {
      console.error('Error getting settings:', error);
      return { monthlySalary: 0 };
    }
  }
};

// Export auth for authentication
export { auth };
