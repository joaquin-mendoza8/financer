# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to /app in the container
COPY . .

# Expose the port that Gunicorn will run on
EXPOSE 8000

# Command to run the Flask app with Gunicorn
CMD ["python3", "run.py"]
