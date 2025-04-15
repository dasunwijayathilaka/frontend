(function($) {
  "use strict";

	// Variables declarations
	
	var $wrapper = $('.main-wrapper');
	var $pageWrapper = $('.page-wrapper');
	var $slimScrolls = $('.slimscroll');
	
	// Sidebar
	
	var Sidemenu = function() {
		this.$menuItem = $('#sidebar-menu a');
	};
	
	function init() {
		var $this = Sidemenu;
		$('#sidebar-menu a').on('click', function(e) {
			if($(this).parent().hasClass('submenu')) {
				e.preventDefault();
			}
			if(!$(this).hasClass('subdrop')) {
				$('ul', $(this).parents('ul:first')).slideUp(350);
				$('a', $(this).parents('ul:first')).removeClass('subdrop');
				$(this).next('ul').slideDown(350);
				$(this).addClass('subdrop');
			} else if($(this).hasClass('subdrop')) {
				$(this).removeClass('subdrop');
				$(this).next('ul').slideUp(350);
			}
		});
		$('#sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');
	}
	
	// Sidebar Initiate
	init();
	
	// Mobile menu sidebar overlay
	
	$('body').append('<div class="sidebar-overlay"></div>');
	$(document).on('click', '#mobile_btn', function() {
		$wrapper.toggleClass('slide-nav');
		$('.sidebar-overlay').toggleClass('opened');
		$('html').addClass('menu-opened');
		return false;
	});
	
	// Sidebar overlay
	$(".sidebar-overlay").on("click", function () {
		$wrapper.removeClass('slide-nav');
		$(".sidebar-overlay").removeClass("opened");
		$('html').removeClass('menu-opened');
	});	

	// radio btn hide show
	  $(function() {
		$("input[name='mail_config']").click(function() {
		  if ($("#chkYes").is(":checked")) {
			$("#showemail").show();
		  } else {
			$("#showemail").hide();
		  }
		});
	  });
	 
	// editor
	if ($('#editor').length > 0) {
		ClassicEditor
		.create( document.querySelector( '#editor' ), {
			toolbar: {
                items: [
                    'heading', '|',
                    'fontfamily', 'fontsize', '|',
                    'alignment', '|',
                    'fontColor', 'fontBackgroundColor', '|',
                    'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
                    'link', '|',
                    'outdent', 'indent', '|',
                    'bulletedList', 'numberedList', 'todoList', '|',
                    'code', 'codeBlock', '|',
                    'insertTable', '|',
                    'uploadImage', 'blockQuote', '|',
                    'undo', 'redo'
                ],
                shouldNotGroupWhenFull: true
            }
		} )
		.then( editor => {
			window.editor = editor;
		} )
		.catch( err => {
			console.error( err.stack );
		} );
	}	
	if ($('.select').length > 0) {
		$('.select').select2({
			minimumResultsForSearch: -1,
			width: '100%'
		});
	}

	$(document).on('click', '#filter_search', function() {
		$('#filter_inputs').slideToggle("slow");
	});

	// Datetimepicker
	
	if($('.datetimepicker').length > 0 ){
		$('.datetimepicker').datetimepicker({
			format: 'DD-MM-YYYY',
			icons: {
				up: "fas fa-angle-up",
				down: "fas fa-angle-down",
				next: 'fas fa-angle-right',
				previous: 'fas fa-angle-left'
			}
		});
	}
	
	// Datetimepicker time
	
	if($('.timepicker').length > 0 ){
		$('.timepicker').datetimepicker({
			format: 'HH:mm A',
			icons: {
				up: "fas fa-angle-up",
				down: "fas fa-angle-down",
				next: 'fas fa-angle-right',
				previous: 'fas fa-angle-left'
			}
		});
	}
	
	// Time Slot
	
	if($('#time-slot').length > 0) {
		$('#time-slot').on('click', function() {
			$(".timeslot-sec").show(); 
			$(".timepicker-sec").hide(); 
		});
		$('#time-picker').on('click', function() {
			$(".timepicker-sec").show(); 
			$(".timeslot-sec").hide(); 
		});
	}
	
	// MultiStep Form Script

	$(document).ready(function () {
		/*---------------------------------------------------------*/
		$(".next_btn").on('click', function () { // Function Runs On NEXT Button Click
			$(this).closest('fieldset').next().fadeIn('slow');
			$(this).closest('fieldset').css({
				'display': 'none'
			});
			// Adding Class Active To Show Steps Forward;
			$('#progressbar .active').removeClass('active').addClass('activated').next().addClass('active');

		});
	});
	
	// Add Service Information
	
    $(".addservice-info").on('click','.trash', function () {
		$(this).closest('.service-cont').remove();
		return false;
    });

    $(".add-extra").on('click', function () {
		
		var servicecontent = '<div class="row service-cont">' +
			'<div class="col-md-4">' +
				'<div class="form-set">' +
					'<label class="col-form-label">Item</label>' +
					'<input type="text" class="form-control" placeholder="Enter  Service Item">' +
				'</div>' +
			'</div>' +
			'<div class="col-md-4">' +
				'<div class="form-set">' +
					'<label class="col-form-label">Price</label>' +
					'<input type="text" class="form-control" placeholder="Enter Services Price">' +
				'</div>' +
			'</div>' +	
			'<div class="col-md-4">' +
				'<div class="d-flex">' +
					'<div class="form-set w-100">' +
						'<label class="col-form-label">Duration</label>' +
						'<input type="text" class="form-control" placeholder="Enter Service Duration">' +
					'</div>' +												
					'<div class="form-set">' +
						'<label class="col-form-label">&nbsp;</label>' +
						'<a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
		
        $(".addservice-info").append(servicecontent);
        return false;    
    });
	
	// Add Hours
	
    $(".hours-info").on('click','.trash', function () {
		$(this).closest('.hours-cont').remove();
		return false;
    });

    $(".add-hours").on('click', function () {
		
		var hourscontent = '<div class="row hours-cont">' +
			'<div class="col-md-4">' +
				'<div class="form-set">' +
					'<label class="col-form-label">From</label>' +
					'<div class="form-icon">' +
						'<input type="text" class="form-control timepicker" placeholder="Select Time">' +
						'<span class="cus-icon"><i class="feather-clock"></i></span>' +
					'</div>' +
				'</div>' +
			'</div>' +	
			'<div class="col-md-4">' +
				'<div class="form-set">' +
					'<label class="col-form-label">To</label>' +
					'<div class="form-icon">' +
						'<input type="text" class="form-control timepicker" placeholder="Select Time">' +
						'<span class="cus-icon"><i class="feather-clock"></i></span>' +
					'</div>' +
				'</div>' +
			'</div>' +	
			'<div class="col-md-4">' +
				'<div class="d-flex">' +
					'<div class="form-set w-100">' +
							'<label class="col-form-label">Slots</label>' +
							'<input type="text" class="form-control" placeholder="Enter Slot">' +
					'</div>' +												
					'<div class="form-set">' +
						'<label class="col-form-label">&nbsp;</label>' +
						'<a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
		
        $(this).parent().find(".hours-info").append(hourscontent);
		$('.timepicker').datetimepicker({
			format: 'HH:mm A',
			icons: {
				up: "fas fa-angle-up",
				down: "fas fa-angle-down",
				next: 'fas fa-angle-right',
				previous: 'fas fa-angle-left'
			}
		});		
        return false;    
    });
	
	// Add Timepicker Hours
	
    $(".hrs-info").on('click','.trash', function () {
		$(this).closest('.hrs-cont').remove();
		return false;
    });

    $(".add-hrs").on('click', function () {
		
		var hrscontent = '<div class="row hrs-cont">' +
			'<div class="col-md-6">' +
				'<div class="form-set form-info">' +
					'<label class="col-form-label">From</label>' +
					'<div class="form-icon">' +
							'<input type="text" class="form-control timepicker"  placeholder="Select Time">' +
							'<span class="cus-icon"><i class="fe fe-clock"></i></span>' +
						'</div>' +	
				'</div>' +
			'</div> ' +	
			'<div class="col-md-6">' +
				'<div class="d-flex">' +
					'<div class="form-set form-info w-100">' +
						'<label class="col-form-label">To</label>' +
						'<div class="form-icon">' +
							'<input type="text" class="form-control timepicker"  placeholder="Select Time">' +
							'<span class="cus-icon"><i class="fe fe-clock"></i></span>' +
						'</div>' +											
						'</div>' +											
						'<div class="form-set">' +
							'<label class="col-form-label">&nbsp;</label>' +
							'<a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';
		'</div>';
		
		
        $(this).parent().find(".hrs-info").append(hrscontent);
		$('.timepicker').datetimepicker({
			format: 'HH:mm A',
			icons: {
				up: "fas fa-angle-up",
				down: "fas fa-angle-down",
				next: 'fas fa-angle-right',
				previous: 'fas fa-angle-left'
			}
		});		
        return false;    
    });
	
	// Add Timepicker Hours
	
    $(".day-info").on('click','.trash', function () {
		$(this).closest('.day-cont').remove();
		return false;
    });

    $(".add-day").on('click', function () {
		
		var daycontent = '<div class="row day-cont">' +
			'<div class="col-md-6">' +
				'<div class="form-set">' +
					'<label class="col-form-label">From</label>' +
					'<div class="form-icon">' +
						'<input type="text" class="form-control timepicker" placeholder="Select Time">' +
						'<span class="cus-icon"><i class="feather-clock"></i></span>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="col-md-6">' +
				'<div class="d-flex">' +
					'<div class="form-set w-100">' +
						'<label class="col-form-label">To</label>' +
						'<div class="form-icon">' +
							'<input type="text" class="form-control timepicker" placeholder="Select Time">' +
							'<span class="cus-icon"><i class="feather-clock"></i></span>' +
						'</div>' +
					'</div>' +							
					'<div class="form-set">' +
						'<label class="col-form-label">&nbsp;</label>' +
						'<a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
		
        $(this).parent().parent().find(".day-info").append(daycontent);
		$('.timepicker').datetimepicker({
			format: 'HH:mm A',
			icons: {
				up: "fas fa-angle-up",
				down: "fas fa-angle-down",
				next: 'fas fa-angle-right',
				previous: 'fas fa-angle-left'
			}
		});		
        return false;    
    });

	// Tooltip
	
	
	// Tooltip
	if($('[data-bs-toggle="tooltip"]').length > 0) {
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	}
	
	

    // Owl Carousel

    if ($('.images-carousel').length > 0) {
		$('.images-carousel').owlCarousel({
			loop: true,
			center: true,
			margin: 10,
			responsiveClass: true,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				1000: {
					items: 1,
					loop: false,
					margin: 20
				}
			}
		});
    }
	
	// Sidebar Slimscroll

	if($slimScrolls.length > 0) {
		$slimScrolls.slimScroll({
			height: 'auto',
			width: '100%',
			position: 'right',
			size: '7px',
			color: '#ccc',
			allowPageScroll: false,
			wheelStep: 10,
			touchScrollStep: 100
		});
		var wHeight = $(window).height() - 60;
		$slimScrolls.height(wHeight);
		$('.sidebar .slimScrollDiv').height(wHeight);
		$(window).resize(function() {
			var rHeight = $(window).height() - 60;
			$slimScrolls.height(rHeight);
			$('.sidebar .slimScrollDiv').height(rHeight);
		});
	}
	
	// Small Sidebar

	$(document).on('click', '#toggle_btn', function() {
		if($('body').hasClass('mini-sidebar')) {
			$('body').removeClass('mini-sidebar');
			$('.subdrop + ul').slideDown();
		} else {
			$('body').addClass('mini-sidebar');
			$('.subdrop + ul').slideUp();
		}
		setTimeout(function(){ 
			// mA.redraw();
			// mL.redraw();
		}, 300);
		return false;
	});
	
if($('.win-maximize').length > 0) {
		$('.win-maximize').on('click', function(e){
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}
			}
		})
	}



	$(document).on('mouseover', function(e) {
		e.stopPropagation();
		if($('body').hasClass('mini-sidebar') && $('#toggle_btn').is(':visible')) {
			var targ = $(e.target).closest('.sidebar').length;
			if(targ) {
				$('body').addClass('expand-menu');
				$('.subdrop + ul').slideDown();
			} else {
				$('body').removeClass('expand-menu');
				$('.subdrop + ul').slideUp();
			}
			return false;
		}
		
		// $(window).scroll(function() {
		// 	if ($(window).scrollTop() >= 30) {
		// 		$('.header').addClass('fixed-header');
		// 	} else {
		// 		$('.header').removeClass('fixed-header');
		// 	}
		// });
		
		$(document).on('click', '#loginSubmit', function() {
			$("#adminSignIn").submit();
		});
		
	});

	// Range slider
	if(document.getElementById("myRange")!=null){
		var slider = document.getElementById("myRange");
		var output = document.getElementById("currencys");
		output.innerHTML = slider.value;
	  
		slider.oninput = function() {
		  output.innerHTML = this.value;
		}
	}
	if(document.getElementById("myRange")!=null){
		document.getElementById("myRange").oninput = function() {
			var value = (this.value-this.min)/(this.max-this.min)*100
			this.style.background = 'linear-gradient(to right, #FF0080 0%, #FF0080 ' + value + '%, #c4c4c4 ' + value + '%, #c4c4c4 100%)'
		  };
		}
		
	// Logo Hide Btn

	$(document).on("click",".logo-hide-btn",function () {
		$(this).parent().hide();
	});

