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

    # if running on Cloud, run with Gunicorn (and new relic)
    else:
        new_relic_config_file = os.environ.get('NEW_RELIC_CONFIG_FILE', 'newrelic.ini')
        subprocess.run([
            "newrelic-admin", "run-program", "gunicorn", "-w", "2", "-b",
            f"0.0.0.0:{os.environ.get('PORT')}",
            "app.app:app"
        ], env=dict(os.environ, NEW_RELIC_CONFIG_FILE=new_relic_config_file))
