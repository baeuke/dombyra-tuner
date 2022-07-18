import { PitchDetector } from "https://esm.sh/pitchy@4";
import { useEffect, useState } from "react";
import './style.css';

import {useWindowSize} from "../hooks/useWindowsSize"


let position = "30%";
let global = 100;

let minClarityPercent = 95;
let [minPitch, maxPitch] = [60, 10000];


const audio = new Audio("tuner.mp3");

const playAudio = async () => {
   try {
      await audio.play();
      console.log("Playing audio");
   } catch (err) {
      console.log("Failed to play, error: " + err);
   }
}

export const Dombyra = () => {

   const {width, height} = useWindowSize();

   console.log(height)
   const [pitch, setPitch] = useState(0);
   const [clarity, setClarity] = useState(0);

   const [note, setNote] = useState("G");

   const [diffG, setDiffG] = useState(0);
   const [diffD, setDiffD] = useState(0);

   
   function updatePitch(analyserNode, detector, input, sampleRate) {
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
            console.log("difference is too much");
         }
      }

      window.setTimeout(() => updatePitch(analyserNode, detector, input, sampleRate), 100);
   }

   useEffect(() => {
      // const audioContext = new window.AudioContext();
      // const analyserNode = audioContext.createAnalyser();
   
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
         const audioContext = new window.AudioContext();
         const analyserNode = audioContext.createAnalyser();
         audioContext.createMediaStreamSource(stream).connect(analyserNode);
         const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
         const input = new Float32Array(detector.inputLength);

         // global = detector.findPitch(input, audioContext.sampleRate)[0];

         updatePitch(analyserNode, detector, input, audioContext.sampleRate);
      });
   }, []);
   

   let dColorClass = (note === "D") ? " green" : "";
   let gColorClass = (note === "G") ? " green" : "";


   useEffect(() => {
      if (note == "G" && diffG) {
         console.log("in G")
         console.log(diffG)
         const absDiff = Math.abs(diffG);
         console.log("G[ " + absDiff + " ]")
         if (absDiff <= 0.2) {
            position = 'calc(50% - 3px)';
            playAudio();
         } else if (diffG <= -2) {
            position = `calc(50% - 3px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffG >= 2) {
            position = `calc(50% - 3px + ${ parseInt(absDiff, 0) }px)`;
         }
      } 
      if (note == "D" && diffD) {
         console.log("in D")
         console.log(diffD)
         const absDiff = Math.abs(diffD);
         console.log("D[ " + absDiff + " ]")
         if (absDiff <= 0.2) {
            position = 'calc(50% - 3px)';
            playAudio();
         } else if (diffD <= -2) {
            position = `calc(50% - 3px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffD >= 2) {
            position = `calc(50% - 3px + ${ parseInt(absDiff, 0) }px)`;
         }
      }

   }, [note, diffG, diffD]);

   return (
      <>
         <div className="container">
            <div className="area">
               <div className="origin"></div>
               <div className="pointer" style={{ left: position }}></div>
            </div>
            <div className="main">
               {/* <div className="left"> */}
               <div className="inmain">
                  <button
                     className={`d-note${dColorClass}`} 
                     onClick={() => {
                        setNote("D");
                     }}
                  >D</button>
                  <button
                     className={`g-note${gColorClass}`} 
                     onClick={() => {
                        setNote("G");
                     }}
                  >G</button>
                  <div className="center">
                     <img className="pic" src="dombyra0.png" alt="dombyra pic" />
                  </div>
               </div>
                  
               {/* </div> */}

               
                  
               {/* <div className="right"> */}
                  
               {/* </div> */}
               
            </div>
         </div>
         <div className="numbers">
            <div className="pitch">{pitch}</div>
            <div className="clarity">{clarity}</div>
         </div>
         

      </>
   );
};