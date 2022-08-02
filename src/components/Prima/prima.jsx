import { useEffect, useState, useRef } from "react";
import { PitchDetector } from "pitchy";
import { Link } from "react-router-dom";
import { Waves } from "../svg/waves";
import './style.css';
import { Dock } from "../Dock/dock";
import { BackWaves } from "../BackWaves/back-waves";


let position = "30%";
let global = 100;
let lineColorClass = "";

let minClarityPercent = 95;
let [minPitch, maxPitch] = [60, 10000];
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

let boolzhan = true;

export const Prima = () => {

   const [pitch, setPitch] = useState(0);
   const [clarity, setClarity] = useState(0);

   const [note, setNote] = useState("G");

   const [diffG, setDiffG] = useState(0);
   const [diffD, setDiffD] = useState(0);
   const [diffE, setDiffE] = useState(0);
   const [diffA, setDiffA] = useState(0);

   
   function updatePitch(analyserNode, detector, input, sampleRate) {
      analyserNode.getFloatTimeDomainData(input);
      const [pitch, clarity] = detector.findPitch(input, sampleRate);

      const matchesConditions = (pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent);
      
      if (matchesConditions) {
         const frq = Math.round(pitch * 10) / 10;
         // console.log((Math.abs(frq - global)));


            
            
         if ((note === "E") || (note === "A")){
            console.log("EEE")
            setPitch(frq);

            setDiffE(frq - 659.2551);
            setDiffA(frq - 440);
            setClarity(Math.round(clarity * 100));

         } else if (Math.abs(frq - global) < 200) {
            setPitch(frq);
            setDiffG(frq - 195.9977);
            setDiffD(frq - 293.6648);
            
            
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
   let aColorClass = (note === "A") ? " green" : "";
   let eColorClass = (note === "E") ? " green" : "";


   useEffect(() => {
      if (note == "G" && diffG) {
         // console.log("in G")
         // console.log(diffG)
         const absDiff = Math.abs(diffG);
         // console.log("G[ " + absDiff + " ]")
         if (absDiff <= 0.2) {

            position = 'calc(50% - 3px)';
            if (boolzhan) {playAudio();}

         } else if (diffG < -0.2 && diffG > nthrshld) {
            console.log("in G near LESS")
            position = `calc(50% - 3px - 5px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffG > 0.2 && diffG < threshold) {
            console.log("in G near MORE")
            position = `calc(50% - 3px + 5px + ${ parseInt(absDiff, 0) }px)`;
         } else if (diffG <= nthrshld) {
            console.log("in G LESS")
            position = `calc(50% - 3px - 10px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffG >= threshold) {
            console.log("in G MORE")
            position = `calc(50% - 3px + 10px + ${ parseInt(absDiff, 0) }px)`;
         }
      } 

      if (note == "D" && diffD) {
         // console.log("in D")
         // console.log(diffD)
         const absDiff = Math.abs(diffD);
         // console.log("D[ " + absDiff + " ]")
         if (absDiff <= 0.2) {
            
            position = 'calc(50% - 3px)';
            if (boolzhan) {playAudio();}

         } else if (diffD < -0.2 && diffD > nthrshld) {
            console.log("in D near LESS")
            position = `calc(50% - 3px - 2px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffD > 0.2 && diffD < threshold) {
            console.log("in D near MORE")
            position = `calc(50% - 3px + 2px + ${ parseInt(absDiff, 0) }px)`;
         }else if (diffD <= nthrshld) {
            console.log("in D LESS")
            position = `calc(50% - 3px - 8px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffD >= threshold) {
            console.log("in D MORE")
            position = `calc(50% - 3px + 8px + ${ parseInt(absDiff, 0) }px)`;
         }
      }

      if (note == "A" && diffA) {
         // console.log("in D")
         // console.log(diffD)
         const absDiff = Math.abs(diffA);
         // console.log("D[ " + absDiff + " ]")
         if (absDiff <= 0.2) {

            position = 'calc(50% - 3px)';
            if (boolzhan) {playAudio();}

         } else if (diffA < -0.2 && diffA > nthrshld) {
         
            position = `calc(50% - 3px - 2px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffA > 0.2 && diffA < threshold) {
         
            position = `calc(50% - 3px + 2px + ${ parseInt(absDiff, 0) }px)`;
         }else if (diffA <= nthrshld) {
         
            position = `calc(50% - 3px - 8px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffA >= threshold) {
            
            position = `calc(50% - 3px + 8px + ${ parseInt(absDiff, 0) }px)`;
         }
      }

      if (note == "E" && diffE) {
         // console.log("in G")
         // console.log(diffG)
         const absDiff = Math.abs(diffE);
         // console.log("G[ " + absDiff + " ]")
         if (absDiff <= 0.2) {
   
            position = 'calc(50% - 3px)';
            if (boolzhan) {playAudio();}

         } else if (diffE < -0.2 && diffE > nthrshld) {
   
            position = `calc(50% - 3px - 5px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffE > 0.2 && diffE < threshold) {
         
            position = `calc(50% - 3px + 5px + ${ parseInt(absDiff, 0) }px)`;
         } else if (diffE <= nthrshld) {
      
            position = `calc(50% - 3px - 10px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffE >= threshold) {
      
            position = `calc(50% - 3px + 10px + ${ parseInt(absDiff, 0) }px)`;
         }
      } 
   }, [note, diffG, diffD, diffA, diffE]);

   const pointerRef = useRef();
   const originRef = useRef();

   

   const isInRange = () => {
      if (pointerRef.current && originRef.current) {
         const pointer = pointerRef.current.getBoundingClientRect();
         const origin = originRef.current.getBoundingClientRect();

         return (
            ((pointer.left + 1.5) < origin.left) && ((pointer.right - 1.5) > origin.right)
         )
      }
      return false;
   }


   boolzhan = isInRange();


   return (
      <>
         <Dock/>

         <div className="container pr">
            <BackWaves/>
            <div className="area">
               <div ref={originRef} className={`origin ${ boolzhan && ' theAnswer'}`}></div>
               <div ref={pointerRef} className="pointer" style={{ left: position }}></div>
            </div>
            <div className="main">
               {/* <div className="left"> */}
               <div className="inmain-prima">
                  <button
                     className={`btn e-note-prima${eColorClass}`} 
                     onClick={() => {
                        setNote("E");
                     }}
                  >ми</button>

                  <button
                     className={`btn a-note-prima${aColorClass}`} 
                     onClick={() => {
                        setNote("A");
                     }}
                  >ля</button>

                  <button
                     className={`btn d-note-prima${dColorClass}`} 
                     onClick={() => {
                        setNote("D");
                     }}
                  >ре</button>

               
                  <button
                     className={`btn g-note-prima${gColorClass}`} 
                     onClick={() => {
                        setNote("G");
                     }}
                  >соль</button>
                  <div className="center">
                     <img className="pic" src="prima0.png" alt="dombyra pic" />
                  </div>
               </div>
               
               
            </div>
         </div>
         <div className="numbers">
            <div className="pitch">{pitch}</div>
            <div className="clarity">{clarity}</div>
         </div>
      </>
      
   );
};
