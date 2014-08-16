function login() {
	loginView.loadPage("frames/login/login.php?u="+$('input#username').val()+"&p="+MD5($('input#password').val()));
}
function login_demo() {
	br7.showPreloader("Signing in");
	setTimeout(function() {
		br7.hidePreloader();
		createCookie("username","Demo User",24);
	}, 2500);
	setTimeout(function() {
		br7.closeModal(".popup-login");
		if (readCookie("username") == undefined) {
			$('#user-label').html("Login failed. Please allow Cookies on this website.");
		} else {
			$('#user-label').html(readCookie("username")).removeAttr("data-i18n");
		}
		loginView.goBack(undefined, false); // URL: undefined, animatePages: false
	}, 3000);
}
function login_checkCookie() {
	if (!readCookie("username")) {
		//br7.popup(".popup-login");
	} else {
		$('#user-label').html(readCookie("username")).removeAttr("data-i18n");
	}
}
function rebindUserPanel() {
	$('#user-label').off("click");
	$('#user-label').on("click", function() {
		var clickedLink = this;
		var buttons = [
		{
				text: 'Sign off',
				bold: true,
				onClick: function () {
					eraseCookie("username");
					$('#user-label').attr("data-i18n","NOT_SIGNED_IN").html("User is not signed in");
/* 					$('body').i18n(); */
				}
		}];
		var buttons2 = [
		{
				text: 'Cancel',
				red: true,
				onClick: function () {
				}
		}];
	
		if (readCookie("username")) {
			if (br7.device.iphone) {
				br7.actions([buttons, buttons2]);
			} else {
				br7.popover(".popover-usercp", clickedLink);
			}
		} else {
			br7.popup(".popup-login");
		}
	});
}

function br7update() {
	var html= "<div class='animate-height'> \
	<div class='content-block tablet-inset'> \
	    <div class='content-block-inner'> \
	    	<img src='iTunesArtwork.png' style='width: 60px; height: 60px; vertical-align: top; float: left;'> \
	    	<p style='margin: 0; margin-left: 8px;'> \
	    		<span style='font-weight: 500; font-size: 16px; margin-left: 8px'>Bug Reporter&#8311; {{version}}<br></span> \
	    		<span style='font-size: 14px; margin-left: 8px'>Sniper_GER<br></span> \
	    		<span style='font-size: 14px; margin-left: 8px'>Downloaded</span> \
	    	</p> \
	    	<p>{{description}}<br><br>For more information, visit:<br><a href='https://github.com/SniperGER/Bug-Reporter7' class='external' target='_blank' style='text-decoration: underline;'>https://github.com/SniperGER/Bug-Reporter7</a>{{instructions}}</p> \
	    </div> \
	</div> \
	</div> \
	<div class='list-block tablet-inset'> \
	    <ul> \
	    	<li> \
	    		<a href='#' class='item-link open-popup' data-popup='.popup-update-detail'> \
	    			<div class='item-content'> \
	    				<div class='item-inner'> \
	    					<div class='item-title'>Details</div> \
	    				</div> \
	    			</div> \
	    		</a> \
	    	</li> \
	    </ul> \
	</div> \
	<div class='list-block tablet-inset'> \
	    <ul> \
	    	<li class='center item-button'> \
	    		<a href='#' class='update-button'> \
	    			<div class='item-content'> \
	    				<div class='item-inner'> \
	    					<div class='item-title' style='width: 100%;'>Install</div> \
	    				</div> \
	    			</div> \
	    		</a> \
	    	</li> \
	    </ul> \
	</div>";
	$.getJSON("update.json", function(data) {
	    $('p#update-status').closest(".page-content").html(html.replace(/{{version}}/g, data.en.updates[0].version).replace(/{{description}}/g, data.en.updates[0].description).replace(/{{instructions}}/g, ""));
		$('span#content').html(data.en.updates[0].content);
	    $('.update-button').on("click", function() {
	    	br7.modal({
	    		title: "Software Update",
	    		text: unescape("Bug Reporter%u2077 "+data.en.updates[0].version+" will begin installing. The app will restart when installation is finished."),
	    		buttons: [
	    			{
	    				text: "Later",
	    				onClick: function() {
		    				br7.closeModal(); 
	    				}
	    			},
	    			{
	    				text: "Install",
	    				bold: true,
	    				onClick: function() {
	    					br7.hidePreloader();
	    					$('body').append("<div class=\"update-view\"><img src=\"iTunesArtwork.png\" /></div>");
	    					setTimeout(function() {
	    						$('.update-view').append("<div class=\"progress-bar\"><div class=\"inner-progress\" id=\"update-progress\"></div></div>");
	    						interval = setInterval(function() {
	    							addProgress("update-progress");
	    						}, Math.random() * 750);
	    					}, 1000);
	    				}
	    			}
	    		]
	    	});
	    });
	});
}

