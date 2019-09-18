FROM python:3.6.4

RUN mkdir /opt/app
WORKDIR /opt/app

RUN pip install flask gunicorn

COPY app.py ./

ENTRYPOINT ["gunicorn", "app:app", "-b 0.0.0.0:4000"]
