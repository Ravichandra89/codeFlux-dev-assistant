# 🚀 Installation Guide for codeFlux

Welcome to **codeFlux** — your personal AI-powered repository assistant.  
This guide will help you set up and run codeFlux smoothly, whether for local development or production deployment.

---

## 🛠 Prerequisites

Before installing, ensure the following are available on your system:

- [**Node.js**](https://nodejs.org/) (v18 or higher)  
- [**Git**](https://git-scm.com/)  
- [**Python**](https://www.python.org/) (v3.9 or higher)  
- Package Manager: **npm** or **yarn**  
- *(Optional)* [**Docker**](https://www.docker.com/) — for containerized deployment  

---

## ⚡ Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ravichandra89/codeFlux.git
cd codeFlux
```

### 2. Install Dependencies
```bash
npm install

# or with yarn: 
yarn install

```
### 3. Configure Environment Variables

Duplicate the sample environment file and update it as needed:
```bash
cp .env.example .env

```

### ▶️ Running codeFlux

Development Mode (Hot Reload)
```bash
npm run dev
# or
yarn dev

```

Production Mode 
```bash
npm run build
npm start

```
## ✅ Verify Installation

Start the server.

Open your browser and navigate to:
👉 http://localhost:3000

If you see the codeFlux dashboard, your setup is complete! 🎉

## 📌 Next Steps

Read the Usage Guide
 to start using codeFlux.

Explore Configuration Options
 for advanced setups.