var br7 = new Framework7({
	animateNavBackIcon: true,
	cache: false,
	cacheDuration: 1000,
	sortable: false,
	modalTitle: unescape("Bug Reporter%u2077"),
});

var br7version = "1.0.2";
var br7installedUpdates = ["1.0.2", "1.0.1", "1.0"];

var bugsStorage = localStorage.bugsData ? JSON.parse(localStorage.bugsData) : [];
var openBugsCount = 0;
for (var i = 0; i < bugsStorage.length; i++) {
	var bugsItem = bugsStorage[i];
	if (bugsItem.status == "open") {
		openBugsCount++;
	}
}
$('#open-badge').html(openBugsCount);

$(document).ready(function() {
	 $.ajaxSetup({ cache: false });
	/* i18n.init({ lng: "de", fallbackLng: "" }, function(t) {
	  $("body").i18n();
	}); */
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

var timeouts = [];

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
var interval;