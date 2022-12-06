MAKEFLAGS += -j4

start: start_language_servers start_backend start_frontend

install: install_python install_frontend install_backend

start_language_servers:
	cd ./language_servers/tibetan && pyenv exec gunicorn app:architext --reload

start_backend:
	cd backend && npm start

start_frontend:
	cd frontend && npm start

install_python:
	cd ./language_servers/tibetan/ &&	pyenv exec pip install -r requirements.txt

install_frontend:
	cd frontend && npm install

install_backend:
	cd backend && npm install

build:
	cd frontend && npm run build
