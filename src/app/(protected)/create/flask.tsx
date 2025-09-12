import React, { useEffect, useRef } from 'react';

interface AnimatedFlaskProps {
  className?: string;
  width?: number;
  height?: number;
}

const AnimatedFlask: React.FC<AnimatedFlaskProps> = ({ 
  className = "", 
  width = 400, 
  height = 400 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Load GSAP dynamically
    const loadGSAP = async () => {
      // Check if GSAP is already loaded
      if (typeof window !== 'undefined' && !(window as any).TweenMax) {
        // Create script element for GSAP
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js';
        script.async = true;
        
        // Wait for script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Initialize animations once GSAP is loaded
      if (svgRef.current && (window as any).TweenMax) {
        const TweenMax = (window as any).TweenMax;
        const TimelineMax = (window as any).TimelineMax;
        const Power2 = (window as any).Power2;
        const Power0 = (window as any).Power0;
        const Linear = (window as any).Linear;

        // Set SVG visible
        TweenMax.set(svgRef.current, { visibility: "visible" });

        // Bubble animation - exact from your GSAP code
        TweenMax.staggerTo('#bubble-group circle', 4, {
          attr: {
            cy: 200
          },
          ease: Power2.easeIn,
          repeat: -1
        }, 0.6);

        const speed = 3.5;

        // Front liquid animations
        const tlFront1 = new TimelineMax({ repeat: -1 });
        tlFront1.to("#front-1", speed, { morphSVG: "#front-2", ease: Power0.easeNone })
          .to("#front-1", speed, { morphSVG: "#front-1", ease: Power0.easeNone });

        const tlFront2 = new TimelineMax({ repeat: -1 });
        tlFront2.to("#front-3", speed, { morphSVG: "#front-4", ease: Power0.easeNone })
          .to("#front-3", speed, { morphSVG: "#front-3", ease: Power0.easeNone });

        const tlFront3 = new TimelineMax({ repeat: -1 });
        tlFront3.to("#front-5", speed, { morphSVG: "#front-6", ease: Power0.easeNone })
          .to("#front-5", speed, { morphSVG: "#front-5", ease: Power0.easeNone });

        // Back liquid animation
        const tlBack = new TimelineMax({ repeat: -1 });
        tlBack.to("#back-1", speed, { morphSVG: "#back-2", ease: Power0.easeNone })
          .to("#back-1", speed, { morphSVG: "#back-1", ease: Power0.easeNone });

        // Steam bubble animation
        const bubbles = document.getElementsByClassName("steam-bubble");
        const tlSteam = new TimelineMax({ repeat: -1 });
        
        function animateBubbles() {
          for (let i = 0; i < bubbles.length; i++) {
            const b = bubbles[i];
            const tl = new TimelineMax({ repeat: -1 });
            tl
              .to(b, 1, {
                attr: {
                  r: "+=7"
                },
                ease: Linear.easeNone
              })
              .to(b, 1, {
                attr: {
                  r: "-=7"
                },
                ease: Linear.easeNone
              });
            tlSteam.add(tl, i / 2);
          }
        }
        animateBubbles();
      }
    };

    loadGSAP().catch(console.error);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        ref={svgRef}
        width={width} 
        height={height} 
        viewBox="0 0 446.5 412.2" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
        style={{ visibility: 'hidden' }}
      >
        <style>
          {`
            .st0{opacity:0.5;fill:#FECE65;}
            .st1{fill:none;stroke:#484C7C;stroke-width:8;stroke-linecap:round;stroke-miterlimit:10;}
            .st2{fill:#FF6600; opacity:0.9;}
            .st3{fill:#ffffff;}
            .st4{opacity:0.76;}
            .st5{fill:#F7FCFF;}
            .st6{fill:none;stroke:#484C7C;stroke-width:8;stroke-miterlimit:10;}
            .st7{fill:url(#SVGID_1_);}
            .st8{fill:#1D71B8;}
            .st9{fill:#E6007E;}
            .st10{fill:url(#SVGID_2_);}
            .st11{opacity:0.2;fill:#404C6A;}
            .st12{opacity:0.36;fill:#FFFFFF;}
            .st13{fill: #FECB00;}
            #bubble-group circle {
              fill: #FF6600 !important;
              opacity: 0.95 !important;
              stroke: #FF4400;
              stroke-width: 0.5;
            }
          `}
        </style>
        
        <defs>
          <mask id="liquid-mask">
            <path fill="#ffffff" id="front-1" d="M142.1,269.7c13.3-7.1,24.4-1.7,31.8,1.3c15.1,6,39.1,19.3,57.8,30.2c17.3,10.1,38.7,11.5,57.8,5.9c12.1-3.6,19.5-14.2,21.6-15.7c1.3-0.9,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,135.7,279.1,142.1,269.7z"/>
            <path fill="#ffffff" id="front-2" d="M135.7,279.1c5.9,12.6,8.7,15,13.4,17.9c7.1,4.5,27.5,7.6,50.8,3.3c34-6.2,67.3-22.8,87.7-20.8c16.3,1.6,17.7,3.3,23.5,11.8c3.1,4.6,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,129.2,288.6,135.7,279.1z"/>
            
            <g id="bubble-group">
              <circle fill="#4A0E4E" cx="170.9" cy="383.8" r="12"/>
              <circle fill="#4A0E4E" cx="200.6" cy="380.4" r="8"/>
              <circle fill="#4A0E4E" cx="232.6" cy="385.9" r="15"/>
              <circle fill="#4A0E4E" cx="263.8" cy="383.8" r="10"/>
              <circle fill="#4A0E4E" cx="248.9" cy="380.4" r="9"/>
              <circle fill="#4A0E4E" cx="149.1" cy="381.3" r="11"/>
              <circle fill="#4A0E4E" cx="187.7" cy="396.2" r="13"/>
              <circle fill="#4A0E4E" cx="278.8" cy="382.7" r="10"/>
              <circle fill="#4A0E4E" cx="300.5" cy="382.7" r="8"/>
              <circle fill="#4A0E4E" cx="218.4" cy="403.9" r="12"/>
              <circle fill="#4A0E4E" cx="259.3" cy="405.3" r="9"/>
              <circle fill="#4A0E4E" cx="132.8" cy="384.6" r="14"/>
              <circle fill="#4A0E4E" cx="162.1" cy="403.9" r="11"/>
              <circle fill="#4A0E4E" cx="209.8" cy="391.2" r="10"/>
              <circle fill="#4A0E4E" cx="282.4" cy="404.2" r="16"/>
              <circle fill="#4A0E4E" cx="315.5" cy="379.3" r="6"/>
              <circle fill="#4A0E4E" cx="155.3" cy="392.4" r="7"/>
              <circle fill="#4A0E4E" cx="251.8" cy="393.2" r="8"/>
              <circle fill="#4A0E4E" cx="175" cy="390" r="9"/>
              <circle fill="#4A0E4E" cx="225" cy="385" r="11"/>
              <circle fill="#4A0E4E" cx="195" cy="395" r="10"/>
              <circle fill="#4A0E4E" cx="245" cy="390" r="12"/>
              <circle fill="#4A0E4E" cx="165" cy="385" r="8"/>
              <circle fill="#4A0E4E" cx="285" cy="385" r="9"/>
            </g>
          </mask>
          
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="221.8502" y1="365.0522" x2="221.8502" y2="262.6526">
            <stop offset="0" stopColor="#FFEF26"/>
            <stop offset="5.948725e-02" stopColor="#FFE000"/>
            <stop offset="0.1303" stopColor="#FFD300"/>
            <stop offset="0.2032" stopColor="#FECB00"/>
            <stop offset="0.2809" stopColor="#FDC800"/>
            <stop offset="0.6685" stopColor="#F18F34"/>
            <stop offset="0.8876" stopColor="#E95F32"/>
            <stop offset="1" stopColor="#E61575"/>
          </linearGradient>
          
          <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="219.0096" y1="266.1981" x2="219.0096" y2="367.0309">
            <stop offset="0" stopColor="#FFEF26"/>
            <stop offset="5.948725e-02" stopColor="#FFE000"/>
            <stop offset="0.1303" stopColor="#FFD300"/>
            <stop offset="0.2032" stopColor="#FECB00"/>
            <stop offset="0.2809" stopColor="#FDC800"/>
            <stop offset="0.6685" stopColor="#F18F34"/>
            <stop offset="0.8876" stopColor="#E95F32"/>
            <stop offset="1" stopColor="#E61575"/>
          </linearGradient>
        </defs>

        <path className="st0" d="M67.3,369.6C28.2,330.4,3.9,276.3,3.9,216.5C3.9,96.9,100.9,0,220.4,0s216.5,96.9,216.5,216.5c0,58.6-23.2,111.7-61,150.7"/>
        <line className="st1" x1="4" y1="369.6" x2="442.5" y2="369.6"/>

        <g id="steam-bubbles" className="st3">
          <circle className="steam-bubble" cx="212.8" cy="100.8" r="19.8"/>
          <circle className="steam-bubble" cx="237.7" cy="100.8" r="24.6"/>
          <circle className="steam-bubble" cx="192.9" cy="100.8" r="20.2"/>
          <circle className="steam-bubble" cx="226.9" cy="85.1" r="24.2"/>
          <circle className="steam-bubble" cx="203.5" cy="71.4" r="19.8"/>
          <circle className="steam-bubble" cx="246.8" cy="76.2" r="10.8"/>
          <circle className="steam-bubble" cx="183" cy="83.4" r="12.1"/>
        </g>

        <g>
          <g>
            <g className="st4">
              <g>
                <path className="st5" d="M243.8,138.5c0,7.2,0,32,2,39c11,38.9,88.1,147,88.5,147.8c9.8,18.8-3.9,41.7-25.4,41.7H129.1c-21.2,0-34.8-22.2-25.8-40.8c0.5-1.1,78.7-109.7,88.9-148.7c1.8-7,1-39,1-39H243.8z"/>
                <path className="st6" d="M243.8,138.5c0,7.2,0,32,2,39c11,38.9,88.1,147,88.5,147.8c9.8,18.8-3.9,41.7-25.4,41.7H129.1c-21.2,0-34.8-22.2-25.8-40.8c0.5-1.1,78.7-109.7,88.9-148.7c1.8-7,1-39,1-39H243.8z"/>
              </g>
              <path className="st5" d="M242.4,138.1h-50.5c-6,0-11-4.9-11-11v-11.8c0-6.1,5-11,11-11h50.5c6.1,0,11,4.9,11,11v11.8C253.4,133.2,248.4,138.1,242.4,138.1z"/>
            </g>
            
            <g id="backLiquid">
              <path id="back-1" className="st7" d="M133.7,282.1c5.9,12.6,10.7,16,15.4,18.9c7.1,4.5,28.5,5.6,51.8,1.3c34-6.2,66.3-29.8,86.7-27.8c16.3,1.6,17.7,8.3,23.5,16.8c3.1,4.6,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,127.2,291.6,133.7,282.1z"/>
              <path className="st7" id="back-2" d="M142.1,269.7c16.9,3.5,24.4,5.7,31.8,8.3c15.4,5.3,37.3,16.4,57.8,23.2c20.2,6.7,37,7.4,56.1,1.7c12.1-3.6,21.2-10.1,23.3-11.5c1.3-0.9,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,135.7,279.1,142.1,269.7z"/>
            </g>
            
            <g id="front-liquid-copy">
              <path id="front-3" className="st13" d="M142.1,269.7c13.3-7.1,24.4-1.7,31.8,1.3c15.1,6,39.1,19.3,57.8,30.2c17.3,10.1,38.7,11.5,57.8,5.9c12.1-3.6,19.5-14.2,21.6-15.7c1.3-0.9,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,135.7,279.1,142.1,269.7z"/>
              <path id="front-4" className="st10" d="M135.7,279.1c5.9,12.6,8.7,15,13.4,17.9c7.1,4.5,27.5,7.6,50.8,3.3c34-6.2,67.3-22.8,87.7-20.8c16.3,1.6,17.7,3.3,23.5,11.8c3.1,4.6,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,129.2,288.6,135.7,279.1z"/>
            </g>
            
            <g id="masked-liquid" mask="url(#liquid-mask)">
              <path id="front-5" className="st10" d="M142.1,269.7c13.3-7.1,24.4-1.7,31.8,1.3c15.1,6,39.1,19.3,57.8,30.2c17.3,10.1,38.7,11.5,57.8,5.9c12.1-3.6,19.5-14.2,21.6-15.7c1.3-0.9,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,135.7,279.1,142.1,269.7z"/>
              <path id="front-6" className="st10" d="M135.7,279.1c5.9,12.6,8.7,15,13.4,17.9c7.1,4.5,27.5,7.6,50.8,3.3c34-6.2,67.3-22.8,87.7-20.8c16.3,1.6,17.7,3.3,23.5,11.8c3.1,4.6,22.5,32.8,22.5,32.8c11,19.1-2.8,42.9-24.8,42.9H129.1c-22,0-35.8-23.8-24.8-42.9C104.4,324.2,129.2,288.6,135.7,279.1z"/>
            </g>

            <g>
              <path className="st6" d="M243.8,138.5c0,7.2,0,32,2,39c10.9,38.8,88,146.9,88.5,147.8c9.8,18.8-3.9,41.7-25.4,41.7H129.1c-21.2,0-34.8-22.2-25.8-40.8c0.5-1.1,78.7-109.7,88.9-148.7c1.8-7,1-39,1-39H243.8z"/>
              <path className="st6" d="M242.4,138.1h-50.5c-6,0-11-4.9-11-11v-11.8c0-6.1,5-11,11-11h50.5c6.1,0,11,4.9,11,11v11.8C253.4,133.2,248.4,138.1,242.4,138.1z"/>
            </g>
          </g>
          
          <rect x="197.2" y="142.4" className="st11" width="42.9" height="4.7"/>
          <path className="st12" d="M216.2,216.8c-3.2-0.9-9.3-0.7-12.3-0.1c-4.2,0.8-8.6,6.4-11.9,11.1c-7.7,10.8-51.8,76.8-55.1,88.7c-1.6,5.8,5.2,13.7,11.3,13.7h42c6.1,0,11.1-7.1,13.2-13.2c0,0,18.4-64.4,21.4-87.4C225.7,223.5,223.3,218.8,216.2,216.8z"/>
          <path className="st3" d="M209.8,133.8h-8.7c-1.6,0-2.9-1.3-2.9-2.9v-19.1c0-1.6,1.3-2.9,2.9-2.9h8.7c1.6,0,2.9,1.3,2.9,2.9v19.1C212.7,132.5,211.4,133.8,209.8,133.8z"/>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedFlask;