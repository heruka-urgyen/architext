import {RecoilRoot} from "recoil"

import {Editor} from "../editor"

const editorConfig = {
  tags: [
    {tag: "bo", color: "#800000"},
    {tag: "en", color: "#0000ff"},
  ],
}

function App() {
  return (
    <RecoilRoot>
      <Editor {...editorConfig} />
    </RecoilRoot>
  )
}

export {App}
