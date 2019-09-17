FROM python:3.6.4

RUN mkdir /opt/app
WORKDIR /opt/app

COPY app.py ./

RUN pip install flask gunicorn
ENTRYPOINT ["gunicorn", "app:app", "-b 0.0.0.0:4000"]
