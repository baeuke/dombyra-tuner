import { PitchDetector } from "pitchy";
import { useEffect, useState, useRef } from "react";
import './style.css';

import { Dock } from "../Dock/dock"
import { BackWaves } from "../BackWaves/back-waves";

// import { useWindowSize } from "../../hooks/useWindowsSize"


// let position = "30%";

let global = 100;


let minClarityPercent = 95;
let [minPitch, maxPitch] = [60, 10000];
const absThr = 0.5;
const nAbsThr = -1*absThr;
const threshold = 1;
const nthrshld = -1*threshold;

const audio = new Audio("tuner.mp3");

const playAudio = async () => {
   try {
      await audio.play();
      console.log("Playing audio");
   } catch (err) {
      console.log("Failed to play, error: " + err);
   }
}

let c = 0;
let boolzhan = true;


export const Dombyra = () => {
   // const {width, height} = useWindowSize();

   // console.log(height)
   // const [pitch, clairty, ] = useInstrument(...);
   const [pitch, setPitch] = useState(0);
   const [clarity, setClarity] = useState(0);

   const [note, setNote] = useState("G");

   const [diffG, setDiffG] = useState(0);
   const [diffD, setDiffD] = useState(0);
   const[ position, setPosition] = useState("calc(50% - 3px)");

   let windowInnerWidth = 0;

   const handleResize = () => {
      const currentWinInnerWidth = window.innerWidth;
      if (windowInnerWidth === 0 || currentWinInnerWidth !== windowInnerWidth) {
         windowInnerWidth = currentWinInnerWidth;
         const vh = window.innerHeight * 0.01;
         document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
   }

   handleResize();


   const updatePitch = (analyserNode, detector, input, sampleRate) => {
      analyserNode.getFloatTimeDomainData(input);
      const [pitch, clarity] = detector.findPitch(input, sampleRate);

      const matchesConditions = (pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent);
      
      if (matchesConditions) {
         const frq = Math.round(pitch * 10) / 10;
         // console.log((Math.abs(frq - global)));

         if (Math.abs(frq - global) < 200) {
            
            setPitch(frq);
            setDiffG(frq - 195.9977);
            setDiffD(frq - 146.8324);
            setClarity(Math.round(clarity * 100));
            global = frq;
         } else {
            // console.log("difference is too much");
         }
      }

      // setTimeout(() => updatePitch(analyserNode, detector, input, sampleRate), 150);
      // return () => {
         // console.log("RETURNED")
         // clearTimeout(interval)
      // }
   }

   
   
   useEffect(() => {
      // const audioContext = new window.AudioContext();
      // const analyserNode = audioContext.createAnalyser();
      let interval;

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
         const audioContext = new window.AudioContext();
         const analyserNode = audioContext.createAnalyser();
         audioContext.createMediaStreamSource(stream).connect(analyserNode);
         const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
         const input = new Float32Array(detector.inputLength);

         // global = detector.findPitch(input, audioContext.sampleRate)[0];

         interval = setInterval(() => { 
            updatePitch(analyserNode, detector, input, audioContext.sampleRate)
         }, 150);
      });

      return () => {
         console.log("RETURNED");
         clearTimeout(interval);
      }
      
   }, []);
   

   let dColorClass = (note === "D") ? " green" : "";
   let gColorClass = (note === "G") ? " green" : "";

   

   useEffect(() => {
      
      if (note == "G" && diffG) {
         // console.log("in G")
         // console.log(diffG)
         const absDiff = Math.abs(diffG);
         // console.log("G[ " + absDiff + " ]")
         if (absDiff <= absThr) {
            // console.log("in G exact")
            setPosition('calc(50% - 3px)');

            
            if (boolzhan) {playAudio();}

         } else if (diffG < nAbsThr && diffG > nthrshld) {
            // console.log("in G near LESS")
            setPosition(`calc(50% - 3px - 5px - ${ parseInt(absDiff, 0) }px)`);
         } else if (diffG > absThr && diffG < threshold) {
            // console.log("in G near MORE")
            setPosition(`calc(50% - 3px + 5px + ${ parseInt(absDiff, 0) }px)`);
         } else if (diffG <= nthrshld) {
            // console.log("in G LESS")
            setPosition(`calc(50% - 3px - 10px - ${ parseInt(absDiff, 0) }px)`);
         } else if (diffG >= threshold) {
            // console.log("in G MORE")
            setPosition(`calc(50% - 3px + 10px + ${ parseInt(absDiff, 0) }px)`);
         }
      } 
      if (note == "D" && diffD) {
         // console.log("in D")
         // console.log(diffD)
         const absDiff = Math.abs(diffD);
         // console.log("D[ " + absDiff + " ]")
         if (absDiff <= absThr) {
            // console.log("in D exact")
            setPosition('calc(50% - 3px)');
            // changeLineColor();
            if (boolzhan) {playAudio();}
         
            // clearTimeout(timer);
            
            // lineColorClass = "";
         } else if (diffD < nAbsThr && diffD > nthrshld) {
            // console.log("in D near LESS")
            setPosition(`calc(50% - 3px - 5px - ${ parseInt(absDiff, 0) }px)`);
         } else if (diffD > absThr && diffD < threshold) {
            // console.log("in D near MORE")
            setPosition(`calc(50% - 3px + 5px + ${ parseInt(absDiff, 0) }px)`);
         }else if (diffD <= nthrshld) {
            // console.log("in D LESS")
            setPosition(`calc(50% - 3px - 10px - ${ parseInt(absDiff, 0) }px)`);
         } else if (diffD >= threshold) {
            // console.log("in D MORE")
            setPosition(`calc(50% - 3px + 10px + ${ parseInt(absDiff, 0) }px)`);
         }
         
      }

   }, [note, diffG, diffD]);


   const pointerRef = useRef();
   const originRef = useRef();

   

   const isInRange = () => {
      if (pointerRef.current && originRef.current) {
         const pointer = pointerRef.current.getBoundingClientRect();
         const origin = originRef.current.getBoundingClientRect();

         // return ((pointer.left + 3) == (origin.left + 1));

         return (
            ((pointer.left + 1.5) < origin.left) && ((pointer.right - 1.5) > origin.right)
         )

         // return (
         //    (pointer.right - 2) >= origin.left && (pointer.left + 2) <= origin.right
         // )
         // return !(
         //    pointer.top > origin.bottom ||
         //    pointer.right < origin.left ||
         //    pointer.bottom < origin.top ||
         //    pointer.left > origin.right)

      }
      return false;
   }

   boolzhan = isInRange();
   console.log({position});


   return (
      <>
         <div className="container" id="asdlaldf">
            <BackWaves/>
            <Dock/>
            <div className="area">
               <div ref={originRef} className={`origin ${ boolzhan && ' theAnswer'}`}></div>
               <div ref={pointerRef} className="pointer" style={{ left: position }}></div>
            </div>
            <div className="parent-dombyra">
               <button
                  className={`btn d-note${dColorClass}`} 
                  onClick={() => {
                     setNote("D");
                  }}
               >d</button>
               {/* ре */}
               <button
                  className={`btn g-note${gColorClass}`} 
                  onClick={() => {
                     setNote("G");
                  }}
               >g</button>
               {/* соль */}
               <img className="img-dombyra" src="dombyra.png" alt="img dombyra" />
            </div>
         </div>
         <div className="numbers">
            <div className="pitch">{pitch}</div>
            <div className="clarity">{clarity}</div>
         </div>
      </>
   );
};