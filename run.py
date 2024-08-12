from app.app import app
import os
import subprocess
from dotenv import load_dotenv

# load env variables from .env file (dev only)
load_dotenv()

if __name__ == '__main__':

    run_dev = os.environ.get("RUN_DEV") == "True"

    # if running locally, run the app with Flask's built-in server
    if run_dev:
        app.run(
            host='0.0.0.0',
            port=os.environ.get("PORT"),
            use_reloader=False,
            debug=True
        )

    # if running on Cloud, run with Gunicorn
    else:
        subprocess.run([
            "gunicorn", "-w", "2", "-b",
            f"0.0.0.0:{(os.environ.get('PORT'))}",
            "app.app:app"
        ])