export function render(container, { player, assignment, onRestart }) {
  container.innerHTML = `
    <div class="explosion-container">
      <p class="explosion-title">BOEM!</p>
      ${player
        ? `<p class="explosion-loser">${escapeHtml(player)} is de lul!</p>`
        : `<p class="explosion-loser">Je bent erbij!</p>`
      }
      <p class="explosion-punishment">Straf: ${escapeHtml(assignment || 'Ad je drankje!')}</p>
      <button class="btn btn-primary" id="next-round-btn" style="display:none">Volgende ronde</button>
    </div>
  `;

  // Show restart button after 2 seconds
  setTimeout(() => {
    const btn = document.getElementById('next-round-btn');
    if (btn) btn.style.display = '';
  }, 2000);

  document.getElementById('next-round-btn').addEventListener('click', () => {
    onRestart();
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