// Summernote
	
if($('.summernote').length > 0) {
	$('.summernote').summernote({
		height: 200,                 // set editor height
		minHeight: null,             // set minimum height of editor
		maxHeight: null,             // set maximum height of editor
		focus: false ,
		toolbar: [
			// [groupName, [list of button]]
			['style', ['bold', 'italic', 'underline', 'clear']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']]
		]			// set focus to editable area after initializing summernote
	});
}


// add Formset
$(document).on("click",".addlinks",function () {
	var experiencecontent = '<div class="form-set links-cont">' +
	'<div class="row align-items-center">' +
	'<div class="col-lg-3 col-12">' +
	'<input type="text" class="form-control" placeholder="Label">' +
	'</div>' +
	'<div class="col-lg-7 col-12">' +
	'<input type="text" class="form-control" placeholder="Link with http:// Or https://">' +
	'</div>' +
	'<div class="col-lg-2 col-12 d-flex justify-content-end">' +
	'<a href="javascript:void(0);" class="btn btn-sm bg-danger-light  delete_review_comment">' +
	'<i class="far fa-trash-alt "></i> ' +
	'</a>' +
	'</div>' +
	'</div>' +
	'</div>' ;
	
	$(".settings-form").append(experiencecontent);
	return false;
});

$(".settings-form").on('click','.delete_review_comment', function () {
	$(this).closest('.links-cont').remove();
	return false;
});


// add Formset
												
$(document).on("click",".addnew",function () {
	var experiencecontent = '<div class="form-set links-conts">' +
	'<div class="row align-items-center">' +
	'<div class="col-lg-3 col-12">' +
	'<input type="text" class="form-control" placeholder="Label">' +
	'</div>' +
	'<div class="col-lg-7 col-12">' +
	'<input type="text" class="form-control" placeholder="Link with http:// Or https://">' +
	'</div>' +
	'<div class="col-lg-2 col-12 d-flex justify-content-end">' +
	'<a href="javascript:void(0);" class="btn btn-sm bg-danger-light  delete_review_comment">' +
	'<i class="far fa-trash-alt "></i> ' +
	'</a>' +
	'</div>' +
	'</div>' +
	'</div>' ;
	
	$(".settingset").append(experiencecontent);
	return false;
});

$(".settingset").on('click','.delete_review_comment', function () {
	$(this).closest('.links-conts').remove();
	return false;
});

$(document).on("click",".addlinknew",function () {
	var experiencecontent = '<div class="form-set links-cont">' +
	'<div class="row align-items-center">' +
	'<div class="col-lg-3 col-12">' +
	'<input type="text" class="form-control" placeholder="Label">' +
	'</div>' +
	'<div class="col-lg-7 col-12">' +
	'<input type="text" class="form-control" placeholder="Link with http:// Or https://">' +
	'</div>' +
	'<div class="col-lg-2 col-12 d-flex justify-content-end">' +
	'<a href="javascript:void(0);" class="btn btn-sm bg-danger-light  delete_review_comment">' +
	'<i class="far fa-trash-alt "></i> ' +
	'</a>' +
	'</div>' +
	'</div>' +
	'</div>' ;
	
	$(".settings-forms").append(experiencecontent);
	return false;
});

$(".settings-forms").on('click','.delete_review_comment', function () {
	$(this).closest('.links-cont').remove();
	return false;
});

										
// add social links Formset
$(document).on("click",".addsocail",function () {
	var experiencecontent = '<div class="form-set countset">' +
	'<div class="row align-items-center">' +
	'<div class="col-lg-2 col-12">' +
	'<div class="socail-links-set">' +
	'<ul>' +
	'<li class=" dropdown has-arrow main-drop">' +
	'<a href="javascript:void(0);" class="dropdown-toggle nav-link" data-bs-toggle="dropdown" aria-expanded="false">' +
	'<span class="user-img">' +
	'<i class="fab fa-github me-2"></i>' +
	'</span>' +
	'</a>' +
	'<div class="dropdown-menu">' +
	'<a class="dropdown-item" href="javascript:void(0);"><i class="fab fa-facebook-f me-2"></i>Facebook</a>' +
	'<a class="dropdown-item" href="javascript:void(0);"><i class="fab fa-twitter me-2"></i>twitter</a>' +
	'<a class="dropdown-item" href="javascript:void(0);"><i class="fab fa-youtube me-2"></i> Youtube</a>' +
	'</div>' +
	'</li>' +
	'</ul>' +
	'</div>' +
	'</div>' +
	'<div class="col-lg-8 col-12">' +
	'<input type="text" class="form-control" placeholder="Link with http:// Or https://">' +
	'</div>' +
	'<div class="col-lg-2 col-12 d-flex justify-content-end">' +
	'<a href="javascript:void(0);" class="btn btn-sm bg-danger-light  delete_review_comment">' +
	'<i class="far fa-trash-alt "></i> ' +
	'</a>' +
	'</div>' +
	'</div> ' +
	'</div> ';
	
	$(".setings").append(experiencecontent);
	return false;
});

$(".setings").on('click','.delete_review_comment', function () {
	$(this).closest('.countset').remove();
	return false;
});


// add Faq
												
$(document).on("click",".addfaq",function () {
	var experiencecontent = '<div class="row counts-list">' +
	'<div class="col-md-11">' +
	'<div class="cards">' +
	'<div class="form-set">' +
	'<label>Title</label>' +
	'<input type="text" class="form-control" >' +
	'</div>' +
	'<div class="form-set mb-0">' +
	'<label>Content</label>' +
	'<textarea class="form-control"></textarea>' +
	'</div>' +
	'</div>' +
	'</div>' +
	'<div class="col-md-1">' +
	'<a href="javascript:void(0);" class="btn btn-sm bg-danger-light  delete_review_comment">' +
	'<i class="far fa-trash-alt "></i> ' +
	'</a>' +
	'</div>' +
	'</div> ';
	
	$(".faq").append(experiencecontent);
	return false;
});

$(".faq").on('click','.delete_review_comment', function () {
	$(this).closest('.counts-list').remove();
	return false;
});

$(".settings-form").on('click','.trash', function () {
	$(this).closest('.links-cont').remove();
	return false;
});

$(document).on("click",".add-links",function () {
	var experiencecontent = '<div class="row form-row links-cont">' +
		'<div class="form-set d-flex">' +
			'<button class="btn social-icon"><i class="feather-github"></i></button>' +
			'<input type="text" class="form-control" placeholder="Social Link">' +
			'<div><a href="javascript:void(0);" class="btn trash"><i class="feather-trash-2"></i></a></div>' +
		'</div>' +
	'</div>';
	
	$(".settings-form").append(experiencecontent);
	return false;
});
// checkbox Select
	
$('.app-listing .selectbox').on("click", function() {
	$(this).parent().find('#checkboxes').fadeToggle();
	$(this).parent().parent().siblings().find('#checkboxes').fadeOut();
});

$('.invoices-main-form .selectbox').on("click", function() {
	$(this).parent().find('#checkboxes-one').fadeToggle();
	$(this).parent().parent().siblings().find('#checkboxes-one').fadeOut();
});

//checkbox Select

if($('.sortby').length > 0) {
	var show = true;
	var checkbox1 = document.getElementById("checkbox");
	$('.selectboxes').on("click", function() {
		
		if (show) {
			checkbox1.style.display = "block";
			show = false;
		} else {
			checkbox1.style.display = "none";
			show = true;
		}
	});		
}

// Invoices checkbox Show

$(function() {
	$("input[name='invoice']").click(function() {
		if ($("#chkYes").is(":checked")) {
			$("#show-invoices").show();
		} else {
			$("#show-invoices").hide();
		}
	});
});


	// Invoices Add More
	
    $(".links-info-one").on('click','.service-trash', function () {
		$(this).closest('.links-cont').remove();
		return false;
    });

    $(document).on("click",".add-links",function () {
		var experiencecontent = '<div class="links-cont">' +
			'<div class="service-amount1">' +
				'<a href="javascript:void(0);" class="service-trash"><i class="fe fe-minus-circle me-1"></i>Service Charge</a> <span>$ 4</span' +
			'</div>' +
		'</div>';
		
        $(".links-info-one").append(experiencecontent);
        return false;
    });

     $(".links-info-discount").on('click','.service-trash-one', function () {
		$(this).closest('.links-cont-discount').remove();
		return false;
    });

    $(document).on("click",".add-links-one",function () {
		var experiencecontent = '<div class="links-cont-discount">' +
			'<div class="service-amount1">' +
				'<a href="javascript:void(0);" class="service-trash-one"><i class="fe fe-minus-circle me-1"></i>Offer new</a> <span>$ 4 %</span' +
			'</div>' +
		'</div>';
		
        $(".links-info-discount").append(experiencecontent);
        return false;
    });

    // Invoices Table Add More
	
    $(".add-table-items").on('click','.remove-btn', function () {
		$(this).closest('.add-row').remove();
		return false;
    });

    $(document).on("click",".add-btn",function () {
		var experiencecontent = '<tr class="add-row">' +
			'<td>' +
				'<input type="text" class="form-control">' +
			'</td>' +
			'<td>' +
				'<input type="text" class="form-control">' +
			'</td>' +
			'<td>' +
				'<input type="text" class="form-control">' +
			'</td>' +
			'<td>' +
				'<input type="text" class="form-control">' +
			'</td>' +
			'<td>' +
				'<input type="text" class="form-control">' +
			'</td>' +
			'<td>' +
				'<input type="text" class="form-control">' +
			'</td>' +
			'<td class="add-remove text-end">' +
				'<a href="javascript:void(0);" class="add-btn me-2"><i class="fas fa-plus-circle"></i></a> ' +
				'<a href="javascript:void(0);" class="copy-btn me-2"><i class="fe fe-copy"></i></a>' +
				'<a href="javascript:void(0);" class="remove-btn"><i class="fe fe-trash-2"></i></a>' +
			'</td>' +
		'</tr>';
		
        $(".add-table-items").append(experiencecontent);
        return false;
    });

	$(document).on("click",".addnewheader",function () {
		var experiencecontent = '<div class="col-12">' +
		'<div class="form-group-set">' +
		'<div class="row align-items-center">' +
		'<div class="col-lg-3 col-sm-6">' +
		'<input type="text" class="form-control" placeholder="Enter title">' +
		'</div>' +
		'<div class="col-lg-8 col-sm-12">' +
		'<input type="text" class="form-control" placeholder="Enter url">' +
		'</div>' +
		'<div class="col-lg-1 col-sm-12">' +
		'<a href="javascript:void(0);" class="delete-links">' +
		'<i class="far fa-trash-alt "></i>' +
		'</a>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';
		
        $(".add-headers").append(experiencecontent);
        return false;
    });

	$(document).on("click",".delete-links",function () {
		$(this).parent().parent().parent().parent().hide();
	});

	// Datatable
	if($('.datatable').length > 0) {
		$('.datatable').DataTable({
			"bFilter": false,
			"sDom": 'fBtlpi',  
			'pagingType': 'numbers', 
			"ordering": true,
			"language": {
				search: ' ',
				sLengthMenu: '_MENU_',
				searchPlaceholder: "Search...",
				info: "_START_ - _END_ of _TOTAL_ items",
			},
			initComplete: (settings, json)=>{
				$('.dataTables_filter').appendTo('#tableSearch');
				$('.dataTables_filter').appendTo('.search-input');
			},	
		});
	}
	


	// toggle-password
	if($('.toggle-password').length > 0) {
		$(document).on('click', '.toggle-password', function() {
			$(this).toggleClass("fa-eye fa-eye-slash");
			var input = $(".pass-input");
			if (input.attr("type") == "password") {
				input.attr("type", "text");
			} else {
				input.attr("type", "password");
			}
		});
	}
	if($('.toggle-passwords').length > 0) {
		$(document).on('click', '.toggle-passwords', function() {
			$(this).toggleClass("fa-eye fa-eye-slash");
			var input = $(".pass-inputs");
			if (input.attr("type") == "password") {
				input.attr("type", "text");
			} else {
				input.attr("type", "password");
			}
		}); 
	}
	if($('.toggle-passworda').length > 0) {
		$(document).on('click', '.toggle-passworda', function() {
			$(this).toggleClass("fa-eye fa-eye-slash");
			var input = $(".pass-inputa	");
			if (input.attr("type") == "password") {
				input.attr("type", "text");
			} else {
				input.attr("type", "password");
			}
		});
	}

	// image file upload image
	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#blah').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}
	}
	$("#imgInp").change(function(){
		readURL(this);
	});

	
	//Custom Country Code Selector
	
	if($('#phone').length > 0) {
		var input = document.querySelector("#phone");
			window.intlTelInput(input, {
			  utilsScript: "assets/plugins/intltelinput/js/utils.js",
		}); 
	}
	if($('#phone1').length > 0) {
		var input = document.querySelector("#phone1");
			window.intlTelInput(input, {
			  utilsScript: "assets/plugins/intltelinput/js/utils.js",
		}); 
	}
	
	$('.theme-image').on('click', function(){
		$('.theme-image').removeClass('active');
		$(this).addClass('active');
	});
	$('.transfer-lists').on('click', function(){
		$('.transfer-lists').removeClass('active');
		$(this).addClass('active');
	});
	$('.themecolorset').on('click', function(){
		$('.themecolorset').removeClass('active');
		$(this).addClass('active');
	});

	$('.counters').each(function() {
		var $this = $(this),
			countTo = $this.attr('data-count');
		$({ countNum: $this.text()}).animate({
			countNum: countTo
		},
		{
			duration: 3000,
			easing:'linear',
			step: function() {
			$this.text(Math.floor(this.countNum));
			},
			complete: function() {
			$this.text(this.countNum);
			}
		
		});  
		
	});
	
	
	// Gallery slider
	if($('.owl-carousel.gallery-slider').length > 0) {
		$('.owl-carousel.gallery-slider').owlCarousel({
			loop:true,
			margin:24,
			nav:true,
			smartSpeed: 2000,
			navText : ["<i class='fa-solid fa-angle-left'></i>","<i class='fa-solid fa-angle-right'></i>"],
			dots:false,
			navContainer: '.mynav3',
			responsive:{
				0:{
					items:1
				},
				
				550:{
					items:2
				},
				700:{
					items:2
				},
				1000:{
					items:3
				}
			}
		})
	}
	
	// Loader
	setTimeout(function () {
		$('#loader');
		setTimeout(function () {
			$("#loader").fadeOut("slow");
			$("#overlayer").delay(2000).fadeOut("slow");
		}, 100);
	}, 500);

	if($('.sidebar .active').length > 0) {
		var container = $('div'),
			scrollTo = $('.sidebar .active');
			container.animate({
				scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - 100
		});
	}

	// Add Timepicker Hours
	
    $(".social-info").on('click','.trash', function () {
		$(this).closest('.social-cont').remove();
		return false;
    });

    $(".social-add").on('click', function () {
		
		var socialcontent = '<div class="row align-items-center social-cont">' +
		'<div class="col-lg-5 col-sm-12">' +
			'<div class="form-set">' +
				'<label>Name</label>' +
				'<select class="select">' +
					'<option>Instagram</option>' +
					'<option>facebook</option>' +
				'</select>' +
			'</div>' +
		'</div>' +
		'<div class="col-lg-5 col-sm-12">' +
			'<div class="form-set">' +
				'<label>URL</label>' +
				'<select class="select">' +
					'<option>Ex. www.instagram.com</option>' +
					'<option>Ex. www.facebook.com</option>' +
				'</select>' +
			'</div>' +
		'</div>' +
		'<div class="col-lg-2 col-sm-12">' +
			'<label>&nbsp;</label>' +
			'<div class="form-set d-flex align-items-center">' +
				'<div class="active-switch">' +
					'<label class="switch">' +
						'<input type="checkbox">' +
						'<span class="sliders round"></span>' +
					'</label>' +
				'</div>' +
				'<a href="#" class="del-action ms-2 trash"><i class="fe fe-trash-2"></i></a>' +
			'</div>' +
		'</div>' +
	'</div>';
		
	$(this).parent().find(".social-info").append(socialcontent);
	$('.select').select2({
		minimumResultsForSearch: -1,
		width: '100%'
	});
	return false;
	});
	
	$('.bank-box').on('click', function(){
		$('.bank-box').removeClass('active');
		$(this).addClass('active');
	});
	
	// Social Authentication active
	
	$('.loc-set').on('click', function(){
		$('.loc-set').removeClass('soc-active');
		$(this).addClass('soc-active');
	});
	

  // Chat

	var chatAppTarget = $('.chat-window');
	(function() {
		if ($(window).width() > 991)
			chatAppTarget.removeClass('chat-slide');
		
		$(document).on("click",".chat-window .chat-users-list a.media",function () {
			if ($(window).width() <= 991) {
				chatAppTarget.addClass('chat-slide');
			}
			return false;
		});
		$(document).on("click","#back_user_list",function () {
			if ($(window).width() <= 991) {
				chatAppTarget.removeClass('chat-slide');
			}	
			return false;
		});
	})();
	
	// Chat sidebar overlay
	
	if ($(window).width() <= 1199) {
		if($('#task_chat').length > 0) {
			$(document).on('click', '#task_chat', function() {
				$('.sidebar-overlay').toggleClass('opened');
				$('#task_window').addClass('opened');
				return false;
			});
		}
	}

	if ($(window).width() > 767) {
		if($('.theiaStickySidebar').length > 0) {
			$('.theiaStickySidebar').theiaStickySidebar({
			  // Settings
			  additionalMarginTop: 125
			});
		}
	}

// var height=document.querySelector('.slimscroll').clientHeight;
// var heights=$(".slimScrollBar").position().top;
// const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
// $(window).scroll(function(){
// 	var scrollTop     = $(window).scrollTop(),
// 	elementOffset = $('.sidebar .active').offset().top,
// 	distance      = (elementOffset - scrollTop);
// });
})(jQuery);