from flask import Flask
import time

app = Flask(__name__)

@app.route("/")
def ping():
    return "python - ping"

@app.route("/timeout")
def timeout():
    time.sleep(5)
    return "python - timeout"


if __name__ == '__main__':
    app.run()

