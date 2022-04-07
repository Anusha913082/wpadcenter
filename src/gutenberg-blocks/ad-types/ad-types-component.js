/*global wp, jQuery, wpadcenter_singlead_verify*/
const apiFetch = wp.apiFetch;
const { Component } = wp.element;
const { __ } = wp.i18n;

class AdTypes extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			ad_id: this.props.adId,

			ad_html: {
				__html: '',
			},
		};
	}

	componentDidMount() {
		this.setState( {
			ad_html: {
				__html: `<h4 style="font-weight:300">${__( 'Loading Ad', 'wpadcenter' )}</h4>`,
			},
		} );
		this.loadAds();
	}

	loadAds() {
		var j = jQuery.noConflict();
		j.ajax( {
			type: 'POST',
			url: './admin-ajax.php',
			data: {
				action: 'wpadcenter_adtypes_gutenberg_preview',
				adtypes_nonce: wpadcenter_adtypes_verify.adtypes_nonce,
				ad_type: this.props.ad_type,
				ad_id: this.props.adId,
				alignment: this.props.adAlignment,
				max_width_check: this.props.max_width_check,
				max_width_px: this.props.max_width_px,
				ad_groups: this.props.adGroupIds,
				adgroupAlignment: this.props.adgroupAlignment,
				num_ads: this.props.numAds,
				num_columns: this.props.numColumns,
				time: this.props.time,
				ad_order: this.props.adOrder,
				adgroup_id: this.props.adGroupId,
			},
		} ).done( adtypes_html => {
			this.setState( {
				ad_html: {
					__html: JSON.parse( adtypes_html ).html,
				},
			} );

			( function( $ ) {
				'use strict';
				const slideIndex = [];
				const time = [];
				const children = [];
				$( '.wpadcenter_rotating_adgroup' ).each( function( index ) {
					slideIndex[ index ] = 0;
					time[ index ] = $( this )
						.find( '#wpadcenter_rotating_time' )
						.val();
					children[ index ] = $( this ).find(
						'.wpadcenter-ad-container',
					);
					function carousel( slideIndex, time, children ) {
						for ( let i = 0; i < children.length; i++ ) {
							$( children[ i ] ).hide();
						}
						slideIndex++;
						if ( slideIndex > children.length ) {
							slideIndex = 1;
						}
						$( children[ slideIndex - 1 ] ).css(
							'display',
							'block',
						);
						setTimeout( function() {
							carousel( slideIndex, time, children );
						}, parseInt( time * 1000 ) );
					}
					carousel(
						slideIndex[ index ],
						time[ index ],
						children[ index ],
					);
				} );
			}( jQuery ) );
		} );
	}

	render() {
		let adAlignment = {
			zIndex: '20',
			position: 'relative',
		};
		return (

			<div style={ adAlignment } dangerouslySetInnerHTML={ this.state.ad_html } ></div>
		);
	}
}
export default AdTypes;