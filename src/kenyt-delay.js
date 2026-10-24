/** Kenyt is set to open on load. Keep the panel closed until the bubble is clicked. */
document.documentElement.classList.add('rw-kenyt-wait')

function openKenyt() {
  document.documentElement.classList.remove('rw-kenyt-wait')
  const box = document.getElementById('chatbox-container')
  const bub = document.getElementById('kenytChatBubble')
  if (box) {
    box.classList.remove('k-hide')
    box.style.display = 'block'
  }
  if (bub) bub.classList.add('k-hide')
}

document.addEventListener('click', (event) => {
  const t = event.target
  if (!t || !t.closest) return
  if (t.closest('#kenytChatBubble') || t.closest('#chatNowBtn')) openKenyt()
}, true)
