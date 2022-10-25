import {useState} from "react"
import {useRecoilValue, useRecoilCallback} from "recoil"
import {Maybe} from "../../../ui/Maybe"
import {withDictionaries} from "../../../states/glossary"

const Checkbox = ({value, checked, onChange}) => (
  <label>
    <input
      type="checkbox"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {value}
  </label>
)

function DictionarySelector() {
  const [selectorVisible, toggleSelectorVisible] = useState(false)

  const dictionaries = useRecoilValue(withDictionaries)

  const selectDictionaries = useRecoilCallback(
    ({set}) =>
      args =>
        set(withDictionaries, args),
    [dictionaries],
  )

  return (
    <>
      <Maybe
        if={dictionaries.length > 0}
        then={
          <button onClick={_ => toggleSelectorVisible(s => !s)}>
            Select dictionaries
          </button>
        }
      />
      <Maybe
        if={selectorVisible}
        then={
          <ul style={{listStyle: "none"}}>
            {dictionaries.map(({dictionary, selected}) => (
              <li key={dictionary}>
                <Checkbox
                  value={dictionary}
                  checked={selected}
                  onChange={_ => selectDictionaries([dictionary, !selected])}
                />
              </li>
            ))}
          </ul>
        }
      />
    </>
  )
}

export {DictionarySelector}
