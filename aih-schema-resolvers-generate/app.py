import os
import yaml
from jinja2 import FileSystemLoader, Environment

def create_graphql_schema():
    with open("config.yaml", "r") as c:
        doc = yaml.load(c.read(), Loader=yaml.FullLoader)

    base_dir = os.getcwd()
    template_dir = os.path.join(base_dir, "templates")
    templateLoader = FileSystemLoader(searchpath=template_dir)
    templateEnv = Environment(loader=templateLoader, trim_blocks=True, lstrip_blocks=True)
    
    schema_template = templateEnv.get_template("schema.graphql.jinja2")

    schema_output = schema_template.render({ "types": doc["types"] })

    with open("shema.graphql", mode="w") as s:
        s.write(schema_output)

def create_graphql_resolver():
    with open("config.yaml", "r") as c:
        doc = yaml.load(c.read(), Loader=yaml.FullLoader)

    base_dir = os.getcwd()
    template_dir = os.path.join(base_dir, "templates")
    templateLoader = FileSystemLoader(searchpath=template_dir)
    templateEnv = Environment(loader=templateLoader, trim_blocks=True, lstrip_blocks=True)
    
    resolver_template = templateEnv.get_template("resolvers.js.jinja2")

    resolver_output = resolver_template.render({ "types": doc["types"] })

    with open("resolvers.js", mode="w") as r:
        r.write(resolver_output)
        
if __name__ == "__main__":
    # create_graphql_schema()
    create_graphql_resolver()
