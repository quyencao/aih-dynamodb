import os
import yaml
from jinja2 import Template
from six import text_type as _text_type

def _create_serverless_yaml(args):
    with open(args.inputPath, "r") as c:
        doc = yaml.load(c.read(), Loader=yaml.FullLoader)

    tables = doc.get("tables")

    if tables is None:
        tables = []

    serverless_template = Template("""
service: {{ APP_ID }}
provider:
  name: aws
  stage: dev
  runtime: {{ RUNTIME }}
  {% if TABLES|length > 0 %}
  iamRoleStatements: # permissions for all of your functions can be set here
    - Effect: Allow
      Action: # Gives permission to DynamoDB tables in a specific region
        - dynamodb:DescribeTable
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource:
        {% for table in TABLES %}
        - "arn:aws:dynamodb:us-east-1:*:table/{{ [APP_ID, table]|join("_") }}"
        - "arn:aws:dynamodb:us-east-1:*:table/{{ [APP_ID, table]|join("_") }}/*"
        {% endfor %}
  {% endif %}
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
{% if TABLES|length > 0 %}
resources:
  Resources:
    {% for table in TABLES %}
    {{ table }}: 
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: {{ [APP_ID, table]|join("_") }}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
    {% endfor %}
{% endif %}
    """)
    serverless_text = serverless_template.render({ "APP_ID": args.appId, "TABLES": tables, "RUNTIME": args.runtime })

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
        '--inputPath', '-i',
        type=_text_type,
        help="Client config input file",
        default="config.yaml"
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
