import graphene

class Mutation(graphene.ObjectType):
    world = graphene.String()

    def resolve_world(self, info):
        return "Hello"