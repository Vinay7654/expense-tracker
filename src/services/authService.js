import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseService';

class AuthService {
  constructor() {
    this.auth = auth;
    this.currentUser = null;
    this.listeners = [];
  }

  // Monitor auth state changes
  onAuthStateChanged(callback) {
    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      callback(user);
    });
    
    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Login with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await this.sendLoginNotification(userCredential.user, 'Login Successful');
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Create new account
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.sendWelcomeEmail(userCredential.user);
      await this.sendLoginNotification(userCredential.user, 'Account Created');
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Login with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      await this.sendLoginNotification(userCredential.user, 'Google Login Successful');
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async signOut() {
    try {
      await signOut(this.auth);
      this.currentUser = null;
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Send login notification email
  async sendLoginNotification(user, action) {
    try {
      // This would typically call your backend API
      // For now, we'll use EmailJS or similar service
      const emailData = {
        to_email: user.email,
        subject: `Expense Tracker - ${action}`,
        message: `
          Hello ${user.displayName || 'User'},
          
          ${action} at ${new Date().toLocaleString()}
          
          If this wasn't you, please secure your account immediately.
          
          Best regards,
          Expense Tracker Team
        `,
        user_info: {
          email: user.email,
          display_name: user.displayName || 'User',
          uid: user.uid,
          action: action,
          timestamp: new Date().toISOString(),
          ip_address: await this.getClientIP()
        }
      };

      // Using EmailJS (you'll need to set this up)
      await this.sendEmail(emailData);
      
      console.log('Login notification sent to:', user.email);
    } catch (error) {
      console.error('Failed to send login notification:', error);
      // Don't throw error - login should still work even if email fails
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    try {
      const emailData = {
        to_email: user.email,
        subject: 'Welcome to Expense Tracker!',
        message: `
          Welcome ${user.displayName || 'User'}!
          
          Thank you for joining Expense Tracker. Here's what you can do:
          
          📊 Track your daily expenses
          💰 Set monthly budgets
          📈 View spending analytics
          🤖 Get AI-powered insights
          
          Get started by adding your first expense!
          
          Best regards,
          Expense Tracker Team
        `,
        user_info: {
          email: user.email,
          display_name: user.displayName || 'User',
          uid: user.uid,
          action: 'Welcome',
          timestamp: new Date().toISOString()
        }
      };

      await this.sendEmail(emailData);
      console.log('Welcome email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  // Send email using EmailJS or similar service
  async sendEmail(emailData) {
    // This is a placeholder - you'll need to set up EmailJS or similar
    // For demonstration, we'll use a simple fetch to a mock endpoint
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5174' // Your domain
        },
        body: JSON.stringify({
          service_id: 'your_service_id',
          template_id: 'your_template_id',
          user_id: 'your_user_id',
          template_params: {
            to_email: emailData.to_email,
            subject: emailData.subject,
            message: emailData.message,
            from_name: 'Expense Tracker',
            reply_to: 'noreply@expensetracker.com'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Email service failed');
      }

      return response.json();
    } catch (error) {
      // For development, we'll just log the email
      console.log('Email would be sent:', emailData);
      
      // In production, you'd use a real email service
      // Options:
      // 1. EmailJS (free tier available)
      // 2. SendGrid (requires backend)
      // 3. Firebase Cloud Functions with SendGrid
      // 4. AWS SES with backend
    }
  }

  // Get client IP (for security logging)
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // Clean up listeners
  cleanup() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}

export const authService = new AuthService();
