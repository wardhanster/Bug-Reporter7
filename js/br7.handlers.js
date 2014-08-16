$$('.signin-button').on("click", function() {
	login_demo();
});

br7.onPageAfterAnimation("register", function() {
	$$('.reg-button').on("click", function() {
		login_demo();
	});
});

$$('.logout-button').on("click", function() {
	eraseCookie("username");
	$('#user-label').attr("data-i18n","NOT_SIGNED_IN").html("User is not signed in");
/* 	$('body').i18n(); */
});


br7.onPageInit('settings-theme', function() {
		$('form#form-theme li').on("click", function() {
		setTimeout(function() {
			changeDesign("theme");
		}, 10);
	});
});
br7.onPageInit('settings-tint', function() {
	$('form#form-tint li').on("click", function() {
		setTimeout(function() {
			changeDesign("tint");
		}, 10);
	});
});
br7.onPageInit('settings', function () {	
	$$('.save-button').on("click", function() {
		br7.alert("Error: The SQL database could not be contacted. Form data has been saved locally.","SQL Database Error");
	});
	
	$$('.reset-local-storage').on("click", function() {
		var clickedLink = $(this);
		if (br7.device.iphone) {
			var buttons1 = [
				{
					text: "This will remove data that is used to display Bugs and Settings. Installed updates are not affected. The App will be restarted once the process is finished.",
					label: true
				},
				{
					text: "Remove Now",
					red: true,
					color: "theme-red",
					onClick: function() {
						clearInterval(timedTheme);
						localStorage.clear();
    					$('body').append("<div class=\"update-view\"><img src=\"iTunesArtwork.png\" /></div>");
    					setTimeout(function() {
    						$('.update-view').append("<div class=\"progress-bar\"><div class=\"inner-progress\" id=\"update-progress\"></div></div>");
    						interval = setInterval(function() {
    							addProgress("update-progress");
    						}, Math.random() * 750);
    					}, 1000);
					}
				}
			];
			var buttons2 = [
				{
					text: "Cancel",
					bold: true
				}
			];
			var group = [buttons1, buttons2];
			br7.actions(group);
		
		} else {
			br7.modal({
				title: "Remove Website Data",
				text: "This will remove data that is used to display Bugs and Settings. Installed updates are not affected. The App will be restarted once the process is finished.",
				buttons: [
					{
						text: "Remove Now",
						onClick: function() {
							clearInterval(timedTheme);
							localStorage.clear();
	    					$('body').append("<div class=\"update-view\"><img src=\"iTunesArtwork.png\" /></div>");
	    					setTimeout(function() {
	    						$('.update-view').append("<div class=\"progress-bar\"><div class=\"inner-progress\" id=\"update-progress\"></div></div>");
	    						interval = setInterval(function() {
	    							addProgress("update-progress");
	    						}, Math.random() * 750);
	    					}, 1000);
						}
					},
					{
						text: "Cancel"
					}
				]
			});

		}
	});
	
});

br7.onPageInit("getting-started-main", function() {
	var mySlider = br7.slider('.slider-container-h', {
			spaceBetween: 100,
			pagination:'.slider-pagination-h',
			paginationHide: false
	});
	/*var vSlider = br7.slider('.slider-container-v', {
			spaceBetween: 100,
			pagination:'.slider-pagination-v',
			paginationHide: false
	});*/
	$('[data-page="getting-started-main"] .close-popup').on("click", function() {
		setTimeout(function() {
			//gettingStartedView.goBack();
		}, 300);
	});
});

br7.onPageBeforeAnimation("index", function() {
	rebindUserPanel();
	login_checkCookie();
	openBugsCount = 0;
	for (var i = 0; i < bugsStorage.length; i++) {
		var bugsItem = bugsStorage[i];
		if (bugsItem.status == "open") {
			openBugsCount++;
		}
	}
	$('#open-badge').html(openBugsCount);
/* 	$('body').i18n(); */
});