function changeDesign(key) {
	var settingsTheme = $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))) != null ? $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))) : "default";
	var settingsTint = $.parseJSON(JSON.stringify(br7.formGetData("form-tint"))) != null ? $.parseJSON(JSON.stringify(br7.formGetData("form-tint"))) : "blue";
	switch (key) {
		case "theme":
			$('body').removeClass("layout-dark layout-white").addClass("layout-"+settingsTheme.theme).attr("data-theme", settingsTheme.theme);
			if (settingsTheme.theme == "dark") {
				$("meta[name='apple-mobile-web-app-status-bar-style']").removeAttr("content");
			} else {
				$("meta[name='apple-mobile-web-app-status-bar-style']").attr("content","black-translucent");
			}
			break;
		case "tint":
			$('body').removeClass("theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray").addClass("theme-"+settingsTint.tint).attr("data-color", settingsTint.tint);
			break;
		case "init":
			$('body').removeClass("layout-dark layout-white").addClass("layout-"+settingsTheme.theme).attr("data-theme", settingsTheme.theme);
			$('body').removeClass("theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray").addClass("theme-"+settingsTint.tint).attr("data-color", settingsTint.tint);
			break;
		default: break;
	}
}
changeDesign("init");

var progress = 0;
function giveRandom(limit) {
	return Math.floor(Math.random() * limit) + 1;
}
function addProgress(selector, callback) {
	if (progress < 100) {
		var randomValue = giveRandom(30);
		if ((progress + randomValue) <= 100) {
			progress = progress + randomValue;
		} else {
			progress = 100;
		}
	} else if (progress >=100) {
		progress = 100;
		clearInterval(interval);
		interval = undefined;
		setTimeout(function() { $('.progress-bar').remove() }, 1000);
		setTimeout(function() { window.location.reload() }, 2000);

	}
	$('#'+selector).css("width",progress+"%");
}

