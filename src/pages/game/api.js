var app = new KC3();

// If awaiting activation
var waiting = false;

// If trusted exit
var trustedExit = false;

// Show game screens
function ActivateGame(){
	waiting = false;
	$(".box-wrap").css("background", "#fff");
	$(".box-wait").hide();
	$(".box-game .game-swf").attr("src", localStorage.absoluteswf);
	$(".box-game").show();
}

$(document).on("ready", function(){
	
	// Apply initial configuration
	app.Config.init();
	app.Logging.init();
	
	// Apply interface configs
	$(".box-wrap").css("margin-top", app.Config.gambox_margin);
	if(app.Config.background.substring(0,1) == "#"){
		$("body").css("background", app.Config.background);
	}else{
		$("body").css("background-size", "cover");
		$("body").css("background-repeat", "no-repeat");
		$("body").css("background-image", "url("+app.Config.background+")");
	}
	
	// Load game meta data
	app.Meta.init("../../data/");
	
	// API link determines which screen to show
	var absoluteSwf = localStorage.absoluteswf;
	if(absoluteSwf){
		$(".api_txt textarea").text(localStorage.absoluteswf);
		$(".box-wait").show();
		waiting = true;
	}else{
		$(".box-nolink").show();
	}
	
	// Update API Link
	$(".api_submit").on('click', function(){
		if($(".api_text").val().indexOf("mainD2.swf") > -1){
			localStorage.absoluteswf = $(".api_text").val();
			trustedExit = true;
			window.location.reload();
		}
	});
	
	// Forget API Link
	$(".forget_btn").on('click', function(){
		localStorage.absoluteswf = "";
		trustedExit = true;
		window.location.reload();
	});
	
	// Quick Play
	$(".play_btn").on('click', function(){
		ActivateGame();
	});
	
	// API link select all textarea
	$(".api_txt textarea").on("focus", function() {
		var $this = $(this);
		$this.select();
		$this.mouseup(function() {
			$this.unbind("mouseup");
			return false;
		});
	});
	
});

// Extension Interaction
chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.game==="kancolle" && request.type==="game"){
		switch(request.action){
		
			// Admiral Dashboard opened, activate game
			case "activate":
				if(waiting){
					ActivateGame();
					response({success:true});
				}else{
					response({success:false});
				}
				break;
			
			// Quest Overlay
			case "quest_overlay":
				$(".box-game .overlays").html("");
				var qci, tmpQuest;
				for(qci in request.questlist){
					if(request.questlist[qci]!=-1){
						tmpQuest = app.Meta.quest(request.questlist[qci].api_no);
						
						var tmpQuestOverlay = $("#factory .ol_quest").clone().appendTo(".box-game .overlays");
						tmpQuestOverlay.css("top", (parseInt(app.Config.gambox_margin,10)+113+(qci*68))+"px");
						
						if(tmpQuest){
							$(".name", tmpQuestOverlay).text(tmpQuest.name);
							$(".desc", tmpQuestOverlay).text(tmpQuest.desc);
						}else{
							$(".name", tmpQuestOverlay).text(request.questlist[qci].api_title);
							$(".desc", tmpQuestOverlay).text(request.questlist[qci].api_detail);
						}
					}
				}
				response({success:true});
				break;
				
			// Remove overlays
			case "clear_overlays":
				$(".box-game .overlays").html("");
				response({success:true});
				break;
			
			// Take Screenshot
			case "screenshot":
				(new KCScreenshot()).start(request.playerIndex, $(".box-wrap"));
				break;
			
			default: response({success:false, message:"Unknown action"}); break;
		}
	}
});

// Confirm exit
function confirmOnPageExit(){
	app.Config.load();
	if(app.Config.askExit==1 && !trustedExit){ return "Ahh! you are closing the game!"; }
}
window.onbeforeunload = confirmOnPageExit;