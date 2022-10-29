import {DefinitionBlock} from "../DefinitionBlock"
import {Title} from "../Title"

function DefinitionList({entries, handleTitleClick}) {
  return entries.map(entry => (
    <div key={entry.dictionary}>
      <h1>{entry.dictionary}</h1>

      {entry.definitions.map(terms => {
        if (terms.length === 0) {
          return null
        }
        const [term, ...definitions] = terms
        const titleNode = <Title term={term} onClick={handleTitleClick} />

        return (
          <DefinitionBlock
            key={term}
            titleNode={titleNode}
            definitions={definitions}
          />
        )
      })}
    </div>
  ))
}

export {DefinitionList}
