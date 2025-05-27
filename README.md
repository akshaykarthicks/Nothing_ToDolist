# Django User Management System

A Django-based web application that handles both guest and registered user management with a modern, responsive design.

## Features

- User Authentication (Login/Register)
- Guest User Support
- User Data Management
- Responsive Design
- Session Management
- Secure Password Handling
- CSRF Protection

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.x
- pip (Python package installer)
- Virtual Environment (recommended)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd mypro
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

4. Copy `.env.sample` to `.env` and update the values:
```bash
cp .env.sample .env
```

5. Update the following in `.env`:
   - Generate a new SECRET_KEY
   - Set DEBUG=True for development
   - Add your domain to ALLOWED_HOSTS

6. Run migrations:
```bash
python manage.py migrate
```

7. Create a superuser (admin):
```bash
python manage.py createsuperuser
```

8. Run the development server:
```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

## Project Structure

```

## Setup Instructions

1. Clone the repository
2. Create a virtual environment
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.sample` to `.env` and update the values:
   ```bash
   cp .env.sample .env
   ```
5. Update the following in `.env`:
   - Generate a new SECRET_KEY
   - Set DEBUG=True for development
   - Add your domain to ALLOWED_HOSTS
6. Run migrations:
   ```bash
   python manage.py migrate
   ```
7. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
8. Run the development server:
   ```bash
   python manage.py runserver
   ```

## Security Notes
- Never commit `.env` file
- Keep your SECRET_KEY secure
- Set DEBUG=False in production
- Use strong passwords
- Regularly update dependencies
