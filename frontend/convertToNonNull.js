/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra')
const graphql = require('graphql')

function convertToNonNull(n) {
  if (n.type.kind !== 'NamedType') {
    throw new Error('Only lists of named types should be converted')
  }
  return {
    kind: 'NonNullType',
    type: {
      kind: 'ListType',
      type: {
        kind: 'NonNullType',
        type: n.type
      }
    }
  }
}

async function convert(inputFile, outputFile) {
  const schema = graphql.parse(await fs.readFile(inputFile, 'utf8'))
  const visitor = {
    FieldDefinition: node => {
      if (node.type.kind === 'ListType' && node.arguments?.length) {
        return {
          ...node,
          type: convertToNonNull(node.type)
        }
      }
    }
  }
  const newSchema = graphql.visit(schema, visitor)
  await fs.outputFile(outputFile, graphql.print(newSchema), 'utf8')
}

convert('schema-temp.gql', 'schema.gql')

fs.unlinkSync('schema-temp.gql')
