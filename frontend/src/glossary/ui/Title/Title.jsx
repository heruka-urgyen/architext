function Title({term, onClick}) {
  const searchable = typeof onClick === "function"
  const syllables = term.split(/\s+/)
  const handleAction = syllable => _ => {
    if (searchable) {
      onClick(syllable)
    }
  }

  return (
    <h3>
      {syllables.map(syllable => (
        <span
          key={syllable}
          role="link"
          tabIndex={0}
          className={`term${searchable ? " searchable" : ""}`}
          onMouseDown={handleAction(syllable)}
          onKeyPress={handleAction(syllable)}
        >
          {syllable}
        </span>
      ))}
    </h3>
  )
}

export {Title}
