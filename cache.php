<?php
header('Content-Type: text/cache-manifest');
$filesToCache = array(
    './index.html',
    
    './css/framework7.css', 
    './css/framework7.themes.css', 
    './css/bugreporter7.css',
    
    './frames/bugs-archived.html', 
    './frames/bugs-closed.html', 
    './frames/bugs-open.html', 
    './frames/getting-started.html',
    './frames/settings/settings.html',

    './img/demo_groups.png',
    './img/demo_notifications.png', 
    './img/demo_overview.png', 
    './img/demo_submit.png', 
    './img/demo_themes.png', 
    './img/demo_timed-theme.png', 
    './img/demo_universal.png',
    './img/bug_1.png',
    './img/bug_1@2x.png',

    './js/br7.js',
    './js/cookies.js',
    './js/framework7.min.js',
    './js/jquery.js',
    './js/md5.js'
);
?>
CACHE MANIFEST

CACHE:
<?php
// Print files that we need to cache and store hash data
$hashes = '';
foreach($filesToCache as $file) {
    echo $file."\n";
    $hashes.=md5_file($file);
};
?>

NETWORK:
*

# Hash Version: <?=md5($hashes)?>