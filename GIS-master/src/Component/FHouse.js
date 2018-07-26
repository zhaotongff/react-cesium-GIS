import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
 
class FHouse extends Component{
	componentDidMount() {
        this.viewer = new Viewer(this.cesiumContainer,{
		    shouldAnimate : true,	    
		    infoBox: false, //Disable InfoBox widget
    		selectionIndicator: false, //Disable selection indicator	
	    });

		//Enable lighting based on sun/moon positions
		this.viewer.scene.globe.enableLighting = true;

		//Enable depth testing so things behind the terrain disappear.
		this.viewer.scene.globe.depthTestAgainstTerrain = true;

		
	}
	render(){
		return(
			<div>
				<div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
			</div>
		)
	}
}

export default FHouse