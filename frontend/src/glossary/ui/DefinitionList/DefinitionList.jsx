import {DefinitionBlock} from "../DefinitionBlock"
import {Title} from "../Title"

function DefinitionList({entries, handleTitleClick}) {
  return (
    entries.map(terms => {
      if (terms.length === 0) {
        return null
      }
      const [[term]] = terms
      const definitions = terms.map(([_, def]) => def)

      const titleNode = (
        <Title term={term} onClick={handleTitleClick} />
      )

      return (
        <DefinitionBlock
          key={term}
          titleNode={titleNode}
          definitions={definitions}
        />
      )
    })
  )
}

export {DefinitionList}
