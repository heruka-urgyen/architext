import {RecoilRoot} from "recoil"

import {Editor} from "../editor"
import {blockLanguages} from "../editor/constants"
import {Glossary} from "../glossary"

const editorConfig = {
  blockConfig: [
    {language: blockLanguages.bo, style: {color: "#bb175b"}},
    {language: blockLanguages.en, style: {color: "#4a4e69"}},
  ],
}

function App() {
  return (
    <div className="app">
      <RecoilRoot>
        <Editor editorConfig={editorConfig} />
        <Glossary />
      </RecoilRoot>
    </div>
  )
}

export {App}
