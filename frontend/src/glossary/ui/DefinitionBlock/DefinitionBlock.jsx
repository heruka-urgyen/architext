function Word({word, handleWordClick, isLast}) {
  return (
    <>
      {word.map(chunk => {
        const {type, token} = chunk

        if (type === "definition" && typeof handleWordClick === "function") {
          return (
            <span
              key={token}
              className="term searchable"
              role="link"
              tabIndex={0}
              onClick={_ => handleWordClick(token)}
              onKeyPress={_ => handleWordClick(token)}
            >
              {token}
            </span>
          )
        }

        return token
      })}
      {isLast || <span className="space"> </span>}
    </>
  )
}

function DefinitionBlock({titleNode, handleWordClick, definitions}) {
  return (
    <>
      {titleNode}
      <ol className="terms">
        {definitions.map((definition, i) => (
          <li key={i}>
            <p>
              {definition.map((word, j) => (
                <Word
                  key={`${word} - ${j}`}
                  word={word}
                  handleWordClick={handleWordClick}
                  isLast={definition.length === j + 1}
                />
              ))}
            </p>
          </li>
        ))}
      </ol>
    </>
  )
}

export {DefinitionBlock}
