import {DefinitionBlock} from "../DefinitionBlock"
import {Title} from "../Title"

function DefinitionList({entry, handleTitleClick}) {
  return (
    <>
      <h1>{entry.dictionary}</h1>
      <ul className="definition-list">
        {entry.definitions.map(terms => {
          if (terms.length === 0) {
            return null
          }
          const [term, definitions] = terms
          const titleNode = <Title term={term} onClick={handleTitleClick} />
          return (
            <li key={term}>
              <DefinitionBlock
                titleNode={titleNode}
                definitions={definitions}
                handleWordClick={handleTitleClick}
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}

export {DefinitionList}
