import os
import yaml
from jinja2 import Template
from six import text_type as _text_type

def _create_serverless_yaml(args):
    serverless_template = Template("""
service: {{ APP_ID }}
provider:
  name: aws
  stage: dev
  runtime: {{ RUNTIME }}
  environment:
    DB_HOST: {{ DB_HOST }}
    DB_PORT: {{ DB_PORT }}
    DB_NAME: {{ DB_NAME }}
    DB_USERNAME: {{ DB_USERNAME }}
    DB_PASSWORD: {{ DB_PASSWORD }}
{% if RUNTIME == "python3.6" %}
plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: non-linux
{% endif %}
functions:
  {% if RUNTIME == "python3.6" %}
  graphql:
    # this is formatted as <FILENAME>.<HANDLER>
    handler: graphqlServer.graphqlHandler
    events:
      - http:
          path: graphql
          method: post
          cors: true
  playground:
    handler: playgroundServer.playgroundHandler
    runtime: nodejs10.x
    events:
      - http:
          path: graphql
          method: get
          cors: true
  {% else %}
  graphql:
    # this is formatted as <FILENAME>.<HANDLER>
    handler: graphqlServer.graphqlHandler
    events:
      - http:
          path: graphql
          method: post
          cors: true
      - http:
          path: graphql
          method: get
          cors: true
  {% endif %}
    """)
    serverless_text = serverless_template.render({ 
        "APP_ID": args.appId, 
        "RUNTIME": args.runtime, 
        "DB_HOST": args.host, 
        "DB_PORT": args.port,
        "DB_NAME": args.name,
        "DB_USERNAME": args.username,
        "DB_PASSWORD": args.password
    })

    with open(args.outputPath, mode="w") as f:
        f.write(serverless_text)

def _get_parser():
    import argparse

    parser = argparse.ArgumentParser(description="Create serverless yaml file")

    parser.add_argument(
        "--appId", "-a",
        type=_text_type,
        help="App ID"
    )

    parser.add_argument(
      "--runtime", "-r",
      type=_text_type,
      help="Runtime",
      default="nodejs10.x"
    )

    parser.add_argument(
      "--host", "-hn",
      type=_text_type,
      help="Database Host"
    )

    parser.add_argument(
      "--port", "-p",
      type=_text_type,
      help="Port"
    )

    parser.add_argument(
      "--name", "-n",
      type=_text_type,
      help="Database Name"
    )

    parser.add_argument(
      "--username", "-u",
      type=_text_type,
      help="Database username"
    )

    parser.add_argument(
      "--password", "-pw",
      type=_text_type,
      help="Database password"
    )

    parser.add_argument(
        "--outputPath", "-o",
        type=_text_type,
        help="Serverless config output file",
        default="serverless.yaml"
    )

    return parser

def _main():
    parser = _get_parser()
    args = parser.parse_args()
    _create_serverless_yaml(args)

if __name__ == "__main__":
    _main()
