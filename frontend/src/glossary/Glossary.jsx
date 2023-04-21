import {Suspense, useState} from "react"
import {useRecoilValue} from "recoil"

import {
  withGlossary,
  withSearchTerm,
} from "../states/glossary"
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
