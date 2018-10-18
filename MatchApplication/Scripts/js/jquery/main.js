$(document).ready(function(){
	$(".newEventButton").eq(0).on("click", openAddEventPopup);
	$(".closePopup").on("click", closeAddEventPopup);
	$(".openEventDetails").on("click", openEventDetails);
});

function openAddEventPopup(event){
	event.stopPropagation();
	event.stopImmediatePropagation();
	$(".newEventDialog").eq(0).show();
	$(".form-details").eq(0).hide();
	$(".substitute-container").eq(0).hide();
}

function closeAddEventPopup(event){
	event.stopPropagation();
	event.stopImmediatePropagation();
	$(".newEventDialog").eq(0).hide();
	$(".form-details").eq(0).hide();
	$(".substitute-container").eq(0).hide();
}

function openEventDetails(){
	event.stopPropagation();
	event.stopImmediatePropagation();
	$(".form-details").eq(0).show();
	let blockId = +$('#EventId option:selected').val();

	if(blockId === 7) {
		$(".substitute-container").show();
	}
}


