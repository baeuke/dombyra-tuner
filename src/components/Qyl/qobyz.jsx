import { useEffect, useState, useRef } from "react";
import { PitchDetector } from "pitchy";
import './style.css';
import { Dock } from "../Dock/dock";
import { BackWaves } from "../BackWaves/back-waves";


let position = "calc(50% - 3px)";
let global = 100;
let lineColorClass = "";

let minClarityPercent = 95;
const absThr = 0.5;
const nAbsThr = -1*absThr;
const threshold = 1;
const nthrshld = -1*threshold;

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


let boolzhan = true;

export const Qobyz = () => {

   const [pitch, setPitch] = useState(0);
   const [clarity, setClarity] = useState(0);

   const [note, setNote] = useState("A");

   const [diffA, setDiffA] = useState(0);
   const [diffD, setDiffD] = useState(0);

   // const handleResize = () => {
   //    const vh = window.innerHeight * 0.01;
   //    document.documentElement.style.setProperty('--vh', `${vh}px`);
   // }

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
            setDiffA(frq - 220);
            setDiffD(frq - 146.8324);
            setClarity(Math.round(clarity * 100));
            global = frq;
         } else {
            // console.log("difference is too much");
         }
      }
   }

   // function updatePitch(analyserNode, detector, input, sampleRate) {
   //    analyserNode.getFloatTimeDomainData(input);
   //    const [pitch, clarity] = detector.findPitch(input, sampleRate);

   //    const matchesConditions = (pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent);
      
   //    if (matchesConditions) {
   //       const frq = Math.round(pitch * 10) / 10;
   //       // console.log((Math.abs(frq - global)));

   //       if (Math.abs(frq - global) < 200) {
            
   //          setPitch(frq);
   //          setDiffA(frq - 220);
   //          setDiffD(frq - 146.8324);
   //          setClarity(Math.round(clarity * 100));
   //          global = frq;
   //       } else {
   //          console.log("difference is too much");
   //       }
   //    }


   //    window.setTimeout(() => updatePitch(analyserNode, detector, input, sampleRate), 100);
   // }


   // useEffect(() => {
   //    // const audioContext = new window.AudioContext();
   //    // const analyserNode = audioContext.createAnalyser();
   
   //    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
   //       const audioContext = new window.AudioContext();
   //       const analyserNode = audioContext.createAnalyser();
   //       audioContext.createMediaStreamSource(stream).connect(analyserNode);
   //       const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
   //       const input = new Float32Array(detector.inputLength);

   //       // global = detector.findPitch(input, audioContext.sampleRate)[0];

   //       updatePitch(analyserNode, detector, input, audioContext.sampleRate);
   //    });
   // }, []);

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
   let aColorClass = (note === "A") ? " green" : "";


   useEffect(() => {
      if (note == "A" && diffA) {
         // console.log("in G")
         // console.log(diffA)
         const absDiff = Math.abs(diffA);
         // console.log("G[ " + absDiff + " ]")
         if (absDiff <= absThr) {

            position = 'calc(50% - 3px)';

            if (boolzhan) {playAudio();}
            
         } else if (diffA < nAbsThr && diffA > nthrshld) {
            console.log("in A near LESS")
            position = `calc(50% - 3px - 5px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffA > absThr && diffA < threshold) {
            console.log("in A near MORE")
            position = `calc(50% - 3px + 5px + ${ parseInt(absDiff, 0) }px)`;
         } else if (diffA <= nthrshld) {
            console.log("in A LESS")
            position = `calc(50% - 3px - 10px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffA >= threshold) {
            console.log("in A MORE")
            position = `calc(50% - 3px + 10px + ${ parseInt(absDiff, 0) }px)`;
         }
      } 
      if (note == "D" && diffD) {
         // console.log("in D")
         // console.log(diffD)
         const absDiff = Math.abs(diffD);
         // console.log("D[ " + absDiff + " ]")
         if (absDiff <= absThr) {

            position = 'calc(50% - 3px)';

            if (boolzhan) {playAudio();}

         } else if (diffD < nAbsThr && diffD > nthrshld) {
            console.log("in D near LESS")
            position = `calc(50% - 3px - 5px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffD > absThr && diffD < threshold) {
            console.log("in D near MORE")
            position = `calc(50% - 3px + 5px + ${ parseInt(absDiff, 0) }px)`;
         }else if (diffD <= nthrshld) {
            console.log("in D LESS")
            position = `calc(50% - 3px - 10px - ${ parseInt(absDiff, 0) }px)`;
         } else if (diffD >= threshold) {
            console.log("in D MORE")
            position = `calc(50% - 3px + 10px + ${ parseInt(absDiff, 0) }px)`;
         }
      }

   }, [note, diffA, diffD]);

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

         <div className="container">
            <BackWaves/>
            <div className="area">
               <div ref={originRef} className={`origin ${ boolzhan && ' theAnswer'}`}></div>
               <div ref={pointerRef} className="pointer" style={{ left: position }}></div>
            </div>
            <div className="parent-qobyz">
               <button
                  className={`btn d-note-qyl${dColorClass}`} 
                  onClick={() => {
                     setNote("D");
                  }}
               >d</button>
               {/* ре */}
               <button
                  className={`btn a-note-qyl${aColorClass}`} 
                  onClick={() => {
                     setNote("A");
                  }}
               >a</button>
               {/* ля */}
               <img className="img-qobyz" src="qyl1.png" alt="img qylqobyz" />
            </div>
         </div>
         <div className="numbers">
            <div className="pitch">{pitch}</div>
            <div className="clarity">{clarity}</div>
         </div>
      </>
      
   );
};
