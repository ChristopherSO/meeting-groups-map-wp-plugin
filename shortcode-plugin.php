<?php

/**
* Plugin.
*
* @package meeting-groups-map-plugin
* @wordpress-plugin
*
* Plugin Name:     Meeting Groups Map WP Shortcode Plugin
* Description:     Add React app via shortcode
* Author:          Christopher Suarez
* Version:         1.0
*/

if (!defined('ABSPATH')) exit; // Exit if acceded directly by url

function meeting_groups_map_shortcode_plugin() { 
    return '<div id="react-plugin">' . plugin_dir_url( __FILE__ ) . '</div>';
} 
// register shortcode
add_shortcode('meeting-groups-map-plugin', 'meeting_groups_map_shortcode_plugin'); 

add_action('wp_enqueue_scripts', 'meeting_groups_map_enqueue_scripts');
function meeting_groups_map_enqueue_scripts()
{
	wp_enqueue_style(
		'plugin-react-style',
		plugin_dir_url( __FILE__ ) . 'build/index.css'
	);

	wp_enqueue_script(
		'google-map',
		'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLVRYA8hfFODgsRalDQpWJSDzvS2wT4qA'
	);

	wp_enqueue_script(
		'plugin-react-script',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		['wp-element'],
		rand(), // Change this to null for production
		true
	);
}
