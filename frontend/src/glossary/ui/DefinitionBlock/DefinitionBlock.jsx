function DefinitionBlock({titleNode, definitions}) {
  return (
    <>
      {titleNode}
      <ul>
        {
          definitions.map(def => (
            <li key={def}>{def}</li>
          ))
        }
      </ul>
    </>
  )
}

export {DefinitionBlock}
