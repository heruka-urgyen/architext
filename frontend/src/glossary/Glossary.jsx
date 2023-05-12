import {Suspense, useState} from "react"
import {useRecoilValue} from "recoil"

import {withGlossary, withSearchTerm} from "../states/glossary"
import {Maybe} from "../ui/Maybe"

import {DefinitionList} from "./ui/DefinitionList"
import {DetailedDefinition} from "./ui/DetailedDefinition"
import {DictionarySelector} from "./ui/DictionarySelector"

function GlossaryData() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState(null)
  const entries = useRecoilValue(withGlossary)
  const searchTerm = useRecoilValue(withSearchTerm(currentSearchTerm))

  return (
    <Maybe
      if={currentSearchTerm != null}
      then={
        <DetailedDefinition
          term={searchTerm.term}
          entries={searchTerm.results}
          goBack={_ => setCurrentSearchTerm(null)}
        />
      }
      else={
        <ul className="dictionary-definition-list">
          {entries.map(entry => (
            <li key={entry.dictionary}>
              <DefinitionList
                entry={entry}
                handleTitleClick={setCurrentSearchTerm}
              />
            </li>
          ))}
        </ul>
      }
    />
  )
}

function Glossary() {
  return (
    <div className="glossary">
      <Suspense fallback={null}>
        <DictionarySelector />
      </Suspense>
      <Suspense fallback={null}>
        <GlossaryData />
      </Suspense>
    </div>
  )
}

export {Glossary}
