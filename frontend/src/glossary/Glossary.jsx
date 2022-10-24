import {useState} from "react"
import {useRecoilValue} from "recoil"

import {withGlossary, withSearchTerm} from "../states/glossary"
import {Maybe} from "../ui/Maybe"

import {DefinitionList} from "./ui/DefinitionList"
import {DetailedDefinition} from "./ui/DetailedDefinition"

function Glossary() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState(null)

  const entries = useRecoilValue(withGlossary)
  const searchTerm = useRecoilValue(withSearchTerm(currentSearchTerm))

  return (
    <div className="glossary">
      <Maybe
        if={currentSearchTerm != null}
        then={
          <DetailedDefinition
            term={searchTerm.term}
            definitions={searchTerm.results}
            goBack={_ => setCurrentSearchTerm(null)}
          />
        }
        else={
          <Maybe
            if={entries.length > 0}
            then={
              <DefinitionList
                entries={entries}
                handleTitleClick={setCurrentSearchTerm}
              />
            }
          />
        }
      />
    </div>
  )
}

export {Glossary}
