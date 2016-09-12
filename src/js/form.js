'use strict';

export default (function (window, document, $){
	console.log('run');

	const $form = $('#get-xml-form');
	const $from = $form.find('[name="dateFrom"]');
	const $to = $form.find('[name="dateTo"]');
	const $ordersType = $form.find('[name="ordersType"]:checked');

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

			let interval = $to.val().length === 0 ? 'normal' : 'interval';
			const ordersType = $ordersType.val();

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
