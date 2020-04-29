const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');
const closeModal = document.querySelector('.close-modal');
console.log(cards);

for (let card of cards) {
	card.addEventListener('click', function () {
		const videoId = card.getAttribute('id');
		console.log(videoId);
		window.location.href = `/video?id=${videoId}`;
	});
}