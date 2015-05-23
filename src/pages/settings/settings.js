// Initialize KC3 Application
var app = new KC3();

// Get manifest version
var manifest = chrome.runtime.getManifest();

// Page ready
$(document).on("ready", function(){
	// Get current configs
	app.Config.init();
	
	// Show version number
	$(".about_version span").text(manifest.version);
	$(".kc3kaiextid").text(chrome.runtime.id);
	
	// On-Screen Quest Translations
	showInput_tloverlay();
	$(".tloverlay").on("click", function(){
		app.Config.tl_overlay = !app.Config.tl_overlay;
		app.Config.save();
		showInput_tloverlay();
	});
	
	// Timer allowance
	showInput_allowance();
	$(".allowance input").on("change", function(){
		app.Config.time_dev = parseInt($(this).val(), 10) || 0;
		app.Config.save();
		showInput_allowance();
	});
	
	// Alert Sounds
	showInput_alerting();
	$(".alerting .option").on("click", function(){
		app.Config.timerAlert = $(this).data("num");
		app.Config.save();
		showInput_alerting();
	});
	$(".soundurl input").on("change", function(){
		app.Config.customsound = $(this).val();
		app.Config.save();
		showInput_alerting();
	});
	
	// Alert Volume
	showInput_volume();
	$(".volume input").on("change", function(){
		app.Config.alert_volume = parseInt($(this).val(), 10) || 0;
		app.Config.save();
		showInput_volume();
	});
	
	// Desktop Notification
	showInput_desktop();
	$(".desktop").on("click", function(){
		app.Config.desktop_notif = !app.Config.desktop_notif;
		app.Config.save();
		showInput_desktop();
	});
	
	// Screenshot Mode
	showInput_ssmode();
	$(".ssmode .option").on("click", function(){
		app.Config.ss_mode = $(this).data("num");
		app.Config.save();
		showInput_ssmode();
	});
	
	// Game Screen: Top Margin
	showInput_margin();
	$(".margin input").on("change", function(){
		app.Config.gambox_margin = parseInt($(this).val(), 10) || 0;
		app.Config.save();
		showInput_margin();
	});
	
	// Game Screen: Background
	showInput_background();
	$(".background input").on("change", function(){
		app.Config.background = $(this).val();
		app.Config.save();
		showInput_background();
	});
	
	// Panel: Background
	showInput_backgroundPanel();
	$(".background_panel input").on("change", function(){
		app.Config.background_panel = $(this).val();
		app.Config.save();
		showInput_backgroundPanel();
	});
	
	// Panel: Background Align Horizontal
	showInput_backgroundAlignH();
	$(".background_align_h .option").on("click", function(){
		app.Config.background_align_h = $(this).data("horizontal");
		app.Config.save();
		showInput_backgroundAlignH();
	});

	// Panel: Background Align Vertical
	showInput_backgroundAlignV();
	$(".background_align_v .option").on("click", function(){
		app.Config.background_align_v = $(this).data("vertical");
		app.Config.save();
		showInput_backgroundAlignV();
	});

	// Panel Transparency
	showInput_palpha();
	$(".panelalpha input").on("change", function(){
		app.Config.panelAlpha = parseInt($(this).val(), 10) || 0;
		app.Config.save();
		showInput_palpha();
	});
	
	// Reveal ship face
	showInput_reveal();
	$(".reveal").on("click", function(){
		app.Config.reveal_names = !app.Config.reveal_names;
		app.Config.save();
		showInput_reveal();
	});
	
	// Show compass results
	showInput_compass();
	$(".showCompass").on("click", function(){
		app.Config.showCompass = !app.Config.showCompass;
		app.Config.save();
		showInput_compass();
	});
	
	// Predict battles
	showInput_predict();
	$(".predictBattle").on("click", function(){
		app.Config.predictBattle = !app.Config.predictBattle;
		app.Config.save();
		showInput_predict();
	});
	
	// Show craft boxes
	showInput_craft();
	$(".showCraft").on("click", function(){
		app.Config.showCraft = !app.Config.showCraft;
		app.Config.save();
		showInput_craft();
	});
	
	// Show Exit Confirmation
	showInput_exiting();
	$(".askExit .option").on("click", function(){
		app.Config.askExit = $(this).data("num");
		app.Config.save();
		showInput_exiting();
	});
	
});

