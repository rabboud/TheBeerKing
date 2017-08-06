const create = $('.lobby__create'),
	enter = $('.lobby__enter'),
	detail = $('.lobby__detail');

$('#cancelTable').click(() => {
	console.log('save');
	create.removeClass('show');
	create.addClass('hidden');
	enter.removeClass('hidden');
	enter.addClass('show');
});

$('.not-list').click(() => {
	console.log('detail');
	enter.removeClass('show');
	enter.addClass('hidden');
	detail.removeClass('hidden');
	detail.addClass('show');
});
