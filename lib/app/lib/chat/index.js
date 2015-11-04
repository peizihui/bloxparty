import dom from 'virtual-element'
import {diff} from 'deep-diff'

export const name = 'Chat'

/**
 * Return the scroll position to the bottom of the panel
 * after each rerender
 * @param  {Object} component
 * @param  {Element} el
 */
export function afterRender (component, el) {
  let panel = el.querySelector('.Chat-messages')
  panel.scrollTop = panel.scrollHeight
}

// TODO: Hack to improve performance but this shouldn't be necessary.
// Maybe I'm doing something wrong but even if the chatLog given to
// this component is exactly the same as the last chatLog it will still
// trigger a rerender.
export function shouldUpdate (component, nextProps) {
  let results = diff(component.props.chatLog, nextProps.chatLog)
  if (results && results.length) return true
  return false
}

/**
 * Render the Chat view
 * @param  {Object} component
 * @return {VirtualNode}
 */
export function render (component) {
  let chatLog = component.props.chatLog
  let onSubmit = component.props.onSubmit
  let chatLogEls = null

  /**
   * Take the input and give data to a callback
   * @param  {Event} event
   */
  function handle (event) {
    event.preventDefault()
    let form = event.target
    let inputEl = form.querySelector('.Chat-input')
    if (inputEl.value === '') return
    if (onSubmit) onSubmit(inputEl.value, form)
    inputEl.value = ''
  }

  // So we don't interfere with key-based eventListeners
  function catchInput (event) {
    event.cancelBubble = true
    return false
  }

  // Build chat message list
  if (chatLog.length) {
    chatLogEls = chatLog.map(function (log) {
      return dom('li', {class: 'Chat-logItem'}, [
        dom('span', {class: 'Chat-logNick'}, [log.nick, ' > ']),
        dom('span', {class: 'Chat-logText'}, log.text)
      ])
    })
  }

  return dom('div', {class: 'Chat'}, [
    dom('div', {class: 'Chat-messages'}, [
      dom('ul', {}, chatLogEls)
    ]),
    dom('div', {class: 'Chat-formContainer'}, [
      dom('form', {class: 'Chat-form', onSubmit: handle}, [
        dom('input', {
          class: 'Chat-input',
          onKeyDown: catchInput,
          name: 'chatInput',
          autoComplete: 'off',
          placeholder: 'Send a message...'
        })
      ])
    ])
  ])
}