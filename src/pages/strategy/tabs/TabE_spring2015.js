var TabE_spring2015 = {
	status: {
		active: false,
		error: false,
		message: "",
		check :function(){
			if(this.error){
				app.Strategy.showError( this.message );
				return false;
			}
			return true;
		}
	},
	
	maps: false,
	map: "",
	page: 0,
	
	/* Load data, still ok if not available, it's just gauge
	---------------------------------------------------*/
	init :function(){
		if(this.status.active) return true;
		
		// Check for player map infos
		if(typeof localStorage.player_maps != "undefined"){
			this.maps = JSON.parse(localStorage.player_maps);
		}
		
		this.status.active = true;
	},
	
	/* Attempt to show the page
	--------------------------------------------*/
	show :function(){
		if(!this.status.check()) return false;
		
		var self = this;
		
		// On click map
		$(".page_spr2015 .sortie_maps .sortie_map").on("click", function(){
			$(".page_spr2015 .sortie_maps .sortie_map").removeClass("active");
			$(this).addClass("active");
			self.showMap( $(this).data("mapid") );
		});
		
		// Default select on the first map
		$(".page_spr2015 .sortie_maps .sortie_map.active").trigger("click");
		
		// Load More
		$(".page_spr2015 .sortie_more").on("click", function(){
			self.loadMore();
		});
		
		// onClick a Sortie Record on the list
		$(".page_spr2015 .sortie_list").on("click", ".sortie_item", function(){
			$(".page_spr2015 .sortie_list .sortie_item").removeClass("active");
			$(this).addClass("active");
			self.showSortie( $(this).data("id") );
		});
		
		// If map infos exist, fill gauges
		if(this.maps){
			this.fillGauge(301, this.maps.m301);
			this.fillGauge(302, this.maps.m302);
			this.fillGauge(303, this.maps.m303);
			this.fillGauge(304, this.maps.m304);
			this.fillGauge(305, this.maps.m305);
			this.fillGauge(306, this.maps.m306);
		}
	},
	
	/* Attempt to fill a map's gauge
	- Different from Normal Maps and ExOps
	- HP-based, not kill-based
	--------------------------------------------*/
	fillGauge: function(map_id, data){
		var thisMapBox = $(".page_spr2015 .sortie_map.map_"+map_id);
		var getDifficulty = ["","(丙)","(乙)","(甲)"][(data || {difficulty:0}).difficulty || 0];
		
		if(typeof data != "undefined"){
			if(data.clear==0){
				$(".map_name span", thisMapBox).text(getDifficulty + " " + data.curhp + "/" + data.maxhp );
				$(".map_val", thisMapBox).css("width", ((data.curhp/data.maxhp)*98)+"px");
			}else{
				$(".map_name span", thisMapBox).text(getDifficulty + " Cleared!");
				$(".map_hp", thisMapBox).addClass("cleared");
			}
		}else{
			$(".map_hp", thisMapBox).addClass("unknown");
		}
	},
	
	/* Attempt to show the page
	--------------------------------------------*/
	showMap :function(map_id){
		this.map = map_id+"";
		this.page = 0;
		$(".page_spr2015 .sortie_maptitle span").text(this.map);
		$(".page_spr2015 .sortie_list").html("")
		this.loadMore();
	},
	
	/* Load more records, applies to first page as well
	--------------------------------------------*/
	loadMore :function(){
		var self = this;
		
		// Loading more advanced to next list
		this.page++;
		
		// Hide sortie details panel
		$(".page_spr2015 .sortie_info").hide();
		
		// Get data from local database
		app.Logging.get_map(
			parseInt(this.map.substring(0, this.map.length-1) ,10), // world number
			parseInt(this.map.substring(this.map.length-1) ,10), // map number
			this.page,
		function(response){
			var ctr;
			for(ctr in response){
				self.addSortieRecord( response[ctr] );
			}
		});
	},
	
	/* Show a single sortie record on list
	--------------------------------------------*/
	addSortieRecord :function(thisSortie){
		// Clone and add new record box
		var buildbox = $(".page_spr2015 .factory .sortie_item").clone().appendTo(".page_spr2015 .sortie_list");
		buildbox.data("id", thisSortie.id);
		
		// Show record info
		$(".sortie_id", buildbox).text( thisSortie.id );
		$(".sortie_date", buildbox).text( (new Date(thisSortie.time*1000)).mmdd() );
		
		// Determine flagship
		var flagship = -1;
		if(typeof thisSortie["fleet"+thisSortie.fleetnum] != "undefined"){
			flagship = thisSortie["fleet"+thisSortie.fleetnum][0].mst_id;
		}
		$(".sortie_flag img", buildbox).attr("src", app.Assets.shipIcon(flagship, '../../assets/img/ui/empty.png'));
		
		// Show nodes
		var bctr, battleNum;
		battleNum = 1;
		for(bctr in thisSortie.battles){
			$(".node-"+battleNum, buildbox).text(String.fromCharCode(thisSortie.battles[bctr].node+96).toUpperCase());
			$(".node-"+battleNum, buildbox).show();
			battleNum++;
		}
	},
	
	/* Show single sortie info on right panel
	--------------------------------------------*/
	showSortie :function(sortie_id){
		var self = this;
		
		// Hide sortie details panel
		$(".page_spr2015 .sortie_info").hide();
		$(".page_spr2015 .sortie_info .sortie_battles").html("");
		
		// Get data from local database
		app.Logging.get_sortie(sortie_id, function(response){
			if(response){
				$(".page_spr2015 .sortie_info .sortie_title span").text(response.id);
				
				self.showPanelFleet(1, response["fleet"+response.fleetnum]);
				
				// Check if combined fleet
				if(response.combined > 0){
					self.showPanelFleet(2, response.fleet2);
				}else{
					$(".page_spr2015 .sortie_info .fleet_2").hide();
				}
				
				// Check for support non-boss support
				try {
					if( response.support1 > 0 ){
						self.showPanelFleet(3, response["fleet"+response.support1]);
					}else{
						$(".page_spr2015 .sortie_info .fleet_3").hide();
					}
				}catch(e){ $(".page_spr2015 .sortie_info .fleet_3").hide(); }
				
				// Check for support boss support
				try {
					if( response.support2 > 0 ){
						self.showPanelFleet(4, response["fleet"+response.support2]);
					}else{
						$(".page_spr2015 .sortie_info .fleet_4").hide();
					}
				}catch(e){ $(".page_spr2015 .sortie_info .fleet_4").hide(); }
				
				// Show battle nodes
				var bctr;
				for(bctr in response.battles){
					self.showBattleBox( parseInt(bctr, 10)+1, response.battles[bctr] );
				}
				
				$(".page_spr2015 .sortie_info").animate({width: 'toggle'});
			}
		});
	},
	
	/* Fill specific fleet on panel
	--------------------------------------------*/
	showPanelFleet :function(num, fleet){
		this.showShipImage(num, fleet, 0);
		this.showShipImage(num, fleet, 1);
		this.showShipImage(num, fleet, 2);
		this.showShipImage(num, fleet, 3);
		this.showShipImage(num, fleet, 4);
		this.showShipImage(num, fleet, 5);
	},
	
	/* Show ship image on specific fleet
	--------------------------------------------*/
	showShipImage :function(num, fleet, index){
		if(fleet[index]){
			$(".page_spr2015 .sortie_info .fleet_"+num+" .fleet_img_"+(index+1)+" img").attr("src",
				app.Assets.shipIcon(fleet[index].mst_id, '../../assets/img/ui/empty.png')
			);
		}else{
			$(".page_spr2015 .sortie_info .fleet_"+num+" .fleet_img_"+(index+1)).hide();
		}
	},
	
	/* Add battle box on the panel
	--------------------------------------------*/
	showBattleBox :function(battleNum, battleData){
		
		// Clone and add new battle box
		var battleBox = $(".page_spr2015 .factory .sortie_battle").clone().appendTo(".page_spr2015 .sortie_battles");
		$(".battle_node", battleBox).text(String.fromCharCode(battleData.node+96).toUpperCase());
		$(".battle_date", battleBox).text((new Date(battleData.time*1000)).format("mmm dd, yy - hh:MM tt"));
		
		// Detection
		var detection = app.Meta.detection(battleData.data.api_search[0]);
		$(".battle_detect", battleBox).text( detection[0] );
		if( detection[1] != "" ){ $(".battle_detect", battleBox).addClass( detection[1] ); }
		
		
		// Air Battle
		var airbattle = app.Meta.airbattle(battleData.data.api_kouku.api_stage1.api_disp_seiku);
		$(".battle_air", battleBox).text( airbattle[0] );
		if( airbattle[1] != "" ){ $(".battle_air", battleBox).addClass( airbattle[1] ); }
		
		// Engagement
		$(".battle_engage", battleBox).text( app.Meta.engagement( battleData.data.api_formation[2] ) );
		
		// Support Expedition
		if( battleData.data.api_support_flag > 0 ){
			$(".battle_support", battleBox).text("YES");
			$(".battle_support", battleBox).addClass("good");
		}else{
			$(".battle_support", battleBox).text("NO");
		}
		
		
		
		$(".battle_rate img", battleBox).attr("src", "../../assets/img/client/ratings/"+battleData.rating+".png");
		
		if(battleData.drop > 0){
			$(".battle_drop img", battleBox).attr("src", app.Assets.shipIcon(battleData.drop, '../../assets/img/ui/empty.png'));
		}else{
			$(".battle_drop", battleBox).hide();
		}
	}
};