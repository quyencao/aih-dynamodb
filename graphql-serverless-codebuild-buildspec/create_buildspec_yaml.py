import os
import yaml
import json
from jinja2 import Template
from six import text_type as _text_type

def _create_buildspec_yaml(appId, runtime="nodejs"):
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
       - pip install virtualenv
       {% endif %}
  pre_build:
    commands:
       - wget https://aih-libs.s3.amazonaws.com/create_serverless_yaml.py
       - python create_serverless_yaml.py -a {{ APP_ID }} -r {{ SERVERLESS_RUNTIME }}
       {% if BUILD_SPEC_RUNTIME == "nodejs" %}
       - wget https://aih-libs.s3.amazonaws.com/graphqlServer.js
       {% else %}
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
    buildspec_text = buildspec_template.render({ "APP_ID": appId, "BUILD_SPEC_RUNTIME": runtime, "SERVERLESS_RUNTIME": serverless_runtime })

    # with open(args.outputPath, mode="w") as f:
    #     f.write(serverless_text)

    return buildspec_text

if __name__ == "__main__":
    text = _create_buildspec_yaml("pythonappid123654", "python")
    # text = _create_buildspec_yaml("abcde123456", "nodejs")
    print(text)
