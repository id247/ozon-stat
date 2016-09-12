'use strict';

export default (function (window, document, $){
	console.log('run');

	const $form = $('#get-xml-form');
	const $ifarme = $('#request-iframe');
	const $from = $form.find('[name="dateFrom"]');
	const $to = $form.find('[name="dateTo"]');

	const urls = {
		done: {
			normal: 'http://ows.ozon.ru/PartnerStatisticsService/PartnerStatisticsService.asmx/GetPartnerStatisticInformation',
			interval: 'http://ows.ozon.ru/PartnerStatisticsService/PartnerStatisticsService.asmx/GetPartnerStatisticInformationInterval',
		},
		waiting: {
			normal: 'http://ows.ozon.ru/PartnerStatisticsService/PartnerStatisticsService.asmx/GetPartnerWaitOrder',
			interval: 'http://ows.ozon.ru/PartnerStatisticsService/PartnerStatisticsService.asmx/GetPartnerWaitOrderInterval',
		},
	}

	function setDates(){
		var date = new Date();
		$from.val( new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0,10) );
		$to.val( date.toISOString().slice(0,10) );
	}

	function actions(){		

		$form.on('submit', function(e){
			//e.preventDefault();

			const partnerName = this.elements.partnerName.value;
			const login = this.elements.login.value;
			const password = this.elements.password.value;
			const dateFrom = this.elements.dateFrom.value;
			const dateTo = this.elements.dateTo.value;

			let interval = dateTo.length === 0 ? 'normal' : 'interval';
			const ordersType = $form.find('[name="ordersType"]:checked').val();

			console.log(ordersType);

			// const fullUrl = urls[ordersType][interval]
			// 				+ '?partnerName=' + encodeURIComponent(partnerName)
			// 				+ '&login=' + encodeURIComponent(login)
			// 				+ '&password=' + encodeURIComponent(password)
			// 				+ '&dateFrom=' + encodeURIComponent(dateFrom)
			// 				+ (dateTo.length > 0 ? '&dateTo=' + encodeURIComponent(dateTo) : '')
			// 				;

			// 				console.log(fullUrl);

			//$ifarme.attr('src', fullUrl );

			$form.attr('action', urls[ordersType][interval]);
		});

	}

	function init(){

		setDates();
		actions();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);
