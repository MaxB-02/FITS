# FITS Python - Freak in the Sheets

A clean Python web application for custom automation and dashboard management.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python3 main.py
   ```

3. **Access the application:**
   - **Main Site**: http://localhost:8000
   - **Admin Panel**: http://localhost:8000/admin
   - **API Docs**: http://localhost:8000/docs

## Admin Login

- **Username**: `admin`
- **Password**: `admin123`

## Features

- ✅ Inquiry management with file uploads
- ✅ Admin dashboard with statistics
- ✅ Template management system
- ✅ Portfolio showcase
- ✅ Authentication system
- ✅ Responsive design

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Jinja2 Templates + Tailwind CSS
- **Database**: JSON file-based storage
- **Authentication**: JWT tokens

## Project Structure

```
fits-python/
├── app/
│   ├── main.py              # FastAPI application
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication
│   └── templates/           # HTML templates
├── static/                  # CSS files
├── data/                    # JSON database
├── uploads/                 # File uploads
├── requirements.txt         # Dependencies
└── main.py                  # Startup script
```

## Development

The application runs with auto-reload enabled for development. Any changes to Python files will automatically restart the server.

## Deployment

For production deployment, use a production WSGI server like Gunicorn with Uvicorn workers.