br7.onPageBeforeAnimation("bugs-open", function() {
	buildHTML("open");
	br7 = new Framework7();
/* 	$('body').i18n(); */
});
br7.onPageBeforeAnimation("bugs-closed", function() { 
	buildHTML("closed");
	br7 = new Framework7();
/* 	$('body').i18n(); */
});
br7.onPageBeforeAnimation("bugs-archived", function() {
	buildHTML("archived");
	br7 = new Framework7();
/* 	$('body').i18n(); */
});

br7.onPageAfterAnimation("update", function() {
	if (navigator.onLine) {
		if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
		setTimeout(function() {
			br7update();
		}, 1000);
	} else {
			setTimeout(function() {
			window.applicationCache.removeEventListener("updateready", checkForUpdatesOnLoad, false);
			window.applicationCache.addEventListener("updateready", function() {
				if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
					br7update(); 
				}
			}, false);
			window.applicationCache.update();
		}, 2000);
			setTimeout(function() {
				if (window.applicationCache.status === window.applicationCache.IDLE) { 
					$('p#update-status').html(unescape("Bug Reporter%u2077 "+br7version+"<br>Your software is up to date."));
				} 
			}, 3000);
		}
	} else {
		br7.alert("Software Update is not available at this time. Try again later", "Software Update Unavailable");
		$('p#update-status').html("Software Update Unavaliable.");
	}
}); 

br7.onPageBeforeAnimation("update-detail", function() {
	$.getJSON("update.json", function(data) {
		$('span#content').html(data.en.updates[0].content + "<br><br>" + data.en.updates[0].instructions); 
	});
});
br7.onPageBeforeAnimation("update-installed", function() {
	var html = "";
	for (var i=0; i<br7installedUpdates.length; i++) {
		html += "<li><a href=\"#\" class=\"item-link\"><div class=\"item-content\"><div class=\"item-inner\"><div class=\"item-title\">"+br7installedUpdates[i]+"</div></div></div></a></li>";
	}
	$('.page-content#installed-updates .list-block ul').html(html);
});

$$('.erase-cookies').on("click", function() {
	eraseCookie("username");
});

$('.submit-bug').on("click", function() {
	if (readCookie("username") && $('[name="newBugName"]').val() != "" && $('[name="newBugDesc"]').val() != "") {
		var date = new Date();
		var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
		var dateString = ("0" + date.getDate()).slice(-2) + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear() + " " +  ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
		bugsStorage.push({
			title: $('[name="newBugName"]').val() + " ",
			category: $('[name="newBugCat"]').val() + " ",
			description: $('[name="newBugDesc"]').val() + " ",
			author: readCookie("username"),
			status: "open",
			id: bugsStorage.length +1,
			date: dateString
		});
		localStorage.bugsData = JSON.stringify(bugsStorage);
		br7.showPreloader("Submitting...");
		setTimeout(function() {
			br7.hidePreloader();
			setTimeout(function() {
				br7.closeModal();
				buildHTML("open");
				setTimeout(function() {
					$('[name="newBugName"]').val("");
					$('[name="newBugDesc"]').val("");
				}, 300);
				setTimeout(function() {
					$('.views').removeClass("popup-compose");
				}, 500);
			}, 500);
		}, 2000);
	} else if (!readCookie("username")) {
		br7.alert("This feature requires a valid login.","User not logged in");
	} else if ($('[name="newBugName"]').val() == "") {
		br7.alert("Please specify a title before continuing.", "Missing fields");
	} else if ($('[name="newBugDesc"]').val() == "") {
		br7.alert("Please enter some details before continuing.", "Missing fields");
	}
});

$$('.popup-update-detail').on("open", function() {
	$.getJSON("update.json", function(data) {
		$('span#content').html(data.en.updates[0].content + "<br><br>" + data.en.updates[0].instructions); 
	});
});