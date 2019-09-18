from flask import Flask
import time

app = Flask(__name__)

@app.route("/")
def ping():
    return "python - ping\n"

@app.route("/timeout")
def timeout():
    time.sleep(5)
    return "python - timeout\n"

@app.route("/intensive")
def intensive():
    timeout = time.time() + 5
    while timeout > time.time():
        pass
    return "python - intensive\n"


if __name__ == '__main__':
    app.run()

