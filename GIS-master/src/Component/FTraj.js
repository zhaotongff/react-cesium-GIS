import React, { Component } from 'react';
//import {Viewer} from 'cesium'
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

//import { Math as CesiumMath, Cartesian3, Color, createWorldTerrain, ArcGisMapServerImageryProvider } from "cesium";

import SampledPositionProperty from 'cesium/Source/DataSources/SampledPositionProperty'
import PolylineGlowMaterialProperty from 'cesium/Source/DataSources/PolylineGlowMaterialProperty'


import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import Color from 'cesium/Source/Core/Color'
import Transforms from 'cesium/Source/Core/Transforms'
import Ellipsoid from 'cesium/Source/Core/Ellipsoid'
import JulianDate from 'cesium/Source/Core/JulianDate'
import Math from 'cesium/Source/Core/Math'
import Matrix4 from 'cesium/Source/Core/Matrix4'
import HeadingPitchRoll from 'cesium/Source/Core/HeadingPitchRoll'
import HeadingPitchRange from 'cesium/Source/Core/HeadingPitchRange'

import Model from 'cesium/Source/Scene/Model'
import ModelAnimationLoop from 'cesium/Source/Scene/ModelAnimationLoop'


const url = '../cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.glb'


class FTraj extends Component{
componentDidMount() {
    var viewer = new Viewer('cesiumContainer',{
        shouldAnimate : true
    });

    var canvas = viewer.canvas;
    canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
    canvas.addEventListener('click', function() {
        canvas.focus();
    });
    canvas.focus();

    var scene = viewer.scene;

    var pathPosition = new SampledPositionProperty();

    var entity = viewer.entities.add({
        name : 'fly',
        position : pathPosition,
        path : {
            show : true,
            leadTime : 0,
            trailTime : 60,
            width : 10,
            resolution : 1,
            material : new PolylineGlowMaterialProperty({
                glowPower : 0.3,
                color : Color.PALEGOLDENROD
            })
        }
     });

    var camera = viewer.camera;
    var controller = scene.screenSpaceCameraController;
    var r = 0;
    var center = new Cartesian3();

    var hpRoll = new HeadingPitchRoll();
    var hpRange = new HeadingPitchRange();
    var speed = 10;
    var deltaRadians = Math.toRadians(3.0);

    var position = Cartesian3.fromDegrees(-123.0744619, 44.0503706, 5000.0);
    var speedVector = new Cartesian3();
    var fixedFrameTransform = Transforms.localFrameToFixedFrameGenerator('north', 'west');

    var planePrimitive = scene.primitives.add(Model.fromGltf({
        url : url,
        modelMatrix : Transforms.headingPitchRollToFixedFrame(position, hpRoll, Ellipsoid.WGS84, fixedFrameTransform),
        minimumPixelSize : 128
    }));

    planePrimitive.readyPromise.then(function(model) {
        // Play and loop all animations at half-speed
        model.activeAnimations.addAll({
            speedup : 0.5,
            loop : ModelAnimationLoop.REPEAT
        });
        // Zoom to model
        r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
        controller.minimumZoomDistance = r * 0.5;
        Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center, center);
        var heading = Math.toRadians(230.0);
        var pitch = Math.toRadians(-20.0);
        hpRange.heading = heading;
        hpRange.pitch = pitch;
        hpRange.range = r * 50.0;
        camera.lookAt(center, hpRange);
    });

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 40:
                if (e.shiftKey) {
                    // speed down
                    speed = Math.max(--speed, 1);
                } else {
                    // pitch down
                    hpRoll.pitch -= deltaRadians;
                    if (hpRoll.pitch < -Math.TWO_PI) {
                        hpRoll.pitch += Math.TWO_PI;
                    }
                }
                break;
            case 38:
                if (e.shiftKey) {
                    // speed up
                    speed = Math.min(++speed, 100);
                } else {
                    // pitch up
                    hpRoll.pitch += deltaRadians;
                    if (hpRoll.pitch > Math.TWO_PI) {
                        hpRoll.pitch -= Math.TWO_PI;
                    }
                }
                break;
            case 39:
                if (e.shiftKey) {
                    // roll right
                    hpRoll.roll += deltaRadians;
                    if (hpRoll.roll > Math.TWO_PI) {
                        hpRoll.roll -= Math.TWO_PI;
                    }
                } else {
                    // turn right
                    hpRoll.heading += deltaRadians;
                    if (hpRoll.heading > Math.TWO_PI) {
                        hpRoll.heading -= Math.TWO_PI;
                    }
                }
                break;
            case 37:
                if (e.shiftKey) {
                    // roll left until
                    hpRoll.roll -= deltaRadians;
                    if (hpRoll.roll < 0.0) {
                        hpRoll.roll += Math.TWO_PI;
                    }
                } else {
                    // turn left
                    hpRoll.heading -= deltaRadians;
                    if (hpRoll.heading < 0.0) {
                        hpRoll.heading += Math.TWO_PI;
                    }
                }
                break;
            default:
        }
    });

    var headingSpan = document.getElementById('heading');
    var pitchSpan = document.getElementById('pitch');
    var rollSpan = document.getElementById('roll');
    var speedSpan = document.getElementById('speed');
    var fromBehind = document.getElementById('fromBehind');

    viewer.scene.preUpdate.addEventListener(function(scene, time) {
        speedVector = Cartesian3.multiplyByScalar(Cartesian3.UNIT_X, speed / 10, speedVector);
        position = Matrix4.multiplyByPoint(planePrimitive.modelMatrix, speedVector, position);
        pathPosition.addSample(JulianDate.now(), position);
        Transforms.headingPitchRollToFixedFrame(position, hpRoll, Ellipsoid.WGS84, fixedFrameTransform, planePrimitive.modelMatrix);

        if (fromBehind.checked) {
            // Zoom to model
            Matrix4.multiplyByPoint(planePrimitive.modelMatrix, planePrimitive.boundingSphere.center, center);
            hpRange.heading = hpRoll.heading;
            hpRange.pitch = hpRoll.pitch;
            camera.lookAt(center, hpRange);
        }
    });

    viewer.scene.preRender.addEventListener(function(scene, time) {
        headingSpan.innerHTML = Math.toDegrees(hpRoll.heading).toFixed(1);
        pitchSpan.innerHTML = Math.toDegrees(hpRoll.pitch).toFixed(1);
        rollSpan.innerHTML = Math.toDegrees(hpRoll.roll).toFixed(1);
        speedSpan.innerHTML = speed.toFixed(1);
    });
}



render(){
    return (
    	<div>
            <div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
        	<div id="toolbar">
			    <table className="infoPanel">
			        <tbody>
			        <tr>
			            <td>Click on the 3D window then use the keyboard to change settings.</td>
			        </tr>
			        <tr>
			            <td>Heading: <span id="heading"></span>°</td>
			        </tr>
			        <tr>
			            <td>← to left/→ to right</td>
			        </tr>
			        <tr>
			            <td>Pitch: <span id="pitch"></span>°</td>
			        </tr>
			        <tr>
			            <td>↑ to up/↓ to down</td>
			        </tr>
			        <tr>
			            <td>roll: <span id="roll"></span>°</td>
			        </tr>
			        <tr>
			            <td>← + ⇧ left/→ + ⇧ right</td>
			        </tr>
			        <tr>
			            <td>Speed: <span id="speed"></span>m/s</td>
			        </tr>
			        <tr>
			            <td>↑ + ⇧ to speed up/↓ + ⇧ to speed down</td>
			        </tr>
			        <tr>
			            <td>following aircraft
			                <input id="fromBehind" type="checkbox"/>
			            </td>
			        </tr>

			        </tbody>
			    </table>
			</div>
		</div>
    );
}
}

export default FTraj