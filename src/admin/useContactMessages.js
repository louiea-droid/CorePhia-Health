import { useEffect, useState } from "react"
import { deleteContactMessage, loadContactMessages } from "./firebase"

export function useContactMessages() {
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    loadContactMessages()
      .then((result) => active && setMessages(result))
      .catch((cause) => active && setError(cause.message))
    return () => {
      active = false
    }
  }, [])

  async function removeMessage(id) {
    await deleteContactMessage(id)
    setMessages((current) => current?.filter((message) => message.id !== id) ?? current)
  }

  return { messages, error, removeMessage }
}
