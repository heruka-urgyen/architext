function Maybe(props) {
  if (props.if === true) {
    return props.then
  }

  if (props.else != null) {
    return props.else
  }

  return null
}

export {Maybe}
