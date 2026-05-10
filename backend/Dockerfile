# backend/Dockerfile
# Start from official Python image
FROM python:3.11-slim
# Set working directory inside the container
WORKDIR /app
# Copy requirements first (for Docker layer caching)
COPY requirements.txt .
# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt
# Copy all backend code into the container
COPY . .
# Expose port 8000
EXPOSE 8000
# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
