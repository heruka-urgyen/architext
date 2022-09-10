MAKEFLAGS += -j2

start: start_backend start_frontend

start_backend:
	pyenv exec gunicorn app:architext --reload

start_frontend:
	cd frontend && npm start

build:
	cd frontend && npm run build
