


$(window).load(function(){
var pages = $('#container li'), current=0;
var currentPage,nextPage;
		$('#container .button').click(function(){
			currentPage= pages.eq(current);
			if($(this).hasClass('prevButton'))
			{

				if (current <= 0)
					current=pages.length-1;
				else
					current=current-1;
			}
			else
			{
				if (current >= pages.length-1)
					current=0;
				else
					current=current+1;
			}
			nextPage = pages.eq(current);	
			currentPage.hide();	
			nextPage.show();		
		});
    
    	$('#container2 .button').click(function(){
            currentPage= pages.eq(current);
			if($(this).hasClass('clothes'))
			{

					current=0;
				
			}
            if($(this).hasClass('equipment'))
			{

					current=1;
				
			}
            if($(this).hasClass('wildlife'))
			{

					current=2;
				
			}
            if($(this).hasClass('park-info'))
			{

					current=3;
				
			}
            if($(this).hasClass('recreation-services'))
			{

					current=4;
				
			}
            if($(this).hasClass('food'))
			{

					current=5;
				
			}
            if($(this).hasClass('pubs'))
			{

					current=6;
				
			}
            if($(this).hasClass('accomodations'))
			{

					current=7;
				
			}
            if($(this).hasClass('transport'))
			{

					current=8;
				
			}
            if($(this).hasClass('airfare'))
			{

					current=9;
				
			}
			nextPage = pages.eq(current);	
			currentPage.hide();	
			nextPage.show();		
		});
});

