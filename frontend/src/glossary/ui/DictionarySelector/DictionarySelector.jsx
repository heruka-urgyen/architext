import {useState} from "react"
import {useRecoilValue, useRecoilCallback} from "recoil"
import {Maybe} from "../../../ui/Maybe"
import {withDictionaries} from "../../../states/glossary"
import {selectDictionaries as sd} from "../../../services/toggleDictionaries"

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
      async args => {
        const res = await sd(args)
        set(withDictionaries, res)
      },
    [],
  )

  return (
    <>
      <Maybe
        if={dictionaries.length > 0}
        then={
          <button
            onClick={_ => toggleSelectorVisible(s => !s)}
            style={{height: "30px"}}
          >
            Select dictionaries
          </button>
        }
      />
      <Maybe
        if={selectorVisible}
        then={
          <ul className="dictionaries">
            {dictionaries.map(({name, selected}) => (
              <li key={name}>
                <Checkbox
                  value={name}
                  checked={selected}
                  onChange={_ =>
                    selectDictionaries({name, selected: !selected})
                  }
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
