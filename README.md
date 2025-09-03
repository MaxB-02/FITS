# FITS Python - Freak in the Sheets

A Python web application for custom automation and dashboard management, converted from Next.js to FastAPI.

## Features

- **Inquiry Management**: Handle project inquiries with file uploads
- **Admin Dashboard**: Manage inquiries, templates, and portfolio
- **Template System**: Create and manage project templates
- **Portfolio Showcase**: Display completed projects
- **Authentication**: Simple admin authentication system
- **File Uploads**: Handle file uploads for inquiries
- **Email Notifications**: Send email notifications for new inquiries

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Jinja2 Templates + Tailwind CSS
- **Database**: JSON file-based storage
- **Authentication**: JWT tokens
- **File Storage**: Local file system
- **Email**: Resend API

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run the Application

```bash
python run.py
```

The application will be available at:
- **Main Site**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/docs

### 4. Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Project Structure

```
fits-python/
├── app/
│   ├── main.py              # FastAPI application
│   ├── services/            # Business logic services
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication middleware
│   └── templates/           # Jinja2 HTML templates
├── static/                  # CSS, JS, and static files
├── data/                    # JSON database files
├── uploads/                 # File uploads
├── requirements.txt         # Python dependencies
├── run.py                   # Startup script
└── README.md               # This file
```

## API Endpoints

### Public Endpoints
- `GET /` - Home page
- `GET /inquire` - Inquiry form
- `POST /api/inquire` - Submit inquiry
- `GET /portfolio` - Portfolio page
- `GET /templates` - Templates page

### Admin Endpoints
- `GET /admin` - Admin dashboard
- `GET /admin/inquiries` - Manage inquiries
- `GET /admin/templates` - Manage templates
- `GET /admin/portfolio` - Manage portfolio
- `POST /login` - Admin login
- `POST /logout` - Admin logout

### API Routes
- `GET /api/admin/inquiries` - Get all inquiries
- `PUT /api/admin/inquiries/{id}` - Update inquiry
- `DELETE /api/admin/inquiries/{id}` - Delete inquiry
- `GET /api/admin/templates` - Get all templates
- `POST /api/admin/templates` - Create template
- `PUT /api/admin/templates/{id}` - Update template
- `DELETE /api/admin/templates/{id}` - Delete template
- `GET /api/admin/portfolio` - Get all portfolio projects
- `POST /api/admin/portfolio` - Create portfolio project
- `PUT /api/admin/portfolio/{id}` - Update portfolio project
- `DELETE /api/admin/portfolio/{id}` - Delete portfolio project

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# JWT Secret Key
SECRET_KEY=your-secret-key-here

# Email Configuration (optional)
RESEND_API_KEY=your-resend-api-key
NOTIFICATION_EMAIL=admin@yourdomain.com

# Data Directory (optional)
DATA_DIR=./data
```

### Database

The application uses JSON files for data storage:
- `data/leads.json` - Inquiry data
- `data/templates.json` - Template data
- `data/portfolio.json` - Portfolio data

## Development

### Running in Development Mode

```bash
python run.py
```

This will start the server with auto-reload enabled.

### Running with Uvicorn Directly

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Adding New Features

1. **Services**: Add business logic in `app/services/`
2. **Routes**: Add API routes in `app/routes/`
3. **Templates**: Add HTML templates in `app/templates/`
4. **Static Files**: Add CSS/JS in `static/`

## Deployment

### Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production WSGI server like Gunicorn with Uvicorn workers
3. Set up a reverse proxy (nginx) for static files
4. Configure proper file permissions for uploads directory

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "run.py"]
```

## Migration from Next.js

This Python application is a complete conversion of the original Next.js application with the following improvements:

- **Cleaner Code**: Python's syntax is more readable and maintainable
- **Better Error Handling**: Python's exception handling is more straightforward
- **Type Safety**: Pydantic models provide better data validation
- **Simpler Deployment**: No build step required
- **Better Performance**: FastAPI is extremely fast and efficient

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port in `run.py` or kill the process using port 8000
2. **Permission Errors**: Ensure the application has write permissions to `data/` and `uploads/` directories
3. **Import Errors**: Make sure all dependencies are installed with `pip install -r requirements.txt`

### Logs

The application logs to the console. For production, consider using a proper logging configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on the GitHub repository or contact the development team.