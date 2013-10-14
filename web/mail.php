<?php
if ( !empty($_POST['from']) && !empty($_POST['message']) && !empty($_POST['from_email']) ) {

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

    // Additional headers
    $headers .= 'To: Themis <themis@pathgraphics.com>' . "\r\n";
    $headers .= 'From: '.addslashes(strip_tags($_POST['from'])).' <'.addslashes(strip_tags($_POST['from_email'])).'>' . "\r\n";

    if (mail('themis@pathgraphics.com', 'Contact from path-graphics.com', strip_tags($_POST['message']), $headers)) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false));
    }
} else {
    echo json_encode(array('success' => false));
}