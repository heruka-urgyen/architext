function Title({term, onClick}) {
  const searchable = typeof onClick === "function"
  const syllables = term.split(/\s+/)

  return (
    <h3>
      {syllables.map(syllable => (
        <span
          key={syllable}
          className={`term${searchable ? " searchable" : ""}`}
          onMouseDown={_ => {
            if (searchable) {
              onClick(syllable)
            }
          }}
        >
          {syllable}
        </span>
      ))}
    </h3>
  )
}

export {Title}