function showInput_tloverlay(){
	$(".tloverlay").fadeOut(200, function(){
		$("input", this).prop("checked", app.Config.tl_overlay);
		$(this).fadeIn(200);
	});
}

function showInput_allowance(){
	$(".allowance").fadeOut(200, function(){
		$("input", this).val(app.Config.time_dev);
		$(this).fadeIn(200);
	});
}

function showInput_alerting(){
	$(".alerting").fadeOut(200, function(){
		$(".option-"+app.Config.timerAlert+" input", this).prop("checked", true);
		$(".soundurl input").val(app.Config.customsound);
		if(app.Config.timerAlert==5){
			$(".soundurl").show();
		}else{
			$(".soundurl").hide();
		}
		$(this).fadeIn(200);
	});
}

function showInput_volume(){
	$(".volume").fadeOut(200, function(){
		$("input", this).val(app.Config.alert_volume);
		$(this).fadeIn(200);
	});
}

function showInput_desktop(){
	$(".desktop").fadeOut(200, function(){
		$("input", this).prop("checked", app.Config.desktop_notif);
		$(this).fadeIn(200);
	});
}

function showInput_ssmode(){
	$(".ssmode").fadeOut(200, function(){
		$(".option-"+app.Config.ss_mode+" input", this).prop("checked", true);
		$(this).fadeIn(200);
	});
}

function showInput_margin(){
	$(".margin").fadeOut(200, function(){
		$("input", this).val(app.Config.gambox_margin);
		$(this).fadeIn(200);
	});
}

function showInput_background(){
	$(".background").fadeOut(200, function(){
		$("input", this).val(app.Config.background);
		$(this).fadeIn(200);
	});
}

function showInput_backgroundPanel(){
	$(".background_panel").fadeOut(200, function(){
		$("input", this).val(app.Config.background_panel);
		$(this).fadeIn(200);
	});
}

function showInput_backgroundAlignH(){
	$(".background_align_h").fadeOut(200, function(){
		$(".option-"+app.Config.background_align_h+" input", this).prop("checked", true);
		$(this).fadeIn(200);
	});
}

function showInput_backgroundAlignV(){
	$(".background_align_v").fadeOut(200, function(){
		$(".option-"+app.Config.background_align_v+" input", this).prop("checked", true);
		$(this).fadeIn(200);
	});
}

function showInput_palpha(){
	$(".panelalpha").fadeOut(200, function(){
		$("input", this).val(app.Config.panelAlpha);
		$(this).fadeIn(200);
	});
}

function showInput_reveal(){
	$(".reveal").fadeOut(200, function(){
		$("input", this).prop("checked", app.Config.reveal_names);
		$(this).fadeIn(200);
	});
}

function showInput_compass(){
	$(".showCompass").fadeOut(200, function(){
		$("input", this).prop("checked", app.Config.showCompass);
		$(this).fadeIn(200);
	});
}

function showInput_predict(){
	$(".predictBattle").fadeOut(200, function(){
		$("input", this).prop("checked", app.Config.predictBattle);
		$(this).fadeIn(200);
	});
}

function showInput_craft(){
	$(".showCraft").fadeOut(200, function(){
		$("input", this).prop("checked", app.Config.showCraft);
		$(this).fadeIn(200);
	});
}

function showInput_exiting(){
	$(".askExit").fadeOut(200, function(){
		$(".option-"+app.Config.askExit+" input", this).prop("checked", true);
		$(this).fadeIn(200);
	});
}