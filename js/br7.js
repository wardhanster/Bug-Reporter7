var br7 = new Framework7({
	animateNavBackIcon: true,
	cache: false,
	cacheDuration: 1000,
	sortable: false
});
var openBugsCount = 0;
$(document).ready(function() {
	login_checkCookie();
	rebindUserPanel();
	if (!localStorage.doneTutorial) {
		br7.popup(".popup-getting-started");
	}
});

var statusbarTheme = br7.formGetData("form-theme") ? $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).theme : "default";

if (window.navigator.standalone && statusbarTheme != "dark") {
	$("meta[name='apple-mobile-web-app-status-bar-style']").removeAttr("content");
}


var bugsStorage = localStorage.bugsData ? JSON.parse(localStorage.bugsData) : [];

var $$ = Framework7.$;

var mainView = br7.addView('.view-main', {
	dynamicNavbar: true
});
var loginView = br7.addView('.view-login', {
	dynamicNavbar: true
});
var gettingStartedView = br7.addView('.view-getting-started', {
	swipeBackPages: false
});

var templateHTML;


br7.onPageInit('settings', function () {
	$('form#form-theme li').on("click", function() {
		setTimeout(function() {
			changeDesign("theme");
		}, 10);
	});
	$('form#form-tint li').on("click", function() {
		setTimeout(function() {
			changeDesign("tint");
		}, 10);
	});
	
	$$('.save-button').on("click", function() {
		br7.alert("Error: The SQL database could not be contacted. Form data has been saved locally.","SQL Database Error");
	});
});

br7.onPageInit("getting-started-main", function() {
	var mySlider = br7.slider('.slider-container-h', {
			spaceBetween: 100,
			pagination:'.slider-pagination-h',
			paginationHide: false
	});
	var vSlider = br7.slider('.slider-container-v', {
			spaceBetween: 100,
			pagination:'.slider-pagination-v',
			paginationHide: false
	});
	$('[data-page="getting-started-main"] .close-popup').on("click", function() {
		setTimeout(function() {
			gettingStartedView.goBack();
		}, 300);
	});
});

br7.onPageAfterAnimation("register", function() {
	$$('.reg-button').on("click", function() {
		login_demo();
	});
});

br7.onPageBeforeAnimation("index", function() {
	login_checkCookie();
	openBugsCount = 0;
	for (var i = 0; i < bugsStorage.length; i++) {
		var bugsItem = bugsStorage[i];
		if (bugsItem.status == "open") {
			openBugsCount++;
		}
	}
	$('#open-badge').html(openBugsCount);
});

br7.onPageInit("bugs-open", function() {
	buildHTML("open");
	br7 = new Framework7();
});
br7.onPageBeforeAnimation("bugs-closed", function() {
	buildHTML("closed");
	br7 = new Framework7();
});
br7.onPageBeforeAnimation("bugs-archived", function() {
	buildHTML("archived");
	br7 = new Framework7();
});

$$('.signin-button').on("click", function() {
	login_demo();
});

$$('.register-button').on("click", function() {
	br7.alert("test");
});

$$('.logout-button').on("click", function() {
	eraseCookie("username");
	$('#user-label').html("User is not signed in");
});

$$('.erase-cookies').on("click", function() {
	eraseCookie("username");
});

$$('.close-popup').on('click', function() {
	$(window).trigger("resize");
});


