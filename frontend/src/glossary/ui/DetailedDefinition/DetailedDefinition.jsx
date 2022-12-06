import {BackArrow} from "../BackArrow"
import {DefinitionBlock} from "../DefinitionBlock"
import {Title} from "../Title"

function DetailedDefinition({term, definitions, goBack}) {
  const titleNode = <Title term={term} />

  return (
    <>
      <BackArrow onMouseDown={goBack} />
      {definitions.filter(x => Array.isArray(x.definitions)).map(definition => (
        <div key={definition.dictionary}>
          <h1>{definition.dictionary}</h1>
          <DefinitionBlock
            titleNode={titleNode}
            definitions={definition.definitions}
          />
        </div>
      ))}
    </>
  )
}

export {DetailedDefinition}
