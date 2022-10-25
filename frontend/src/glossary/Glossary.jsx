import {useState} from "react"
import {useRecoilValue} from "recoil"

import {
  withGlossary,
  withSearchTerm,
  withDictionaries,
} from "../states/glossary"
import {Maybe} from "../ui/Maybe"

import {DefinitionList} from "./ui/DefinitionList"
import {DetailedDefinition} from "./ui/DetailedDefinition"
import {DictionarySelector} from "./ui/DictionarySelector"

const filterDictionaries = (entries, dictionaries) =>
  entries.filter(entry =>
    dictionaries.find(x => x.dictionary === entry.dictionary && x.selected),
  )

function Glossary() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState(null)

  const entries = useRecoilValue(withGlossary)
  const searchTerm = useRecoilValue(withSearchTerm(currentSearchTerm))
  const dictionaries = useRecoilValue(withDictionaries)

  return (
    <div className="glossary">
      <DictionarySelector />
      <Maybe
        if={currentSearchTerm != null}
        then={
          <DetailedDefinition
            term={searchTerm.term}
            definitions={filterDictionaries(searchTerm.results, dictionaries)}
            goBack={_ => setCurrentSearchTerm(null)}
          />
        }
        else={
          <Maybe
            if={entries.length > 0}
            then={
              <DefinitionList
                entries={filterDictionaries(entries, dictionaries)}
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
