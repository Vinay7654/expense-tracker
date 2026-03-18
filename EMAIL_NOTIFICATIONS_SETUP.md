# 📧 Email Notifications Setup Guide

## 🎯 What We've Implemented

✅ **Login System** - Email/password and Google authentication
✅ **Email Notifications** - Automatic emails on login/signup
✅ **Welcome Emails** - Sent when new users create accounts
✅ **Security Logging** - IP address and user agent tracking

## 📧 Email Service Options

### Option 1: EmailJS (Recommended for Development)
✅ **Free tier available**
✅ **Easy to set up**
✅ **No backend required**
✅ **Works with React**

#### Setup EmailJS:
1. **Sign up**: https://www.emailjs.com/
2. **Create Email Service** (Gmail recommended)
3. **Create Email Template**
4. **Get your keys**:
   - Service ID
   - Template ID
   - Public Key

#### Update your code:
```javascript
// In authService.js
await this.sendEmail({
  service_id: 'your_service_id',
  template_id: 'your_template_id',
  user_id: 'your_public_key',
  template_params: {
    to_email: user.email,
    subject: 'Login Successful',
    message: 'Welcome to Expense Tracker!'
  }
});
```

### Option 2: SendGrid (Production Ready)
✅ **Professional service**
✅ **High deliverability**
✅ **Templates and analytics**
✅ **API integration**

#### Setup SendGrid:
1. **Create account**: https://sendgrid.com/
2. **Verify sender domain**
3. **Create API key**
4. **Set up templates** (optional)

#### Backend API endpoint needed:
```javascript
// Example Express.js endpoint
app.post('/api/send-login-notification', async (req, res) => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: req.body.email,
    from: 'noreply@expensetracker.com',
    subject: req.body.action,
    text: req.body.message,
    html: `<strong>${req.body.message}</strong>`
  };
  
  await sgMail.send(msg);
  res.json({ success: true });
});
```

### Option 3: Firebase Cloud Functions
✅ **Integrated with Firebase**
✅ **Serverless**
✅ **Secure**
✅ **Scalable**

#### Setup Cloud Functions:
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendLoginNotification = functions.https.onCall(async (data, context) => {
  const msg = {
    to: data.email,
    from: 'noreply@expensetracker.com',
    subject: data.action,
    text: data.message,
  };
  
  await sgMail.send(msg);
  return { success: true };
});
```

## 🛠️ Quick Setup with EmailJS

### 1. Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for free account
3. Verify your email

### 2. Add Email Service
1. Click **"Email Services"** → **"Add New Service"**
2. Select **"Gmail"** (or your preferred service)
3. Connect your Gmail account
4. Note the **Service ID**

### 3. Create Email Template
1. Click **"Email Templates"** → **"Create New Template"**
2. Design your template:

#### Login Notification Template:
```
Subject: Expense Tracker - Login Successful

Hello {{display_name}},

Login successful at {{timestamp}}.

Details:
- Email: {{email}}
- Action: {{action}}
- IP Address: {{ip_address}}
- User Agent: {{user_agent}}

If this wasn't you, please secure your account immediately.

Best regards,
Expense Tracker Team
```

#### Welcome Email Template:
```
Subject: Welcome to Expense Tracker!

Welcome {{display_name}}!

Thank you for joining Expense Tracker. Here's what you can do:

📊 Track your daily expenses
💰 Set monthly budgets  
📈 View spending analytics
🤖 Get AI-powered insights

Get started by adding your first expense!

Best regards,
Expense Tracker Team
```

### 4. Get Your Keys
1. **Service ID** - From Email Services
2. **Template ID** - From Email Templates  
3. **Public Key** - From Account → Integration → API Keys

### 5. Update Your App
```javascript
// Update authService.js
const EMAILJS_CONFIG = {
  service_id: 'your_service_id',
  template_id_login: 'your_login_template_id',
  template_id_welcome: 'your_welcome_template_id',
  public_key: 'your_public_key'
};

// In sendEmail method
await emailjs.send('service_id', 'template_id', template_params);
```

## 📱 Testing Your Setup

### 1. Test Login Notification
1. Login to your app
2. Check your email
3. Verify notification received

### 2. Test Welcome Email  
1. Create new account
2. Check your email
3. Verify welcome message

### 3. Test Google Login
1. Use Google authentication
2. Check your email
3. Verify notification received

## 🔧 Troubleshooting

### Issue: Email not sending
**Solutions:**
- Check EmailJS configuration
- Verify template variables
- Check network connectivity
- Check browser console for errors

### Issue: Template variables not working
**Solutions:**
- Ensure variable names match
- Check template syntax: `{{variable_name}}`
- Verify data passed to template

### Issue: CORS errors
**Solutions:**
- Add your domain to EmailJS allowed origins
- Check API endpoint configuration
- Verify backend CORS settings

## 📊 Email Templates Examples

### Login Success Template:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
    <h1>🔐 Login Successful</h1>
  </div>
  <div style="padding: 20px; background: #f8f9fa;">
    <p>Hello {{display_name}},</p>
    <p>Your login to Expense Tracker was successful at {{timestamp}}.</p>
    <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3>Login Details:</h3>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Action:</strong> {{action}}</p>
      <p><strong>IP Address:</strong> {{ip_address}}</p>
    </div>
    <p>If this wasn't you, please secure your account immediately.</p>
  </div>
</div>
```

### Welcome Email Template:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
    <h1>🎉 Welcome to Expense Tracker!</h1>
  </div>
  <div style="padding: 20px; background: #f8f9fa;">
    <p>Welcome {{display_name}}!</p>
    <p>Thank you for joining Expense Tracker. Here's what you can do:</p>
    <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3>🚀 Get Started:</h3>
      <ul>
        <li>📊 Track your daily expenses</li>
        <li>💰 Set monthly budgets</li>
        <li>📈 View spending analytics</li>
        <li>🤖 Get AI-powered insights</li>
      </ul>
    </div>
    <p>Get started by adding your first expense!</p>
  </div>
</div>
```

## ✅ Security Features

### What We Track:
- ✅ **Login timestamps**
- ✅ **IP addresses**
- ✅ **User agent strings**
- ✅ **Login type** (email/password vs Google)
- ✅ **Failed login attempts**

### Security Best Practices:
- ✅ **Email notifications** for all logins
- ✅ **Secure password handling**
- ✅ **Session management**
- ✅ **Logout functionality**

---

**Your expense tracker now has a complete authentication system with email notifications!** 🎉

**Choose the email service that best fits your needs and follow the setup guide!** 🚀
