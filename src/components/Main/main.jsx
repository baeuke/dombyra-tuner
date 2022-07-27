import { PitchDetector } from "pitchy";
import { useEffect, useState } from "react";
// import './style.css';
import { Waves } from "../svg/waves";
import { Dock } from "../Dock/dock"
import { Qobyz } from "../Qyl/qobyz";
import { Prima } from "../Prima/prima";


let position = "30%";
let global = 100;


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

const instruments = [
   {
      name: dombyra,
      notes: ['G', 'D']
   },

   {
      name: qobyz,
      notes: ['A', 'D']
   },

   {
      name: prima,
      notes: ['G', 'PrimaD', 'PrimaA', 'E']
   }

]


export const Loader = () => {

   const [diffD, setDiffD] = useState(0);
   const [diffG, setDiffG] = useState(0);
   const [diffA, setDiffA] = useState(0);
   const [diffPrimaD, setDiffPrimaD] = useState(0);
   const [diffPrimaA, setDiffPrimaA] = useState(0);
   const [diffE, setDiffE] = useState(0);

   function updatePitch(analyserNode, detector, input, sampleRate) {
      analyserNode.getFloatTimeDomainData(input);
      const [pitch, clarity] = detector.findPitch(input, sampleRate);

      const matchesConditions = (pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent);
      
      if (matchesConditions) {
         const frq = Math.round(pitch * 10) / 10;
         // console.log((Math.abs(frq - global)));

         if (Math.abs(frq - global) < 200) {
            
            setPitch(frq);
            setDiffD(frq - 146.8324); // dombyra, qyl
            setDiffG(frq - 195.9977); // dombyra, prima
            setDiffA(frq - 220); // qyl
            setDiffPrimaD(frq - 293.6648); // prima
            setDiffPrimaA(frq - 440); // prima
            setDiffE(frq - 659.2551); // prima
            setClarity(Math.round(clarity * 100));
            global = frq;
         } else {
            console.log("difference is too much");
         }
      }

      window.setTimeout(() => updatePitch(analyserNode, detector, input, sampleRate), 100);
   }


   useEffect(() => {
   
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



   useEffect(() => {
      instruments.map((inst) => (
         
      ))
      if (note == "G" && diffG) {
         // console.log("in G")
         // console.log(diffG)
         const absDiff = Math.abs(diffG);
         // console.log("G[ " + absDiff + " ]")
         if (absDiff <= 0.2) {
            console.log("in G exact")
            position = 'calc(50% - 3px)';
            changeLineColor();
            playAudio();
            lineColorClass = "";
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
            console.log("in D exact")
            position = 'calc(50% - 3px)';
            changeLineColor();
            playAudio();
            lineColorClass = "";
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

   }, [note, diffG, diffD]);

   return (
      <>
         <Dock />


         <div className="container">
            <div className="back">
               <Waves/>
            </div>
            <div className="area">
               <div className={`origin${lineColorClass}`}></div>
               <div className="pointer" style={{ left: position }}></div>
            </div>
            <div className="main">
               
               {/* <div className="left"> */}
               <div className="inmain">
                  <button
                     className={`btn d-note${dColorClass}`} 
                     onClick={() => {
                        setNote("D");
                     }}
                  >ре</button>
                  <button
                     className={`btn g-note${gColorClass}`} 
                     onClick={() => {
                        setNote("G");
                     }}
                  >соль</button>
                  <div className="center">
                     <img className="pic" src="dombyra0.png" alt="dombyra pic" />
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