function buildHTML(page) {
	var bugTemplate;
	switch (page) {
		case "open": bugTemplate = $$('#bug-open-template').html(); break;
		case "closed": bugTemplate = $$('#bug-closed-template').html(); break;
		case "archived": bugTemplate = $$('#bug-archived-template').html(); break;
		default: break;
	}
	var html = '';
	for (var i = 0; i < bugsStorage.length; i++) {
		var bugsItem = bugsStorage[i];
		if (bugsItem.status == page) {
			html += bugTemplate.replace(/{{title}}/g, bugsItem.title).replace(/{{category}}/g, bugsItem.category).replace(/{{description}}/g, bugsItem.description).replace(/{{author}}/g, bugsItem.author).replace(/{{status}}/g, bugsItem.status).replace(/{{id}}/g, bugsItem.id).replace(/{{date}}/g, bugsItem.date);
		}
		switch (page) {
			case "open":
				$('#bugs-open-content').html(html);
				if ($('#bugs-open-content').children("div.list-block").length > 0) {
					$('.page-content.bug-bg#bugs-open-content').removeClass("bug-bg");
				}
				$$('.action1').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "archived";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					timeouts.push(setTimeout(function() {
						$(obj).closest("div.list-block").remove();
						if ($('#bugs-open-content').children("div.list-block").length < 1) {
							$('.page-content.bug-no-bg').addClass("bug-bg").html("");
						}
					}, 300));
				});
				$$('.action2').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "closed";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					timeouts.push(setTimeout(function() {
						$(obj).closest("div.list-block").remove();
						if ($('#bugs-open-content').children("div.list-block").length < 1) {
							$('.page-content.bug-no-bg').addClass("bug-bg").html("");
						}
					}, 300));
				});
				break;
			case "closed":
				$('#bugs-closed-content').html(html);
				if ($('#bugs-closed-content').children("div.list-block").length > 0) {
					$('.page-content.bug-bg#bugs-closed-content').removeClass("bug-bg");
				}
				$$('.action1').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "archived";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					timeouts.push(setTimeout(function() {
						$(obj).closest("div.list-block").remove();
						if ($('#bugs-closed-content').children("div.list-block").length < 1) {
							$('.page-content.bug-no-bg').addClass("bug-bg").html("");
						}
					}, 300));
				});
				$$('.action2').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "open";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					timeouts.push(setTimeout(function() {
						$(obj).closest("div.list-block").remove();
						if ($('#bugs-closed-content').children("div.list-block").length < 1) {
							$('.page-content.bug-no-bg').addClass("bug-bg").html("");
						}
					}, 300));
				});
				break;
			case "archived":
				$('#bugs-archived-content').html(html);
				if ($('#bugs-archived-content').children("div.list-block").length > 0) {
					$('.page-content.bug-bg#bugs-archived-content').removeClass("bug-bg");
				}
				$$('.action1').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					var index = bugsStorage.indexOf(bugObject);
					var obj = $(this);
					timeouts.push(setTimeout(function() {
						$(obj).closest("div.list-block").remove();
						if ($('#bugs-archived-content').children("div.list-block").length < 1) {
							$('.page-content.bug-no-bg').addClass("bug-bg").html("");
						}
					}, 300));
					if (index > -1) {
						bugsStorage.splice(index, 1);
						localStorage.bugsData = JSON.stringify(bugsStorage);
					}
				});
				break;
			default: break;
		}
	}
}

var timedTheme = setInterval(function() {
	var timedThemeSwitch = br7.formGetData("form-theme") != undefined ? $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme : []
	if (timedThemeSwitch.length != 0) {
		var time = new Date();
		var hours = time.getHours();
		
		$('ul#themes').parent().addClass("disabled");
		
		if (hours >= 22 || hours <= 7) {
			$('body').removeClass("layout-dark layout-white").addClass("layout-dark").attr("data-theme", "dark");
			br7.formStoreData("form-theme", {
				"theme":"dark",
				"switchTimedTheme": $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme
			});
			br7.formFromJSON('#form-theme', {
				"theme":"dark",
				"switchTimedTheme": $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme
			});
		} else {
			$('body').removeClass("layout-dark").attr("data-theme", "default");
			br7.formStoreData("form-theme", {
				"theme":"default",
				"switchTimedTheme": $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme
			});
			br7.formFromJSON('#form-theme', {
				"theme":"default",
				"switchTimedTheme": $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme
			});
		}
	} else {
		$('ul#themes').parent().removeClass("disabled");
	}
}, 100);

function checkForUpdatesOnLoad() {
	if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
		$.getJSON("update.json", function(data) {
			br7.modal({
				title: "Software Update",
				text: "Version "+data.en.updates[0].version+" is now available.",
				buttons: [
					{
						text: "Close"
					},
					{
						text: "Details",
						bold: true,
						onClick: function() {
							br7.closeModal();
							mainView.loadPage("frames/settings/update");
						}
					}
				]
			});
		});
	}
}
window.addEventListener('load', function (e) {
    window.applicationCache.addEventListener('updateready', checkForUpdatesOnLoad, false);
}, false);