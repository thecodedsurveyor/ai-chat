# Git Configuration Guide

## 🔍 **How to Check Your Git Details**

### **Method 1: Check Individual Settings**

```bash
# Check your username
git config user.name

# Check your email
git config user.email

# Check if settings are global or local
git config --global user.name
git config --global user.email
```

### **Method 2: View All Git Configuration**

```bash
# Show all global Git settings
git config --global --list

# Show all settings (global + local)
git config --list

# Show settings with their source files
git config --list --show-origin
```

### **Method 3: Check Specific Configuration**

```bash
# Check Git version
git --version

# Check current repository settings
git config --local --list

# Check where Git is installed
where git
```

## ⚙️ **Setting Up Your Git Details**

### **If Git Details Are Not Set:**

#### **Set Global Configuration (Recommended):**

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
```

#### **Example:**

```bash
git config --global user.name "John Smith"
git config --global user.email "johnsmith@gmail.com"
```

### **If Git Details Are Wrong:**

#### **Update Global Settings:**

```bash
git config --global user.name "Correct Name"
git config --global user.email "correct.email@example.com"
```

#### **Set for This Project Only:**

```bash
git config user.name "Project Specific Name"
git config user.email "project.email@example.com"
```

## 🛠️ **Troubleshooting Git Installation**

### **If Git Commands Don't Work:**

#### **Windows:**

1. **Download Git:** Go to [git-scm.com](https://git-scm.com/download/win)
2. **Install Git for Windows**
3. **Restart your terminal/command prompt**
4. **Verify installation:** `git --version`

#### **Alternative: GitHub Desktop**

-   Download from [desktop.github.com](https://desktop.github.com)
-   Provides a visual interface for Git
-   Automatically installs Git command line tools

### **If Git is Installed but Not Responding:**

```bash
# Check if Git is in your PATH
echo %PATH%

# Find Git installation
where git

# Try full path (example)
"C:\Program Files\Git\bin\git.exe" --version
```

## 📋 **Current Status Check**

### **Run These Commands to Diagnose:**

```bash
# 1. Check Git installation
git --version

# 2. Check current user settings
git config user.name
git config user.email

# 3. Check global settings
git config --global user.name
git config --global user.email

# 4. View all configuration
git config --list
```

### **Expected Output:**

```bash
# Git version (should show version number)
git version 2.x.x.windows.x

# User settings (should show your name and email)
Your Name
your.email@example.com
```

## 🎯 **What You Need for GitHub**

### **Required Information:**

-   **Name:** Your real name or preferred display name
-   **Email:** Must match your GitHub account email
-   **GitHub Username:** For repository URLs

### **Example Setup:**

```bash
git config --global user.name "Jane Developer"
git config --global user.email "jane.developer@gmail.com"
```

## 🔄 **After Setting Up Git Details**

### **Verify Your Settings:**

```bash
git config --global --list
```

### **Test with a Commit:**

```bash
git add .
git commit -m "Test commit with new Git configuration"
```

### **Check Commit Author:**

```bash
git log --oneline -1
git show --format=fuller HEAD
```

## 🚨 **Important Notes**

### **Email Matching:**

-   Use the same email for Git and GitHub
-   GitHub uses email to link commits to your account
-   You can add multiple emails to your GitHub account

### **Privacy Settings:**

-   GitHub can hide your email in commits
-   Use `username@users.noreply.github.com` for privacy
-   Configure in GitHub Settings > Emails

### **Global vs Local:**

-   **Global:** Applies to all Git repositories on your computer
-   **Local:** Applies only to the current repository
-   Local settings override global settings

## ✅ **Quick Setup Checklist**

-   [ ] Git is installed (`git --version` works)
-   [ ] Username is set (`git config user.name`)
-   [ ] Email is set (`git config user.email`)
-   [ ] Email matches GitHub account
-   [ ] Settings are global (`git config --global --list`)
-   [ ] Test commit works

## 🆘 **Need Help?**

### **If Nothing Works:**

1. **Install Git from [git-scm.com](https://git-scm.com)**
2. **Restart your terminal**
3. **Follow the setup commands above**
4. **Contact support if issues persist**

### **Alternative Solutions:**

-   **GitHub Desktop:** Visual Git interface
-   **VS Code:** Built-in Git integration
-   **GitKraken:** Another visual Git client

Your Git configuration is essential for proper version control and GitHub integration!
