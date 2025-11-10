from python:3.11-slim

WORKDIR /app
COPY . /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .

run pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
