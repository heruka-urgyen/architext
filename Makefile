MAKEFLAGS += -j2

start: start_backend start_frontend

start_backend:
	pyenv exec gunicorn app:architext --reload

start_frontend:
	cd frontend && npm start

install:
	pyenv exec pip install -r requirements.txt && cd frontend && npm install


build:
	cd frontend && npm run build