$('.submit-bug').on("click", function() {
	if (readCookie("username") && $('[name="newBugName"]').val() != "" && $('[name="newBugDesc"]').val() != "") {
		bugsStorage.push({
			title: $('[name="newBugName"]').val() + " ",
			category: $('[name="newBugCat"]').val() + " ",
			description: $('[name="newBugDesc"]').val() + " ",
			author: readCookie("username"),
			status: "open",
			id: bugsStorage.length + 1
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


function login() {
	loginView.loadPage("frames/login.php?u="+$('input#username').val()+"&p="+MD5($('input#password').val()));
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
			$('#user-label').html(readCookie("username"));
		}
		loginView.goBack(undefined, false); // URL: undefined, animatePages: false
	}, 3000);
}
function login_checkCookie() {
	if (!readCookie("username")) {
		//br7.popup(".popup-login");
	} else {
		$('#user-label').html(readCookie("username"));
	}
}
function rebindUserPanel() {
	$$('#user-label').on("click", function() {
		var clickedLink = this;
		var buttons = [
		{
				text: 'Sign off',
				bold: true,
				onClick: function () {
					eraseCookie("username");
			$('#user-label').html("User is not signed in");
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

function changeDesign(key) {
	var settingsTheme = $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))) != null ? $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))) : "default";
	var settingsTint = $.parseJSON(JSON.stringify(br7.formGetData("form-tint"))) != null ? $.parseJSON(JSON.stringify(br7.formGetData("form-tint"))) : "blue";
	switch (key) {
		case "theme":
			$('body').attr("data-theme", settingsTheme.theme);
			if (settingsTheme.theme == "dark") {
				$("meta[name='apple-mobile-web-app-status-bar-style']").removeAttr("content");
			} else {
				$("meta[name='apple-mobile-web-app-status-bar-style']").attr("content","black-translucent");
			}
			break;
		case "tint":
			$('body').attr("data-color", settingsTint.tint);
			break;
		case "init":
			$('body').attr("data-theme", settingsTheme.theme);
			$('body').attr("data-color", settingsTint.tint);
			break;
		default: break;
	}
}
changeDesign("init");

/*var bugTemplate;
$(document).ready(function() {
	bugTemplate = $$('#bug-template').html();
});*/
function buildHTML(page) {
var bugTemplate
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
			html += bugTemplate.replace(/{{title}}/g, bugsItem.title).replace(/{{category}}/g, bugsItem.category).replace(/{{description}}/g, bugsItem.description).replace(/{{author}}/g, bugsItem.author).replace(/{{status}}/g, bugsItem.status).replace(/{{id}}/g, bugsItem.id);
		}
		switch (page) {
			case "open":
				$('#bugs-open-content').html(html);
				$$('.action1').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "archived";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					setTimeout(function() {
						$(obj).closest("ul").remove();
					}, 300);
				});
				$$('.action2').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "closed";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					setTimeout(function() {
						$(obj).closest("ul").remove();
					}, 300);
				});
				break;
			case "closed":
				$('#bugs-closed-content').html(html);
				$$('.action1').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "archived";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					setTimeout(function() {
						$(obj).closest("ul").remove();
					}, 300);
				});
				$$('.action2').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					bugObject.status = "open";
					bugsStorage[issueID-1] = bugObject;
					localStorage.bugsData = JSON.stringify(bugsStorage);
					var obj = $(this);
					setTimeout(function() {
						$(obj).closest("ul").remove();
					}, 300);
				});
				break;
			case "archived":
				$('#bugs-archived-content').html(html);
				$$('.action1').on("click", function() {
					var issueID = parseInt($(this).closest(".swipeout").children(".swipeout-content").children(".issueID").html());
					var bugObject = bugsStorage[issueID-1];
					var index = bugsStorage.indexOf(bugObject);
					var obj = $(this);
					setTimeout(function() {
						$(obj).closest("ul").remove();
					}, 300);
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

var timedDesign = setInterval(function() {
	var timedThemeSwitch = br7.formGetData("form-theme") != undefined ? $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme : []
	if (timedThemeSwitch.length != 0) {
		var time = new Date();
		var hours = time.getHours();
		
		$('ul#themes').parent().addClass("disabled");
		
		if (hours >= 22 || hours <= 7) {
			$('body').attr("data-theme", "dark");
			br7.formStoreData("form-theme", {
				"theme":"dark",
				"switchTimedTheme": $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme
			});
			br7.formFromJSON('#form-theme', {
				"theme":"dark",
				"switchTimedTheme": $.parseJSON(JSON.stringify(br7.formGetData("form-theme"))).switchTimedTheme
			});
		} else {
			$('body').attr("data-theme", "default");
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

window.addEventListener('load', function (e) {
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            br7.confirm(unescape('Bug Reporter%u2077 has been updated. Would you like to update?'), function () {
                window.location.reload();
            });
        }
    }, false);
}, false);

for (var i = 0; i < bugsStorage.length; i++) {
	var bugsItem = bugsStorage[i];
	if (bugsItem.status == "open") {
		openBugsCount++;
	}
}
$('#open-badge').html(openBugsCount);
