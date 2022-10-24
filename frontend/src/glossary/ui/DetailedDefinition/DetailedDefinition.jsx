import {BackArrow} from "../BackArrow"
import {DefinitionBlock} from "../DefinitionBlock"
import {Title} from "../Title"

function DetailedDefinition({term, definitions, goBack}) {
  const titleNode = <Title term={term} />

  return (
    <>
      <BackArrow onMouseDown={goBack} />
      {definitions.map(definition =>(
        <>
          <h1>{definition.dictionary}</h1>
          <DefinitionBlock titleNode={titleNode} definitions={definition.definitions} />
        </>
      ))}
    </>
  )
}

export {DetailedDefinition}
