FROM python:3.6.4

RUN mkdir /opt/app
WORKDIR /opt/app

RUN pip install flask gunicorn[gevent]

COPY app.py ./

ENTRYPOINT ["gunicorn", "app:app"]
