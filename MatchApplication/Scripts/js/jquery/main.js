$(document).ready(function(){
	$(".newEventButton").eq(0).on("click", openAddEventPopup);
	$(".closePopup").on("click", closeAddEventPopup)
});

function openAddEventPopup(event){
	event.stopPropagation();
	event.stopImmediatePropagation();
	$(".newEventDialog").eq(0).show();
}

function closeAddEventPopup(event){
	event.stopPropagation();
	event.stopImmediatePropagation();
	$(".newEventDialog").eq(0).hide();
}


