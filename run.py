from app.app import app
import os
import subprocess
from gunicorn.app.wsgiapp import WSGIApplication
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

if __name__ == '__main__':

    print(os.environ.get("RUN_DEV"), os.environ.get("PORT"))
    run_dev = os.environ.get("RUN_DEV") == "true"

    # If running locally, run the app with Flask's built-in server
    if run_dev:
        app.run(
            host='0.0.0.0',
            port=os.environ.get("PORT"),
            use_reloader=False,
            debug=True
        )

    # If running on Heroku, run the app with Gunicorn
    else:
        subprocess.run([
            "gunicorn", "-w", "2", "-b",
            f"0.0.0.0:{(os.environ.get('PORT'))}",
            "app.app:app"
        ])