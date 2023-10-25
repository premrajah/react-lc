export const    Speedometer=(props)=>{


    let  percentage=(3455*100)/10000
    let rotate=(180*percentage)/100
    return(

        <div className="position-relative">

            <div className="custom-speedo text-center flex-column align-items-center justify-content-center d-flex">
                <div className={"speedo-labels d-flex flex-row justify-content-around"}>
                    {/*<div className={"speed-min"}>0</div>*/}
                    {/*<div className={"speed-max"}>10,000</div>*/}
                </div>
                <div className="semi-donut margin position-relative"
                     style={{"--percentage": {percentage}, "--fill": "#07ad89","--rotate": {rotate} }}>
                    <div className="needle"></div>

                </div>
                <div className={"speed-values"}>
                <span className="min-speedo">0</span>
                    <span className={"max-speedo"}>10,000</span>
                </div>
                {/*<div className="text-center d-flex  mt-1 mb-0 p-0 text-bold text-white">*/}
                {/* */}
                {/*</div>*/}
                <div className="text-center w-100 d-flex justify-content-center  mt-1 mb-0 p-0 text-bold text-white">
                    <h4>3,455</h4>
                </div>
            </div>

            <div className="text-center d-none">
            <div className={`gauge-wrapper  ${props.blue?"speedo-blue":""} `}>
                <div className="gauge four rischio3">
                    <div className="slice-colors">
                        <div className="st slice-item"></div>
                        <div className="st slice-item"></div>
                        <div className="st slice-item"></div>
                        <div className="st slice-item"></div>
                    </div>
                    <div className="needle"></div>
                    <div className="gauge-center">
                        {/*<div className="label">324343</div>*/}
                        {/*<div className="number">324343</div>*/}
                    </div>
                    <div className={"speed-min"}>0</div>
                    <div className={"speed-max"}>10,000</div>
                </div>
                <div className="text-center mt-2 mb-0 p-0 text-bold text-white">
                    <h3>3,455</h3>
                </div>
            </div>


        </div>
            
            <style>{`
            .semi-donut {
 --percentage: 0;
 --fill: #ff0;
 width: 200px;
 height: 100px;
 position: relative;
 color: #fff;
 font-size: 22px;
 font-weight: 600;
 overflow: hidden;
 color: var(--fill);
 display: flex;
 align-items: flex-end;
 justify-content: center;
 box-sizing: border-box;
}
 .semi-donut:after {
 content: '';
 width: 200px;
 height: 200px;
 border: 50px solid;
 border-color: rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.15) var(--fill) var(--fill);
 position: absolute;
 border-radius: 50%;
 left: 0;
 top: 0;
 box-sizing: border-box;
 transform: rotate(calc(1deg * ( -45 + var(--percentage) * 1.8 )));
 animation: fillAnimation 2.5s ease-in;
}

 @keyframes fillAnimation {
 0% {
 transform: rotate(-45deg);
}
 50% {
 transform: rotate(135deg);
}
}

 
 .needle{
  width: 75px;
  height: 7px;
  background: #fff;
  border-bottom-left-radius: 100%!important;
  border-bottom-right-radius: 5px!important;
  border-top-left-radius: 100%!important;
  border-top-right-radius: 5px!important;
  position: absolute;
  bottom: 0px;
  left: 25px;
  transform-origin: 100% 4px;
  transform: rotate(calc(1deg * ( -45 + var(--percentage) * 1.8 )));; 
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
  z-index:911111;
}
 @-webkit-keyframes needleAnim {
   0% {transform: rotate(0);}
  100% {transform: rotate( 42deg); }
}
.needle {animation: needleAnim 1s 1 both; animation-delay: 1s; display:block;}

            `}</style>

            <style>{`
            .gauge-wrapper {
  display: inline-block;
  width: auto;
  margin: 0 auto;
  padding: 20px 15px 15px;
}

.gauge {
  background: #e7e7e7;
  // box-shadow: 0 -3px 6px 2px rgba(0, 0, 0, 0.50);
  width: 200px;
  height: 100px;
  border-radius: 100px 100px 0 0!important;
  position: relative;
  overflow: hidden;
}
.gauge.min-scaled {
  transform: scale(0.5);
}

.gauge-center {
  content: '';
  color: #fff;
  width: 60%;
  height: 60%;
  background: #15222E;
  border-radius: 100px 100px 0 0!important;
  position: absolute;
  // box-shadow: 0 -13px 15px -10px rgba(0, 0, 0, 0.28);
  right: 21%;
  bottom: 0;
  color: #fff;
  z-index:10;
}

.gauge-center .label, .gauge-center .number {display:block; width: 100%; text-align: center; border:0!important;}
.gauge-center .label {font-size:0.75em; opacity:0.6; margin:1.1em 0 0.3em 0;}
.gauge-center .number {font-size:1.2em;}

// .needle {
//   width: 80px;
//   height: 7px;
//   background: #15222E;
//   border-bottom-left-radius: 100%!important;
//   border-bottom-right-radius: 5px!important;
//   border-top-left-radius: 100%!important;
//   border-top-right-radius: 5px!important;
//   position: absolute;
//   bottom: -2px;
//   left: 20px;
//   transform-origin: 100% 4px;
//   transform: rotate(0deg);
//   box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
//   display:none;
//   z-index:9;
// }

// .four.rischio1 .needle {animation: fourspeed1 2s 1 both; animation-delay: 1s; display:block;}
// .four.rischio2 .needle {animation: fourspeed2 2s 1 both; animation-delay: 1s; display:block;}
// .four.rischio3 .needle {animation: fourspeed3 2s 1 both; animation-delay: 1s; display:block;}
// .four.rischio4 .needle {animation: fourspeed4 2s 1 both; animation-delay: 1s; display:block;}

.slice-colors {height:100%;}

.slice-colors .st {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border: 50px solid transparent;  
}


.four .slice-colors .st.slice-item:nth-child(2) {
  border-top: 50px #f1c40f solid;
  border-right: 50px #f1c40f solid;
  background-color:#1eaa59;
}

.four .slice-colors .st.slice-item:nth-child(4) {
  left:50%;
  border-bottom: 50px #E84C3D solid;
  border-right: 50px #E84C3D solid;
  background-color:#e67e22;
}


@-webkit-keyframes fourspeed1 {
 0% {transform: rotate(0);}
  100% {transform: rotate(16deg);}
}

@-webkit-keyframes fourspeed2 {
 0% {transform: rotate(0);}
  100% {transform: rotate(65deg);}
}

@-webkit-keyframes fourspeed3 {
0% {transform: rotate(0);}
  100% {transform: rotate(115deg);}
}

@-webkit-keyframes fourspeed4 {
0% {transform: rotate(0);}
  100% {transform: rotate(164deg);}
}
            `}</style>
        </div>
    )
}