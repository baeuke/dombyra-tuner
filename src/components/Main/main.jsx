import { PitchDetector } from "pitchy";
import { useEffect, useState } from "react";
// import './style.css';
import { Link } from "react-router-dom";
import { Waves } from "../svg/waves";


let position = "30%";
let global = 100;
// let lineColorClass = "";

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

// const changeLineColor = async () => {
   
//    try {
//       await setTimeout(() => {
//          lineColorClass = " theAnswer";
//       }, 2000);
//    } catch (err) {
//       console.log("error: " + err);
//    }
   
// }

export const Dombyra = () => {


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
};