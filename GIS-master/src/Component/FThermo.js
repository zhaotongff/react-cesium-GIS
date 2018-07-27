import React, { Component } from 'react';
/*import h337 from 'heatmap.js/build/heatmap.min.js'*/
import h337 from 'heatmap.js/build/heatmap.js'
import "./stylesheet/landingpage.css"
import "./stylesheet/prism.css"
import "./stylesheet/commons.css"
class FThermo extends Component{

  /*  componentDidMount() {



    var heatmapInstance = h337.create({
        container: document.querySelector('#heatmap'),
    });
    //构建一些随机数据点,网页切图价格这里替换成你的业务数据
    var points = [];
    var max = 0;
    var width = 600;
    var height = 400;
    var len = 100;
    while (len--) {
        var val = Math.floor(Math.random()*100);
        max = Math.max(max, val);
        var point = {
            x: Math.floor(Math.random()*width),
            y: Math.floor(Math.random()*height),
            value: val
        };
        points.push(point);
    }
    var data = {
        max: max,
        data: points
    };
    // 57 //因为data是一组数据,web切图报价所以直接setData
    heatmapInstance.setData(data); 
}
        render(){
		return(
          <div>
              <div class="heatmap-wrapper">

                  <div id="heatmap">
                  </div>
              </div>
              <section class="example">

                  <div class="example-1">
                      <button class="btn-gethm btn"></button>
                  </div>
              </section>
		  </div>
		)
	}
*/

componentDidMount() {
     window.onload = function() {

        var ex1el = document.querySelector('.example-1');

        document.querySelector('.btn-gethm').onclick = function() {

    
        };

        var heatmap1 = h337.create({

          container: ex1el

        });

        var refreshHeatmap1 = function() {

          var data1 = {};

          var datap1 = [];

          var max1 = 0;

          var w = 320;

          var h = 270;

          var l = 50;

          while(l--) {

            var val = Math.random()*10;

            max1 = Math.max(max1, val);

            var d = {

              x: Math.floor(Math.random()*w),

              y: Math.floor(Math.random()*h),

              value: val

            };

            datap1.push(d);

          }

          data1["max"] = max1;

          data1["data"] = datap1;



          heatmap1.setData(data1);

        };

        refreshHeatmap1();



        ex1el.onclick = function() {

          refreshHeatmap1();

        };



        window.requestAnimationFrame = (function(){

          return  window.requestAnimationFrame       ||

                  window.webkitRequestAnimationFrame ||

                  window.mozRequestAnimationFrame    ||

                  function( callback ){

                    window.setTimeout(callback, 1000 / 60);

                  };

        })();





        var body = document.body;

        var bodyStyle = getComputedStyle(body);

        var hmEl = document.querySelector('.heatmap-wrapper');



        hmEl.style.width = bodyStyle.width;

        hmEl.style.height = '1400px';



        var hm = document.querySelector('#heatmap');



        var heatmap = h337.create({

          container: hm

        });


        var trackData = false;


        setInterval(function() {

          trackData = true;

        }, 50);


        var idleTimeout, idleInterval;

        var lastX, lastY;

        var idleCount;
        function startIdle() {
          idleCount = 0;
          function idle() {
            heatmap.addData({
              x: lastX,

              y: lastY
            });

            idleCount++;

            if (idleCount > 10) {

              clearInterval(idleInterval);
            }

          };

          idle();

          idleInterval = setInterval(idle, 1000);

        };

        body.onmousemove = function(ev) {

          if (idleTimeout) clearTimeout(idleTimeout);

          if (idleInterval) clearInterval(idleInterval);

          if (trackData) {

            lastX = ev.pageX;

            lastY = ev.pageY;

            heatmap.addData({

              x: lastX,

              y: lastY

            });

            trackData = false;

          }

          idleTimeout = setTimeout(startIdle, 500);

        };

        

       



        setTimeout(function() {

          document.querySelector('.sharer').classList.add('show');

        },1000);



      };



}


 render(){
    return(

       <div>
              <div class="heatmap-wrapper">

                  <div id="heatmap">
                  </div>
              </div>
              <section class="example">

                  <div class="example-1">
                      <button class="btn-gethm btn"></button>
                  </div>
              </section>
      </div>

       
      )


  }



}

export default FThermo