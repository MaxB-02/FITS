# FITS Deployment Guide

## Current Status
The FITS Python application is fully converted and ready for deployment. However, AWS Amplify is designed for static sites and doesn't natively support Python web applications.

## Deployment Options

### Option 1: AWS App Runner (Recommended for AWS)
1. **Go to AWS App Runner console**
2. **Create service** → **Source**: GitHub
3. **Connect your repository**: MaxB-02/FITS
4. **Configure**:
   - Runtime: Python 3
   - Build command: `pip install -r requirements.txt`
   - Start command: `python3 app.py`
5. **Deploy automatically**

### Option 2: Heroku
1. **Install Heroku CLI**
2. **Login to Heroku**: `heroku login`
3. **Create Heroku app**: `heroku create fits-app`
4. **Deploy**: `git push heroku main`
5. **Set environment variables**:
   ```bash
   heroku config:set ADMIN_USERNAME=admin
   heroku config:set ADMIN_PASSWORD=admin123
   heroku config:set SECRET_KEY=fits-secret-key-2024
   ```

### Option 2: Railway
1. **Connect GitHub repository**
2. **Deploy automatically**
3. **Set environment variables in Railway dashboard**

### Option 3: Render
1. **Connect GitHub repository**
2. **Select "Web Service"**
3. **Set build command**: `pip install -r requirements.txt`
4. **Set start command**: `python3 app.py`

### Option 4: DigitalOcean App Platform
1. **Connect GitHub repository**
2. **Select Python runtime**
3. **Set start command**: `python3 app.py`

## Local Development
```bash
# Install dependencies
pip3 install -r requirements.txt

# Run locally
python3 main.py

# Access application
# http://localhost:8000
```

## Environment Variables
- `ADMIN_USERNAME`: Admin username (default: admin)
- `ADMIN_PASSWORD`: Admin password (default: admin123)
- `SECRET_KEY`: JWT secret key (default: fits-secret-key-2024)
- `PORT`: Server port (default: 8000)

## Features
- ✅ Inquiry management with file uploads
- ✅ Admin dashboard with statistics
- ✅ Template management system
- ✅ Portfolio showcase
- ✅ Authentication system
- ✅ Responsive design

## Static Site (Current Amplify Setup)
The current AWS Amplify setup serves a static placeholder page that explains the application status and provides links to the GitHub repository.
