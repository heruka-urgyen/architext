import {BackArrow} from "../BackArrow"
import {DefinitionBlock} from "../DefinitionBlock"
import {Title} from "../Title"

function DetailedDefinition({term, definitions, goBack}) {
  const titleNode = (
    <Title term={term} />
  )

  return (
    <>
      <BackArrow onMouseDown={goBack} />
      <DefinitionBlock titleNode={titleNode} definitions={definitions} />
    </>
  )
}

export {DetailedDefinition}
