import { useState } from 'react'
import './App.css'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  increase: {
    id: 'increase'
  },
  decrease: {
    id: 'decrease'
  }
})

function App() {
  const [count, setCount] = useState(0)
  const intl = useIntl()
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count => count + 1)}>{ intl.formatMessage(messages.increase) }</button>
      <button onClick={() => setCount(count => count - 1)}>{ intl.formatMessage(messages.decrease) }</button>
    </div>
  )
}

export default App
