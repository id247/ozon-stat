'use strict';

// import Handlebars from 'handlebars';

export default (function (window, document, $){
	console.log('run');

	const $xmlResult = $('#xml-result');
	const $xmlForm = $('#xml-form');
	const $xmlInput = $xmlForm.find('textarea');
	
	const headerTemplate = Handlebars.compile($('#orders-header-template').html());
	const orderTemplate = Handlebars.compile($('#order-template').html());
	const footerTemplate = Handlebars.compile($('#orders-footer-template').html());

	let orderIds = [];
	let orders = [];
	let items = [];

	function output(){

		let template = headerTemplate();

		let totalPice = 0;
		let totalCommission = 0;
		let totalCount = 0;

		function compare(a,b) {
			//console.log(a.date, b.date);
			//console.log(new Date(a.date), new Date(b.date));
			if (new Date(a.timestampChange) < new Date(b.timestampChange))
				return -1;
			if (new Date(a.timestampChange) > new Date(b.timestampChange))
				return 1;
			return 0;
		}

		orders = orderIds.map( orderId => {

			const orderItems = items.filter( item => item.postingid === orderId);

			const timestampDate = orderItems[0].date.replace(/(.*)\.(.*)\.(.*)\ (.*)/g, '$2.$1.$3 $4');
			const timestampChange = orderItems[0].statechangemoment.replace(/(.*)\.(.*)\.(.*)\ (.*)/g, '$2.$1.$3 $4');

			let orderPice = 0;
			let orderCommission = 0;

			orderItems.map( item => {
				orderPice += item.price * item.qty;
				orderCommission +=  item.summ * item.qty;
			}, 0);

			return {
				orderId: orderId,
				orderPice: orderPice,
				orderCommission: orderCommission,
				count: orderItems.length,
				date: orderItems[0].date,
				change: orderItems[0].statechangemoment,
				timestampDate: timestampDate,
				timestampChange: timestampChange,
				adentId: orderItems[0].agentid,
				status: orderItems[0].state == 'done' ? 'Выполнен' : 'Аннулирован',
			};

		});

		orders.sort(compare);

		orders.map( order => {

			totalPice += order.orderPice;
			totalCommission += order.orderCommission;
			totalCount += order.count;

			template += orderTemplate({
				orderId: order.orderId,
				orderPice: parseFloat(order.orderPice).toFixed(2),
				orderCommission: parseFloat(order.orderCommission).toFixed(2),
				count: order.count,
				date: order.date,
				change: order.change,
				adentId: order.adentId,
				status: order.status,
			});

		});


		template += footerTemplate({
			totalPice: parseFloat(totalPice).toFixed(2),
			totalCommission: parseFloat(totalCommission).toFixed(2),
			totalCount,
		});

		$xmlResult.html(template);


	}

	function actions(){		

		$xmlForm.on('submit', function(e){
			e.preventDefault();

			orderIds = [];
			orders = [];
			items = [];

			//const xml = $.parseXML($xmlInput.val().replace(/^.*\</g, ''));
			const $xml = $($xmlInput.val().replace(/^.*\</g, ''));

			const $orderItems = $xml.find('OrderItem');

			$orderItems.each( function(){

				const item = {};
				const $clihdren = $(this).children();

				$clihdren.each( function() {

					const $this = $(this);
					const tagName = $this.prop('tagName').toLowerCase();
					const content = $this.html();

					if (tagName === 'postingid' && orderIds.indexOf(content) === -1){
						orderIds.push(content);
					}

					item[tagName] = content;
				});

				items.push(item);
			});
			console.log(items);
			console.log(orderIds);

			output();


			//$xmlResult.html( $xml );
			
			
		});

	}

	function init(){

		actions();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);
