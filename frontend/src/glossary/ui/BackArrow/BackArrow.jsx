/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

function BackArrow({onMouseDown}) {
  return (
    <h2
      className="back-arrow"
      onMouseDown={onMouseDown}
      onKeyDown={onMouseDown}
    >
      &#x2190;
    </h2>
  )
}

export {BackArrow}
