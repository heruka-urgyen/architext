import {EditorBlock} from "draft-js"

const LanguageBlock = props => {
  const {blockProps} = props
  const {className, style} = blockProps

  return (
    <div
      className={className}
      style={{borderLeft: `5px solid ${style.color}`, padding: "10px"}}
    >
      <EditorBlock {...props} />
    </div>
  )
}

export {LanguageBlock}
