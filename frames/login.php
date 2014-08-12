<div class="navbar">
	<div class="navbar-inner">
		<div class="center sliding"><span></span></div>
	</div>
</div>
<div class="pages">
	<div data-page="login-process" class="page navbar-through">
		<!-- Scrollable page content-->
		<div class="page-content login-process-content">
			<?php
				include("../includes/config.php");
				
				$username = $_GET['u'];
				$password = $_GET['p'];
				
				$result = mysql_query("SELECT * from `users` where username='".$username."'") or die(mysql_error());
				
				while ($adr = mysql_fetch_array($result)) {
					if ($username == $adr['username']) {
						if ($password == $adr['password']) {
							print "<img style=\"opacity:0\"src=\"iTunesArtwork.png\" onload='br7.showPreloader(\"Signing in\"); setTimeout(function() { br7.hidePreloader(); createCookie(\"username\",\"".$username."\",24); }, 2500);
										setTimeout(function() { br7.closeModal(\".popup-login\"); if (readCookie(\"username\") == undefined) { $(\"#user-label\").html(\"Login failed. Please allow Cookies on this website\"); } else { $(\"#user-label\").html(readCookie(\"username\")); }loginView.goBack(undefined, false); }, 3000);' />";
							break;
						} else {
							print "fail: wrong password";
							break;
						}
					} else {
						print "fail: invalid username";
					}
				}
			?>
		</div>
	</div>
</div>