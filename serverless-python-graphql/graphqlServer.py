import json
import graphene
from Query import Query
from Mutation import Mutation

schema = graphene.Schema(query=Query, mutation=Mutation)

############################ GRAPHQL HANDLER ################################

def handler(eventRequestBody, context = {}):
  try:
    requestBody = json.loads(eventRequestBody)
  except:
    requestBody = {}
  query = ''
  variables = {}
  if ('query' in requestBody):
    query = requestBody['query']
  if ('variables' in requestBody):
    variables = requestBody['variables']
  executionResult = schema.execute(query, variables=variables)

  responseBody = {
    "data": dict(executionResult.data) if executionResult.data != None else None,
  }
  if (executionResult.errors != None):
    responseBody['errors'] = []
    for error in executionResult.errors:
      responseBody['errors'].append(str(error))
  return responseBody

######################### LAMBDA HANDLER ####################################

responseHeaders = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
}

def graphqlHandler(event, context):
  httpMethod = event.get('httpMethod')
  if (httpMethod == 'OPTIONS'):
    return {
      'statusCode': 200,
      'headers': responseHeaders,
      'body': ''
    }
  requestBody = event.get('body')
  responseBody = handler(requestBody, context)
  return {
    'statusCode': 200,
    'headers': responseHeaders,
    'body': json.dumps(responseBody)
  }