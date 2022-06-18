import {Suspense} from "react"
import {RecoilRoot} from "recoil"

import {Editor} from "../editor"
import {Glossary} from "../glossary"

const editorConfig = {
  tags: [
    {tag: "bo", color: "#800000"},
    {tag: "en", color: "#0000ff"},
  ],
}

function App() {
  return (
    <div className="app">
      <RecoilRoot>
        <Editor {...editorConfig} />
        <Suspense fallback={<div>loading</div>}>
          <Glossary />
        </Suspense>
      </RecoilRoot>
    </div>
  )
}

export {App}
