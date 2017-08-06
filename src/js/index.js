const create = $('.lobby__create'),
	enter = $('.lobby__enter'),
	detail = $('.lobby__detail');

$('#saveTable').click(() => {
	create.removeClass('show');
	create.addClass('hidden');
	enter.removeClass('hidden');
	enter.addClass('show');
});

$('#cancelTable').click(() => {
	create.removeClass('show');
	create.addClass('hidden');
	enter.removeClass('hidden');
	enter.addClass('show');
});

$('#voltar').click(() => {
	detail.removeClass('show');
	detail.addClass('hidden');
	enter.removeClass('hidden');
	enter.addClass('show');
});

$('.not-list').click(() => {
	enter.removeClass('show');
	enter.addClass('hidden');
	detail.removeClass('hidden');
	detail.addClass('show');
});
