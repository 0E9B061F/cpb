block({
  name: 'typedec',
  hint: />TYPE/,
  rule: /^>TYPE (?<name>[a-zA-Z0-9_\-]+)\n/,
  renderer: token=> `<pre>${token.name}</pre>`,
})
block({
  name: 'datablock',
  hint: />DATA/,
  rule: /^>DATA\n(?<data>(?:[^: ]+: [^\n]*\n)*)<DATA\n/,
  parse: 'data',
  renderer: (token, inside)=> `<pre>${inside}\n</pre>`,
})
inline({
  name: 'dataline',
  hint: /[^: ]+: /,
  rule: /^(?<key>[^: ]+): (?<val>[^\n]*)\n/,
  renderer: token=> `${token.key}: ${token.val}\n`,
})
