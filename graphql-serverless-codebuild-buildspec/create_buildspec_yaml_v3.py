import os
import yaml
import json
from jinja2 import Template
from six import text_type as _text_type

def _create_buildspec_yaml(appId, db_host, db_port, db_name, db_username, db_password, runtime="nodejs"):
    serverless_runtime = "nodejs10.x" if runtime == "nodejs" else "python3.6"
    buildspec_template = Template("""
version: 0.2

phases:
  install:
    runtime-versions:
       python: 3.7
       nodejs: 10
    commands:
       - npm install -g serverless
       - pip install Jinja2
       - pip install pyyaml
       - pip install six
       {% if BUILD_SPEC_RUNTIME == "nodejs" %}
       - npm install
       - npm install apollo-server-lambda
       - npm install aih-dynamodb
       {% else %}
       - npm install graphql-playground-middleware-lambda
       - pip install virtualenv
       {% endif %}
  pre_build:
    commands:
       - wget https://aih-libs.s3.amazonaws.com/create_serverless_yaml.py
       - python create_serverless_yaml.py -a {{ APP_ID }} -r {{ SERVERLESS_RUNTIME }} -hn {{ DB_HOST }} -p {{ DB_PORT }} -n {{ DB_NAME }} -u {{ DB_USERNAME }} -pw {{ DB_PASSWORD }}
       {% if BUILD_SPEC_RUNTIME == "nodejs" %}
       - wget https://aih-libs.s3.amazonaws.com/graphqlServer.js
       {% else %}
       - wget https://aih-libs.s3.amazonaws.com/playgroundServer.js
       - wget https://aih-libs.s3.amazonaws.com/graphqlServer.py
       - npm init -y
       - npm install serverless-python-requirements
       - virtualenv -p python3 venv
       - . venv/bin/activate
       - pip install -r requirements.txt
       - pip install graphene
       - pip freeze > requirements.txt 
       {% endif %}
  build:
    commands:
       - serverless deploy
  post_build:
    commands:
       - URL="$(serverless info --verbose | grep ServiceEndpoint | sed s/ServiceEndpoint\:\ //g)/graphql"
       - echo $URL
    """)
    buildspec_text = buildspec_template.render({ 
        "APP_ID": appId, 
        "BUILD_SPEC_RUNTIME": runtime, 
        "SERVERLESS_RUNTIME": serverless_runtime,
        "DB_HOST": db_host,
        "DB_PORT": db_port,
        "DB_NAME": db_name,
        "DB_USERNAME": db_username,
        "DB_PASSWORD": db_password
    })

    # with open(args.outputPath, mode="w") as f:
    #     f.write(serverless_text)

    return buildspec_text

if __name__ == "__main__":
    text = _create_buildspec_yaml("rdsgrapghqldemo", "appidhere2.c2ibmw2zmffn.us-east-1.rds.amazonaws.com", 5432, "graphql", "graphql", "password")
    # text = _create_buildspec_yaml("abcde123456", "nodejs")
    print(text)
