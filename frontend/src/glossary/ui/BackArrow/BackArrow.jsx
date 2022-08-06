function BackArrow({onMouseDown}) {
  return (
    <h2 className="back-arrow" onMouseDown={onMouseDown}>
      &#x2190;
    </h2>
  )
}

export {BackArrow}
