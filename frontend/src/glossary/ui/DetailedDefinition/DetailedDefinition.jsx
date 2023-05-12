import {BackArrow} from "../BackArrow"
import {DefinitionList} from "../DefinitionList"
import {Title} from "../Title"
import {Maybe} from "../../../ui/Maybe"

function NoDefinition({term}) {
  return (
    <>
      <Title term={term} />
      <p>No definitions found</p>
    </>
  )
}

function DetailedDefinition({term, entries, goBack}) {
  const definitions = entries.reduce((acc, entry) => {
    if (entry.definitions.length > 0) {
      return acc.concat(
        <li key={entry.dictionary}>
          <DefinitionList entry={entry} />
        </li>,
      )
    }

    return acc
  }, [])

  return (
    <>
      <BackArrow onMouseDown={goBack} />
      <Maybe
        if={definitions.length > 0}
        then={<ul>{definitions}</ul>}
        else={<NoDefinition term={term} />}
      />
    </>
  )
}

export {DetailedDefinition}
