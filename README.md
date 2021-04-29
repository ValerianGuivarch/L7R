# Install

Install python3 and dependencies: `sudo apt-get install python3 python3-venv`

Create the virtual environment: `python3 -m venv ./venv`

Switch into the virtual environment: `source venv/bin/activate`

Install project dependencies: `pip install -r requirements.txt`

# Run in dev mode

Switch into the virtual environment if you're not already in it: `source venv/bin/activate`

Run the app: `python manage.py runserver 0.0.0.0:8000`
