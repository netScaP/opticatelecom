console.log('hi');
console.log($('.forever'));

for (var i = $('.forever').length - 1; i >= 0; i--) {
	$('.forever')[i].addEventListener('click', function(e) {
		var sum = e.target;

		sum.classList.remove('summary');
		sum.classList.add('summaryFull');

		sum.parentNode.style = 'height: auto;';
	});
}