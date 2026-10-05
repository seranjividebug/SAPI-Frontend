import { memo } from "react";

export const HomeBody = memo(function HomeBody() {
  return (
    <>
      <div className="field-cursor" aria-hidden="true"></div>
      
      <main id="main">
      
      <div className="act1" id="act1">
      
        <div className="field-stage" id="field-stage" aria-hidden="true">
      
          <div className="field-poster">
      <svg className="field-poster__svg" viewBox="-110 -110 220 220" aria-hidden="true" focusable="false">
      <path className="fp-grat" d="M9.4,99.3 L14.0,98.0 L18.5,96.0 L22.8,93.2 L27.0,89.7 L31.0,85.5 L34.7,80.7 L38.2,75.2 L41.3,69.2 L44.2,62.7 L46.7,55.7 L48.9,48.2 L50.7,40.4 L52.1,32.3 L53.1,23.9 L53.8,15.4 L54.0,6.7 L53.8,-2.0 L53.1,-10.7 L52.1,-19.3 L50.7,-27.8 L48.9,-36.0 L46.7,-44.0 L44.2,-51.7 L41.3,-58.9 L38.2,-65.7 L34.7,-72.0 L31.0,-77.8 L27.0,-83.0 L22.8,-87.5 L18.5,-91.4 L14.0,-94.5 L9.4,-97.0 L4.7,-98.7 L0.0,-99.7 M15.4,98.8 L23.0,97.2 L30.4,94.9 L37.5,91.9 L44.4,88.2 L50.9,83.8 L57.1,78.7 L62.8,73.1 L68.0,66.9 L72.8,60.2 L76.9,53.0 L80.5,45.5 L83.5,37.5 L85.8,29.3 L87.5,20.9 L88.5,12.3 L88.8,3.7 L88.5,-5.0 L87.5,-13.7 L85.8,-22.3 L83.5,-30.6 L80.5,-38.8 L76.9,-46.7 L72.8,-54.2 L68.0,-61.3 L62.8,-67.9 L57.1,-74.0 L50.9,-79.5 L44.4,-84.5 L37.5,-88.8 L30.4,-92.4 L23.0,-95.3 L15.4,-97.5 L7.7,-99.0 L0.0,-99.7 M81.8,-57.5 L76.5,-64.4 L70.6,-70.7 L64.2,-76.6 L57.3,-81.9 L49.9,-86.5 L42.2,-90.5 L34.2,-93.8 L25.9,-96.4 L17.3,-98.2 L8.7,-99.3 L0.0,-99.7 M7.3,-99.7 L0.0,-99.7 M4.0,-99.9 L0.0,-99.7  M-48.8,87.2 L-47.6,87.5 L-46.1,87.9 L-44.3,88.2 L-42.1,88.5 L-39.6,88.8 L-36.8,89.0 L-33.7,89.3 L-30.3,89.5 L-26.7,89.7 L-23.0,89.9 L-19.0,90.0 L-14.9,90.1 L-10.7,90.2 L-6.4,90.3 L-2.0,90.3 L2.3,90.3 L6.7,90.3 L11.0,90.2 L15.2,90.1 L19.3,90.0 L23.2,89.9 L27.0,89.7 L30.5,89.5 L33.9,89.3 L37.0,89.0 L39.8,88.7 L42.2,88.5 L44.4,88.2 L46.2,87.8 L47.7,87.5 L48.8,87.2 M-86.5,50.2 L-85.8,50.8 L-84.5,51.4 L-82.5,51.9 L-79.9,52.5 L-76.7,53.1 L-72.9,53.6 L-68.6,54.1 L-63.7,54.5 L-58.3,55.0 L-52.5,55.3 L-46.3,55.7 L-39.8,56.0 L-32.9,56.2 L-25.8,56.4 L-18.5,56.6 L-11.1,56.7 L-3.5,56.8 L4.0,56.8 L11.5,56.7 L19.0,56.6 L26.3,56.4 L33.4,56.2 L40.2,56.0 L46.7,55.7 L52.9,55.3 L58.7,54.9 L64.0,54.5 L68.9,54.0 L73.2,53.5 L76.9,53.0 L80.1,52.5 L82.7,51.9 L84.6,51.3 L85.9,50.7 M-99.9,0.4 L-99.1,1.1 L-97.6,1.8 L-95.3,2.4 L-92.3,3.1 L-88.6,3.7 L-84.2,4.3 L-79.2,4.9 L-73.5,5.4 L-67.4,5.9 L-60.7,6.4 L-53.5,6.8 L-45.9,7.1 L-38.0,7.4 L-29.8,7.6 L-21.4,7.8 L-12.8,7.9 L-4.1,8.0 L4.6,8.0 L13.3,7.9 L21.9,7.8 L30.3,7.6 L38.5,7.4 L46.4,7.1 L54.0,6.7 L61.1,6.3 L67.8,5.9 L73.9,5.4 L79.5,4.8 L84.5,4.3 L88.8,3.7 L92.5,3.0 L95.5,2.4 L97.7,1.7 L99.2,1.0 L99.9,0.3 M-86.5,-50.1 L-86.5,-49.5 L-85.8,-48.9 L-84.5,-48.3 L-82.5,-47.7 L-79.9,-47.2 L-76.7,-46.6 L-72.9,-46.1 L-68.6,-45.6 L-63.7,-45.2 L-58.3,-44.7 L-52.5,-44.3 L-46.3,-44.0 L-39.8,-43.7 L-32.9,-43.4 L-25.8,-43.2 L-18.5,-43.1 L-11.1,-43.0 L-3.5,-42.9 L4.0,-42.9 L11.5,-43.0 L19.0,-43.1 L26.3,-43.2 L33.4,-43.5 L40.2,-43.7 L46.7,-44.0 L52.9,-44.4 L58.7,-44.8 L64.0,-45.2 L68.9,-45.6 L73.2,-46.1 L76.9,-46.7 L80.1,-47.2 L82.7,-47.8 L84.6,-48.4 L85.9,-49.0 L86.5,-49.6 M-49.6,-86.8 L-50.0,-86.5 L-49.9,-86.1 L-49.6,-85.8 L-48.8,-85.4 L-47.6,-85.1 L-46.1,-84.8 L-44.3,-84.5 L-42.1,-84.2 L-39.6,-83.9 L-36.8,-83.6 L-33.7,-83.4 L-30.3,-83.1 L-26.7,-82.9 L-23.0,-82.8 L-19.0,-82.6 L-14.9,-82.5 L-10.7,-82.4 L-6.4,-82.4 L-2.0,-82.3 L2.3,-82.3 L6.7,-82.4 L11.0,-82.4 L15.2,-82.5 L19.3,-82.6 L23.2,-82.8 L27.0,-83.0 L30.5,-83.2 L33.9,-83.4 L37.0,-83.6 L39.8,-83.9 L42.2,-84.2 L44.4,-84.5 L46.2,-84.8 L47.7,-85.1 L48.8,-85.5 L49.6,-85.8 L50.0,-86.2 L49.9,-86.5 L49.6,-86.9" />
      <circle className="fp-rim" r="100" />
      <circle className="fp-dot" cx="91.2" cy="-40.1" r="3.8"><title>United Arab Emirates 58.9</title></circle>
      <circle className="fp-dot" cx="-70.2" cy="-61.3" r="3.7"><title>United States 57.5</title></circle>
      <circle className="fp-dot" cx="44.0" cy="-82.9" r="3.7"><title>Estonia 56.6</title></circle>
      <circle className="fp-dot" cx="39.5" cy="-67.9" r="3.7"><title>France 55.6</title></circle>
      <circle className="fp-dot" cx="89.2" cy="-39.0" r="3.6"><title>Saudi Arabia 54.2</title></circle>
      <circle className="fp-dot" cx="93.4" cy="-35.7" r="3.6"><title>Oman 52.7</title></circle>
      <circle className="fp-dot" cx="52.3" cy="-63.2" r="3.4"><title>Italy 48.8</title></circle>
      <circle className="fp-dot" cx="-53.5" cy="-81.5" r="3.4"><title>Canada 48.6</title></circle>
      <circle className="fp-dot" cx="29.5" cy="-76.6" r="3.4"><title>United Kingdom 48.3</title></circle>
      <circle className="fp-dot" cx="37.4" cy="-87.8" r="3.3"><title>Finland 46.4</title></circle>
      <circle className="fp-dot" cx="42.8" cy="-74.0" r="3.3"><title>Germany 46.3</title></circle>
      <circle className="fp-dot" cx="31.2" cy="-85.2" r="3.3"><title>Norway 44.8</title></circle>
      <circle className="fp-dot" cx="34.7" cy="-85.5" r="3.2"><title>Sweden 44.2</title></circle>
      <circle className="fp-dot" cx="89.9" cy="-41.8" r="3.2"><title>Qatar 44.0</title></circle>
      <circle className="fp-dot" cx="-52.0" cy="59.5" r="3.1"><title>Chile 41.5</title></circle>
      <circle className="fp-dot" cx="79.9" cy="-41.8" r="3.1"><title>Egypt 40.1</title></circle>
      <circle className="fp-dot" cx="44.8" cy="-68.5" r="3.1"><title>Switzerland 39.5</title></circle>
      <circle className="fp-dot" cx="-34.2" cy="24.7" r="3.0"><title>Brazil 38.0</title></circle>
      <circle className="fp-dot" cx="71.9" cy="-60.4" r="3.0"><title>Türkiye 37.4</title></circle>
      <circle className="fp-dot" cx="89.2" cy="-42.8" r="2.8"><title>Bahrain 32.2</title></circle>
      <circle className="fp-dot" cx="-43.1" cy="61.4" r="2.8"><title>Argentina 32.0</title></circle>
      <circle className="fp-dot" cx="-86.0" cy="-37.4" r="2.7"><title>Mexico 30.5</title></circle>
      <circle className="fp-dot" cx="38.0" cy="-46.8" r="2.7"><title>Morocco 30.2</title></circle>
      <circle className="fp-dot" cx="94.3" cy="1.8" r="2.7"><title>Kenya 29.1</title></circle>
      <circle className="fp-dot" cx="75.1" cy="-63.6" r="2.7"><title>Azerbaijan 28.8</title></circle>
      <circle className="fp-dot" cx="85.9" cy="-47.6" r="2.6"><title>Kuwait 27.4</title></circle>
      <circle className="fp-dot" cx="73.9" cy="52.1" r="2.6"><title>South Africa 26.1</title></circle>
      <circle className="fp-dot" cx="88.8" cy="7.1" r="2.6"><title>Rwanda 25.9</title></circle>
      <circle className="fp-dot" cx="30.2" cy="-17.6" r="2.6"><title>Senegal 25.9</title></circle>
      <circle className="fp-dot" cx="80.1" cy="-48.9" r="2.5"><title>Jordan 24.9</title></circle>
      <circle className="fp-dot" cx="65.2" cy="-9.8" r="2.5"><title>Nigeria 24.0</title></circle>
      <circle className="fp-dot" cx="52.0" cy="-7.0" r="2.5"><title>Ghana 23.5</title></circle>
      <circle className="fp-dot" cx="94.5" cy="-13.5" r="2.4"><title>Ethiopia 22.3</title></circle>
      <circle className="fp-dot" cx="-39.9" cy="46.2" r="2.3"><title>Paraguay 19.5</title></circle>
      <circle className="fp-dot" cx="81.3" cy="-53.0" r="2.2"><title>Iraq 16.9</title></circle>
      <circle className="fp-dot" cx="77.7" cy="-63.0" r="2.2"><title>Turkmenistan 14.9</title></circle>
      <circle className="fp-red" cx="-71.3" cy="-59.0" r=".9" />
      <circle className="fp-red" cx="43.0" cy="-84.3" r=".9" />
      <circle className="fp-red" cx="39.8" cy="-83.8" r=".9" />
      <circle className="fp-red" cx="49.0" cy="-80.9" r=".9" />
      <circle className="fp-red" cx="48.7" cy="-81.7" r=".9" />
      <circle className="fp-red" cx="95.1" cy="-34.8" r=".9" />
      <circle className="fp-red" cx="85.9" cy="-31.8" r=".9" />
      <circle className="fp-red" cx="95.6" cy="-33.4" r=".9" />
      <circle className="fp-red" cx="44.7" cy="-71.0" r=".9" />
      <circle className="fp-red" cx="33.4" cy="-89.9" r=".9" />
      <circle className="fp-red" cx="44.2" cy="-74.2" r=".9" />
      <circle className="fp-red" cx="33.5" cy="-88.1" r=".9" />
      <circle className="fp-red" cx="32.6" cy="-83.4" r=".9" />
      <circle className="fp-red" cx="28.2" cy="-77.5" r=".9" />
      <circle className="fp-red" cx="37.2" cy="-80.1" r=".9" />
      <circle className="fp-red" cx="-54.8" cy="56.2" r=".9" />
      <circle className="fp-red" cx="-53.6" cy="59.1" r=".9" />
      <circle className="fp-red" cx="-49.2" cy="60.7" r=".9" />
      <circle className="fp-red" cx="-54.0" cy="55.2" r=".9" />
      <circle className="fp-red" cx="-54.4" cy="65.0" r=".9" />
      <circle className="fp-red" cx="76.2" cy="-40.7" r=".9" />
      <circle className="fp-red" cx="81.8" cy="-48.5" r=".9" />
      <circle className="fp-red" cx="45.0" cy="-62.6" r=".9" />
      <circle className="fp-red" cx="-43.3" cy="23.2" r=".9" />
      <circle className="fp-red" cx="-34.7" cy="21.0" r=".9" />
      <circle className="fp-red" cx="-32.0" cy="24.4" r=".9" />
      <circle className="fp-red" cx="65.3" cy="-56.6" r=".9" />
      <circle className="fp-red" cx="74.9" cy="-56.1" r=".9" />
      <circle className="fp-red" cx="78.4" cy="-58.7" r=".9" />
      <circle className="fp-red" cx="89.8" cy="-48.7" r=".9" />
      <circle className="fp-red" cx="92.0" cy="-45.6" r=".9" />
      <circle className="fp-red" cx="87.2" cy="-48.5" r=".9" />
      <circle className="fp-red" cx="84.9" cy="-45.2" r=".9" />
      <circle className="fp-red" cx="95.0" cy="-52.0" r=".9" />
      <circle className="fp-red" cx="-49.7" cy="62.5" r=".9" />
      <circle className="fp-red" cx="-36.6" cy="64.0" r=".9" />
      <circle className="fp-red" cx="-51.7" cy="50.1" r=".9" />
      <circle className="fp-red" cx="-41.5" cy="58.1" r=".9" />
      <circle className="fp-red" cx="-91.1" cy="-33.0" r=".9" />
      <circle className="fp-red" cx="-81.1" cy="-36.7" r=".9" />
      <circle className="fp-red" cx="-84.9" cy="-35.4" r=".9" />
      <circle className="fp-red" cx="-78.8" cy="-34.6" r=".9" />
      <circle className="fp-red" cx="40.4" cy="-44.3" r=".9" />
      <circle className="fp-red" cx="31.0" cy="-41.0" r=".9" />
      <circle className="fp-red" cx="42.3" cy="-44.4" r=".9" />
      <circle className="fp-red" cx="29.2" cy="-49.6" r=".9" />
      <circle className="fp-red" cx="98.1" cy="-6.4" r=".9" />
      <circle className="fp-red" cx="93.5" cy="6.4" r=".9" />
      <circle className="fp-red" cx="88.4" cy="9.0" r=".9" />
      <circle className="fp-red" cx="96.8" cy="1.1" r=".9" />
      <circle className="fp-red" cx="95.8" cy="4.7" r=".9" />
      <circle className="fp-red" cx="94.8" cy="6.9" r=".9" />
      <circle className="fp-red" cx="72.1" cy="-65.4" r=".9" />
      <circle className="fp-red" cx="79.7" cy="-63.5" r=".9" />
      <circle className="fp-red" cx="71.1" cy="-59.3" r=".9" />
      <circle className="fp-red" cx="81.7" cy="-65.6" r=".9" />
      <circle className="fp-red" cx="68.8" cy="-64.2" r=".9" />
      <circle className="fp-red" cx="74.4" cy="-64.9" r=".9" />
      <circle className="fp-red" cx="92.3" cy="-52.2" r=".9" />
      <circle className="fp-red" cx="91.6" cy="-53.3" r=".9" />
      <circle className="fp-red" cx="82.4" cy="-44.8" r=".9" />
      <circle className="fp-red" cx="91.0" cy="-43.7" r=".9" />
      <circle className="fp-red" cx="75.4" cy="52.7" r=".9" />
      <circle className="fp-red" cx="74.6" cy="54.7" r=".9" />
      <circle className="fp-red" cx="73.1" cy="53.3" r=".9" />
      <circle className="fp-red" cx="76.5" cy="52.1" r=".9" />
      <circle className="fp-red" cx="92.2" cy="9.7" r=".9" />
      <circle className="fp-red" cx="97.8" cy="8.6" r=".9" />
      <circle className="fp-red" cx="86.9" cy="5.5" r=".9" />
      <circle className="fp-red" cx="88.7" cy="11.3" r=".9" />
      <circle className="fp-red" cx="87.3" cy="8.9" r=".9" />
      <circle className="fp-red" cx="97.0" cy="-4.4" r=".9" />
      <circle className="fp-red" cx="25.1" cy="-16.5" r=".9" />
      <circle className="fp-red" cx="32.0" cy="-16.5" r=".9" />
      <circle className="fp-red" cx="28.2" cy="-14.7" r=".9" />
      <circle className="fp-red" cx="31.4" cy="-20.0" r=".9" />
      <circle className="fp-red" cx="41.1" cy="-16.0" r=".9" />
      <circle className="fp-red" cx="27.7" cy="-18.1" r=".9" />
      <circle className="fp-red" cx="29.2" cy="-17.9" r=".9" />
      <circle className="fp-red" cx="67.8" cy="-51.1" r=".9" />
      <circle className="fp-red" cx="84.6" cy="-54.2" r=".9" />
      <circle className="fp-red" cx="79.8" cy="-44.6" r=".9" />
      <circle className="fp-red" cx="84.0" cy="-42.2" r=".9" />
      <circle className="fp-red" cx="72.5" cy="-50.5" r=".9" />
      <circle className="fp-red" cx="78.6" cy="-46.1" r=".9" />
      <circle className="fp-red" cx="70.2" cy="-21.9" r=".9" />
      <circle className="fp-red" cx="70.1" cy="-16.4" r=".9" />
      <circle className="fp-red" cx="68.3" cy="-16.6" r=".9" />
      <circle className="fp-red" cx="52.8" cy="-1.6" r=".9" />
      <circle className="fp-red" cx="51.3" cy="-6.1" r=".9" />
      <circle className="fp-red" cx="55.6" cy="-6.3" r=".9" />
      <circle className="fp-red" cx="51.6" cy="-0.1" r=".9" />
      <circle className="fp-red" cx="56.7" cy="-8.3" r=".9" />
      <circle className="fp-red" cx="64.3" cy="-12.1" r=".9" />
      <circle className="fp-red" cx="98.6" cy="-14.7" r=".9" />
      <circle className="fp-red" cx="95.1" cy="-10.3" r=".9" />
      <circle className="fp-red" cx="95.5" cy="-10.6" r=".9" />
      <circle className="fp-red" cx="87.6" cy="-20.3" r=".9" />
      <circle className="fp-red" cx="97.3" cy="-17.8" r=".9" />
      <circle className="fp-red" cx="89.9" cy="-20.1" r=".9" />
      <circle className="fp-red" cx="-34.2" cy="49.6" r=".9" />
      <circle className="fp-red" cx="-33.2" cy="42.0" r=".9" />
      <circle className="fp-red" cx="-39.9" cy="41.1" r=".9" />
      <circle className="fp-red" cx="-36.4" cy="53.3" r=".9" />
      <circle className="fp-red" cx="-43.9" cy="53.2" r=".9" />
      <circle className="fp-red" cx="-35.4" cy="45.4" r=".9" />
      <circle className="fp-red" cx="-48.7" cy="52.5" r=".9" />
      <circle className="fp-red" cx="-40.3" cy="43.5" r=".9" />
      <circle className="fp-red" cx="83.1" cy="-51.2" r=".9" />
      <circle className="fp-red" cx="88.1" cy="-57.6" r=".9" />
      <circle className="fp-red" cx="86.4" cy="-46.3" r=".9" />
      <circle className="fp-red" cx="87.9" cy="-53.8" r=".9" />
      <circle className="fp-red" cx="78.0" cy="-48.4" r=".9" />
      <circle className="fp-red" cx="81.8" cy="-52.4" r=".9" />
      <circle className="fp-red" cx="84.1" cy="-64.2" r=".9" />
      <circle className="fp-red" cx="67.3" cy="-64.7" r=".9" />
      <circle className="fp-red" cx="69.3" cy="-59.3" r=".9" />
      <circle className="fp-red" cx="79.1" cy="-65.7" r=".9" />
      <circle className="fp-red" cx="77.6" cy="-59.2" r=".9" />
      <circle className="fp-red" cx="78.0" cy="-57.0" r=".9" />
      <circle className="fp-red" cx="77.4" cy="-58.3" r=".9" />
      <circle className="fp-red" cx="84.4" cy="-55.7" r=".9" />
      <circle className="fp-red" cx="74.6" cy="-59.0" r=".9" />
      <circle className="fp-red" cx="69.2" cy="-67.8" r=".9" />
      <circle className="fp-red" cx="68.8" cy="-58.2" r=".9" />
      </svg>
          </div>
          <canvas></canvas>
          <ul className="field-ui"></ul>
          <div className="field-chip"></div>
          <div className="field-caption" data-caption="sphere"><span className="field-caption__long">1,500 assessment points: one per country and indicator, in fifty clusters placed by geography alone. Red is one of that country's unsourced indicators, 161 in all.<small className="segmented-meta"><span className="segment">50 countries × 30 indicators</span><span className="segment"> · brighter = higher composite</span><span className="segment"> · hover a cluster</span></small></span><span className="field-caption__short segmented-meta"><span className="segment">1,500 points</span><span className="segment"> · 50 countries × 30 indicators</span><span className="segment"> · red = unsourced, 161 in all</span></span></div>
          <div className="field-caption" data-caption="field"><span className="field-caption__long">Fifty countries, thirty indicators each, placed by composite on a 0–100 ruler. Nothing lies beyond 60.<small className="segmented-meta"><span className="segment">mean 37.8</span><span className="segment"> · median 38.7</span><span className="segment"> · sd 12.3</span><span className="segment"> · Gold: sourced to a dated document or verified response</span><span className="segment"> · Red: practitioner judgement, 161 of 1,500</span></small></span><span className="field-caption__short segmented-meta"><span className="segment">0–100 by composite</span><span className="segment"> · mean 37.8</span><span className="segment"> · median 38.7</span><span className="segment"> · nothing past 60</span><span className="segment"> · red = unsourced</span></span></div>
          <div className="field-caption" data-caption="prism"><span className="field-caption__long">Fifty countries, stacked in rank order, on five arms. Six particles per arm is a display convention; indicator counts per dimension are not public.<small className="segmented-meta"><span className="segment">Arm brightness = published weight range</span><span className="segment"> · outline = field mean per dimension</span></small></span><span className="field-caption__short segmented-meta"><span className="segment">50 layers in rank order</span><span className="segment"> · five arms</span><span className="segment"> · outline = field mean per dimension</span></span></div>
          <div className="field-caption" data-caption="side"><span className="field-caption__long">The world's bottleneck is Capital Formation, field mean 28.5. Its collective strength is Data Sovereignty, 53.8.<small>Side view: the thin edge is capital, the deep edge is data</small></span><span className="field-caption__short segmented-meta"><span className="segment">side view</span><span className="segment"> · thin edge = Capital Formation 28.5</span><span className="segment"> · fat edge = Data Sovereignty 53.8</span></span></div>
          <div className="field-caption" data-caption="solo"><span className="field-caption__long">The United States, pulled to the front: 91.0 on Compute Capacity, 35.7 on Capital Formation. One pillar far behind the rest. Fourth overall.<small>The other 49 layers recede. One unsourced indicator shows red.</small></span><span className="field-caption__short segmented-meta"><span className="segment">United States</span><span className="segment"> · CC 91.0</span><span className="segment"> · CF 35.7</span><span className="segment"> · fourth overall</span><span className="segment"> · one unsourced indicator, red</span></span></div>
          <div className="field-caption" data-caption="rings"><span className="field-caption__long">A simple average of its five scores is 60.3, enough for the Advanced tier. SAPI's score is 57.5, because a weak pillar costs more than a strong one earns: capability works like a chain. The weak-link cost is almost 3 points.<small className="segmented-meta"><span className="segment">Dashed ring: simple average, 60.3</span><span className="segment"> · Solid ring: SAPI's score, 57.5</span><span className="segment"> · Gold band: the weak-link cost</span></small></span><span className="field-caption__short segmented-meta"><span className="segment">dashed 60.3 simple average</span><span className="segment"> · solid 57.5 SAPI score</span><span className="segment"> · gold band: weak-link cost</span></span></div>
        </div>
      
        {/* 1 ─────────────────────────── PROPOSITION ─────────────────────────── */}
        <section className="hero hero--field">
          <div className="shell hero__inner">
            <div className="grid--field">
              <div className="field-text">
                <p className="eyebrow eyebrow--plain"><span style={{ whiteSpace: "nowrap" }}>Quarter 2 Rankings 2026 ·</span> <span style={{ whiteSpace: "nowrap" }}>Published 2 July 2026 ·</span> <span className="eyebrow__more"><span style={{ whiteSpace: "nowrap" }}>50 countries ·</span> <span style={{ whiteSpace: "nowrap" }}>30 indicators ·</span> <span style={{ whiteSpace: "nowrap" }}>1,500 assessed data points</span></span></p>
                <h1>Understand where AI ambition becomes national capability.</h1>
                <p className="lede">SAPI assesses the infrastructure, capital, governance and execution that shape
                  sovereign AI capability, helping governments, defence and security leaders, and investors identify dependencies and priorities.</p>
                <p className="hero__finding">No nation has reached the Advanced tier. <span style={{ whiteSpace: "nowrap" }}>The highest composite is <strong>59.2</strong>.</span></p>
                <div className="btn-row hero__actions">
                  <a className="btn btn--primary" href="/sapi-index">Explore the latest findings</a>
                  <a className="btn btn--ghost" href="/contact">Request a briefing</a>
                </div>
                <button id="field-explore" className="visually-hidden field-explore" type="button">Explore the field: press the arrow keys to move between the fifty countries, Escape to stop</button>
                <p id="field-live" className="visually-hidden" aria-live="polite"></p>
      
              </div>
              <figure className="plate" data-plate="1">
                <svg className="field-strip field-strip--hero" viewBox="0 0 600 160" role="img" aria-label="Fifty countries placed by composite score on a 0 to 100 axis. Tier lines at 40, 60 and 80. The highest column is South Korea at 59.2; the field mean is 37.8. No column lies beyond 60.">
      <line className="fs-tier" x1="244.8" y1="20" x2="244.8" y2="126" />
      <line className="fs-tier" x1="355.2" y1="20" x2="355.2" y2="126" />
      <line className="fs-tier" x1="465.6" y1="20" x2="465.6" y2="126" />
      <g className="fs-cols">
      <line x1="350.8" y1="126.0" x2="350.8" y2="34.0"><title>South Korea 59.2</title></line>
      <line x1="349.1" y1="126.0" x2="349.1" y2="34.2"><title>United Arab Emirates 58.9</title></line>
      <line x1="345.3" y1="126.0" x2="345.3" y2="34.7"><title>Singapore 58.2</title></line>
      <line x1="341.4" y1="126.0" x2="341.4" y2="35.2"><title>United States 57.5</title></line>
      <line x1="336.4" y1="126.0" x2="336.4" y2="35.8"><title>Estonia 56.6</title></line>
      <line x1="330.9" y1="126.0" x2="330.9" y2="36.5"><title>France 55.6</title></line>
      <line x1="323.2" y1="126.0" x2="323.2" y2="37.5"><title>Saudi Arabia 54.2</title></line>
      <line x1="314.9" y1="126.0" x2="314.9" y2="38.5"><title>Oman 52.7</title></line>
      <line x1="303.3" y1="126.0" x2="303.3" y2="40.0"><title>Japan 50.6</title></line>
      <line x1="293.4" y1="126.0" x2="293.4" y2="41.3"><title>Italy 48.8</title></line>
      <line x1="292.3" y1="126.0" x2="292.3" y2="41.4"><title>Canada 48.6</title></line>
      <line x1="290.6" y1="126.0" x2="290.6" y2="41.6"><title>United Kingdom 48.3</title></line>
      <line x1="280.1" y1="126.0" x2="280.1" y2="43.0"><title>Finland 46.4</title></line>
      <line x1="279.6" y1="126.0" x2="279.6" y2="43.0"><title>Germany 46.3</title></line>
      <line x1="275.7" y1="126.0" x2="275.7" y2="43.5"><title>Australia 45.6</title></line>
      <line x1="273.5" y1="126.0" x2="273.5" y2="43.8"><title>India 45.2</title></line>
      <line x1="271.3" y1="126.0" x2="271.3" y2="44.1"><title>Norway 44.8</title></line>
      <line x1="268.0" y1="126.0" x2="268.0" y2="44.5"><title>Sweden 44.2</title></line>
      <line x1="266.9" y1="126.0" x2="266.9" y2="44.6"><title>Qatar 44.0</title></line>
      <line x1="261.4" y1="126.0" x2="261.4" y2="45.3"><title>Vietnam 43.0</title></line>
      <line x1="253.1" y1="126.0" x2="253.1" y2="46.4"><title>Chile 41.5</title></line>
      <line x1="250.3" y1="126.0" x2="250.3" y2="46.7"><title>Malaysia 41.0</title></line>
      <line x1="245.4" y1="126.0" x2="245.4" y2="47.4"><title>Egypt 40.1</title></line>
      <line x1="244.8" y1="126.0" x2="244.8" y2="47.4"><title>Kazakhstan 40.0</title></line>
      <line x1="242.0" y1="126.0" x2="242.0" y2="47.8"><title>Switzerland 39.5</title></line>
      <line x1="233.8" y1="126.0" x2="233.8" y2="48.8"><title>Brazil 38.0</title></line>
      <line x1="230.4" y1="126.0" x2="230.4" y2="49.2"><title>Türkiye 37.4</title></line>
      <line x1="211.1" y1="126.0" x2="211.1" y2="51.7"><title>Uzbekistan 33.9</title></line>
      <line x1="206.7" y1="126.0" x2="206.7" y2="52.3"><title>New Zealand 33.1</title></line>
      <line x1="204.0" y1="126.0" x2="204.0" y2="52.6"><title>Indonesia 32.6</title></line>
      <line x1="201.7" y1="126.0" x2="201.7" y2="52.9"><title>Bahrain 32.2</title></line>
      <line x1="200.6" y1="126.0" x2="200.6" y2="53.0"><title>Argentina 32.0</title></line>
      <line x1="192.4" y1="126.0" x2="192.4" y2="54.1"><title>Mexico 30.5</title></line>
      <line x1="190.7" y1="126.0" x2="190.7" y2="54.3"><title>Morocco 30.2</title></line>
      <line x1="185.7" y1="126.0" x2="185.7" y2="54.9"><title>Pakistan 29.3</title></line>
      <line x1="184.6" y1="126.0" x2="184.6" y2="55.0"><title>Kenya 29.1</title></line>
      <line x1="183.0" y1="126.0" x2="183.0" y2="55.3"><title>Azerbaijan 28.8</title></line>
      <line x1="175.2" y1="126.0" x2="175.2" y2="56.2"><title>Kuwait 27.4</title></line>
      <line x1="168.1" y1="126.0" x2="168.1" y2="57.1"><title>South Africa 26.1</title></line>
      <line x1="167.0" y1="126.0" x2="167.0" y2="57.3"><title>Rwanda 25.9</title></line>
      <line x1="167.0" y1="126.0" x2="167.0" y2="57.3"><title>Senegal 25.9</title></line>
      <line x1="161.4" y1="126.0" x2="161.4" y2="58.0"><title>Jordan 24.9</title></line>
      <line x1="156.5" y1="126.0" x2="156.5" y2="58.6"><title>Nigeria 24.0</title></line>
      <line x1="153.7" y1="126.0" x2="153.7" y2="59.0"><title>Ghana 23.5</title></line>
      <line x1="150.4" y1="126.0" x2="150.4" y2="59.4"><title>Kyrgyzstan 22.9</title></line>
      <line x1="147.1" y1="126.0" x2="147.1" y2="59.8"><title>Ethiopia 22.3</title></line>
      <line x1="132.2" y1="126.0" x2="132.2" y2="61.7"><title>Tajikistan 19.6</title></line>
      <line x1="131.6" y1="126.0" x2="131.6" y2="61.8"><title>Paraguay 19.5</title></line>
      <line x1="117.3" y1="126.0" x2="117.3" y2="63.6"><title>Iraq 16.9</title></line>
      <line x1="106.2" y1="126.0" x2="106.2" y2="65.0"><title>Turkmenistan 14.9</title></line>
      </g>
      <line className="fs-mean" x1="232.7" y1="34" x2="232.7" y2="130" />
      <line className="fs-tier" style={{ strokeDasharray: "none", opacity: ".5" }} x1="237.6" y1="116" x2="237.6" y2="130" />
      <line className="fs-axis" x1="24" y1="126" x2="576" y2="126" stroke="#241F33" />
      <text x="24.0" y="152" textAnchor="middle">0</text>
      <text x="134.4" y="152" textAnchor="middle">20</text>
      <text x="244.8" y="152" textAnchor="middle">40</text>
      <text x="355.2" y="152" textAnchor="middle">60</text>
      <text x="465.6" y="152" textAnchor="middle">80</text>
      <text x="576.0" y="152" textAnchor="middle">100</text>
      <text x="236.7" y="30" className="fs-lbl-mean">mean 37.8</text>
      <text x="359.2" y="30" className="fs-lbl-empty">Advanced tier  -  empty</text>
      <text x="134.4" y="30" textAnchor="middle">Nascent · 27</text>
      <text x="248.8" y="16">Developing · 23</text>
      </svg>
                <figcaption>Plate 1 · Fifty countries, thirty indicators each, placed by composite. Tier lines at 40, 60 and 80; the bright tick is the field mean, 37.8. Nothing lies beyond 60.</figcaption>
              </figure>
            </div>
      
            <dl className="evidence-strip">
              <div>
                <dt>Countries assessed</dt>
                <dd data-count="50">50</dd>
                <span className="note">Up from 38 in the previous edition. Twelve new entrants.</span>
              </div>
              <div>
                <dt>Indicators per country</dt>
                <dd data-count="30">30</dd>
                <span className="note">Each with a raw value, a dated source and a confidence grade.</span>
              </div>
              <div>
                <dt>Highest composite</dt>
                <dd data-count="59.2">59.2</dd>
                <span className="note">South Korea. The Advanced tier begins at 60 and is empty.</span>
              </div>
              <div>
                <dt>Field average</dt>
                <dd data-count="37.8">37.8</dd>
                <span className="note">Median 38.7. The field spans 14.9 to 59.2.</span>
              </div>
            </dl>
          </div>
        </section>
      
        {/* 2 ────────────────────────── CURRENT EDITION ───────────────────────── */}
        <section className="section on-ink act-edition">
          <div className="shell">
            <div className="grid--field">
              <div className="field-text">
                <p className="eyebrow">The current edition</p>
                <h2 style={{ fontSize: "clamp(1.9rem,3.6vw,2.6rem)", maxWidth: "16ch" }}>No nation has reached the Advanced tier.</h2>
                <p className="lede">The most AI-ready state in the world sits eight tenths of a point short of the
                  line. Sovereign AI has a front-running pack, not a champion.</p>
                <p>The leader did not get there on hardware. The United States holds the highest single
                  dimension score in the index - 91 on Compute Capacity, far ahead of anyone - and ranks
                  fourth overall, because the composite is a weighted geometric mean that punishes a hollow
                  pillar. South Korea, the UAE and Singapore lead on the balance of governance, capital and <span data-di="">Directed Intelligence</span> instead.</p>
                <p><a className="link-more" href="/sapi-index">Read the Quarter 2 2026 edition overview</a></p>
                <div className="table-wrap">
                  <table className="data" style={{ minWidth: "0" }}>
                    <caption><span className="segmented-meta"><span className="segment">Top ten, Quarter 2 Rankings 2026</span><span className="segment"> · published 2 July 2026</span><span className="segment"> · 0–100 composite. All ten sit in the Developing tier.</span></span></caption>
                    <thead>
                      <tr><th scope="col" className="num">#</th><th scope="col">Country</th><th scope="col" className="num">Composite</th></tr>
                    </thead>
                    <tbody>
                      <tr data-country="South Korea" tabIndex="0"><td className="num">1</td><th scope="row">South Korea</th><td className="num">59.2</td></tr>
                      <tr data-country="United Arab Emirates" tabIndex="0"><td className="num">2</td><th scope="row">United Arab Emirates</th><td className="num">58.9</td></tr>
                      <tr data-country="Singapore" tabIndex="0"><td className="num">3</td><th scope="row">Singapore</th><td className="num">58.2</td></tr>
                      <tr data-country="United States" tabIndex="0"><td className="num">4</td><th scope="row">United States</th><td className="num">57.5</td></tr>
                      <tr data-country="Estonia" tabIndex="0"><td className="num">5</td><th scope="row">Estonia</th><td className="num">56.6</td></tr>
                      <tr data-country="France" tabIndex="0"><td className="num">6</td><th scope="row">France</th><td className="num">55.6</td></tr>
                      <tr data-country="Saudi Arabia" tabIndex="0"><td className="num">7</td><th scope="row">Saudi Arabia</th><td className="num">54.2</td></tr>
                      <tr data-country="Oman" tabIndex="0"><td className="num">8</td><th scope="row">Oman</th><td className="num">52.7</td></tr>
                      <tr data-country="Japan" tabIndex="0"><td className="num">9</td><th scope="row">Japan</th><td className="num">50.6</td></tr>
                      <tr data-country="Italy" tabIndex="0"><td className="num">10</td><th scope="row">Italy</th><td className="num">48.8</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="meta" style={{ marginTop: ".75rem" }}>Hover or focus a row to light that country's column in the field.</p>
              </div>
              <figure className="plate plate--edition" data-plate="2">
                <svg className="field-strip field-strip--detail" viewBox="0 0 600 250" role="img" aria-label="The composite axis from 40 to 100. Twenty-three countries sit between 40 and 60, the top ten labelled from South Korea 59.2 to Italy 48.8. Nothing sits beyond 60.">
      <line className="fs-tier" x1="212.0" y1="58" x2="212.0" y2="220" />
      <line className="fs-tier" x1="394.0" y1="58" x2="394.0" y2="220" />
      <g className="fs-cols">
      <line x1="204.7" y1="220.0" x2="204.7" y2="118.0"><title>South Korea 59.2</title></line>
      <line x1="202.0" y1="220.0" x2="202.0" y2="118.2"><title>United Arab Emirates 58.9</title></line>
      <line x1="195.6" y1="220.0" x2="195.6" y2="118.8"><title>Singapore 58.2</title></line>
      <line x1="189.2" y1="220.0" x2="189.2" y2="119.3"><title>United States 57.5</title></line>
      <line x1="181.1" y1="220.0" x2="181.1" y2="120.0"><title>Estonia 56.6</title></line>
      <line x1="172.0" y1="220.0" x2="172.0" y2="120.8"><title>France 55.6</title></line>
      <line x1="159.2" y1="220.0" x2="159.2" y2="121.9"><title>Saudi Arabia 54.2</title></line>
      <line x1="145.6" y1="220.0" x2="145.6" y2="123.0"><title>Oman 52.7</title></line>
      <line x1="126.5" y1="220.0" x2="126.5" y2="124.7"><title>Japan 50.6</title></line>
      <line x1="110.1" y1="220.0" x2="110.1" y2="126.1"><title>Italy 48.8</title></line>
      <line x1="108.3" y1="220.0" x2="108.3" y2="126.2"><title>Canada 48.6</title></line>
      <line x1="105.5" y1="220.0" x2="105.5" y2="126.5"><title>United Kingdom 48.3</title></line>
      <line x1="88.2" y1="220.0" x2="88.2" y2="127.9"><title>Finland 46.4</title></line>
      <line x1="87.3" y1="220.0" x2="87.3" y2="128.0"><title>Germany 46.3</title></line>
      <line x1="81.0" y1="220.0" x2="81.0" y2="128.5"><title>Australia 45.6</title></line>
      <line x1="77.3" y1="220.0" x2="77.3" y2="128.9"><title>India 45.2</title></line>
      <line x1="73.7" y1="220.0" x2="73.7" y2="129.2"><title>Norway 44.8</title></line>
      <line x1="68.2" y1="220.0" x2="68.2" y2="129.6"><title>Sweden 44.2</title></line>
      <line x1="66.4" y1="220.0" x2="66.4" y2="129.8"><title>Qatar 44.0</title></line>
      <line x1="57.3" y1="220.0" x2="57.3" y2="130.6"><title>Vietnam 43.0</title></line>
      <line x1="43.6" y1="220.0" x2="43.6" y2="131.7"><title>Chile 41.5</title></line>
      <line x1="39.1" y1="220.0" x2="39.1" y2="132.1"><title>Malaysia 41.0</title></line>
      <line x1="30.9" y1="220.0" x2="30.9" y2="132.8"><title>Egypt 40.1</title></line>
      <line x1="30.0" y1="220.0" x2="30.0" y2="132.9"><title>Kazakhstan 40.0</title></line>
      </g>
      <line className="fs-axis" x1="30" y1="220" x2="576" y2="220" stroke="#241F33" />
      <text x="30.0" y="240" textAnchor="middle">40</text>
      <text x="121.0" y="240" textAnchor="middle">50</text>
      <text x="212.0" y="240" textAnchor="middle">60</text>
      <text x="303.0" y="240" textAnchor="middle">70</text>
      <text x="394.0" y="240" textAnchor="middle">80</text>
      <text x="485.0" y="240" textAnchor="middle">90</text>
      <text x="576.0" y="240" textAnchor="middle">100</text>
      <g className="fs-labels">
      <line className="fs-lead" x1="204.7" y1="118.0" x2="204.7" y2="113" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="201.7" y="110.0" textAnchor="end">1 South Korea <tspan fill="#E3B75C">59.2</tspan></text>
      <line className="fs-lead" x1="202.0" y1="118.0" x2="202.0" y2="93" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="199.0" y="90.0" textAnchor="end">2 United Arab Emirates <tspan fill="#E3B75C">58.9</tspan></text>
      <line className="fs-lead" x1="195.6" y1="118.0" x2="195.6" y2="73" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="192.6" y="70.0" textAnchor="end">3 Singapore <tspan fill="#E3B75C">58.2</tspan></text>
      <line className="fs-lead" x1="189.2" y1="118.0" x2="189.2" y2="53" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="186.2" y="50.0" textAnchor="end">4 United States <tspan fill="#E3B75C">57.5</tspan></text>
      <line className="fs-lead" x1="181.1" y1="118.0" x2="181.1" y2="33" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="178.1" y="30.0" textAnchor="end">5 Estonia <tspan fill="#E3B75C">56.6</tspan></text>
      <line className="fs-lead" x1="172.0" y1="118.0" x2="172.0" y2="107" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="169.0" y="104.0" textAnchor="end">6 France <tspan fill="#E3B75C">55.6</tspan></text>
      <line className="fs-lead" x1="159.2" y1="118.0" x2="159.2" y2="87" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="156.2" y="84.0" textAnchor="end">7 Saudi Arabia <tspan fill="#E3B75C">54.2</tspan></text>
      <line className="fs-lead" x1="145.6" y1="118.0" x2="145.6" y2="67" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="142.6" y="64.0" textAnchor="end">8 Oman <tspan fill="#E3B75C">52.7</tspan></text>
      <line className="fs-lead" x1="126.5" y1="118.0" x2="126.5" y2="47" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="123.5" y="44.0" textAnchor="end">9 Japan <tspan fill="#E3B75C">50.6</tspan></text>
      <line className="fs-lead" x1="110.1" y1="118.0" x2="110.1" y2="27" stroke="#C9963A" strokeWidth=".75" opacity=".5" />
      <text x="107.1" y="24.0" textAnchor="end">10 Italy <tspan fill="#E3B75C">48.8</tspan></text>
      </g>
      <text x="218.0" y="72" className="fs-lbl-empty">Advanced 60–80 · 0 countries</text>
      <text x="400.0" y="72" className="fs-lbl-empty">Leading 80–100 · 0 countries</text>
      <text x="39.1" y="72">Developing 40–60 · 23</text>
      </svg>
                <figcaption>Plate 2 · The ruler from 40 to 100, top ten labelled. Twenty-three countries sit between 40 and 60. The space past 60  -  the Advanced and Leading tiers  -  is empty.</figcaption>
              </figure>
            </div>
          </div>
        </section>
      
        {/* 3 ────────────────────────── FIVE DIMENSIONS ───────────────────────── */}
        <section className="section on-ink act-dims">
          <div className="shell">
            <div className="grid--field">
              <div className="field-text dims-col">
                <p className="eyebrow">The framework</p>
                <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.3rem)" }}>Five dimensions, one composite</h2>
                <p className="lede" style={{ marginBottom: "2rem" }}>Each dimension isolates a separate source of sovereign strength. Compute a nation does not control, and data held under another jurisdiction, are national security dependencies as much as economic ones. The composite is a weighted geometric mean, so a country cannot buy its way past a weak
                  pillar. Worked below against a single country: the United States.</p>
      
                <div className="dims">
                  <div className="dim">
                    <span className="dim__no">01</span>
                    <span className="dim__name">Compute Capacity</span>
                    <span className="dim__weight">Weight 15–20%</span>
                    <p className="dim__body">Sovereign access to high-performance compute and the energy to run it:
                      hyperscale capacity, grid headroom, power resilience, and the physical infrastructure
                      required to host strategic AI workloads.</p>
                    <p className="dim__eg"><strong>United States: 91.</strong> The highest single dimension score
                      anywhere in the index.</p>
                  </div>
                  <div className="dim">
                    <span className="dim__no">02</span>
                    <span className="dim__name">Capital Formation</span>
                    <span className="dim__weight">Weight 20–25%</span>
                    <p className="dim__body">The depth and strategic orientation of capital: sovereign wealth
                      deployment, venture ecosystems, and the mechanisms that actually direct money toward
                      sovereign AI priorities rather than merely holding it.</p>
                    <p className="dim__eg"><strong>United States: 35.7.</strong> Deep capital markets, thinly directed
                      at sovereign AI. This is the pillar that costs it the top spot.</p>
                  </div>
                  <div className="dim">
                    <span className="dim__no">03</span>
                    <span className="dim__name">Regulatory Readiness</span>
                    <span className="dim__weight">Weight 15–20%</span>
                    <p className="dim__body">Legal clarity, procurement maturity, licensing pathways and the coherence
                      of national AI policy  -  the conditions that let infrastructure move with velocity.</p>
                    <p className="dim__eg"><strong>United States: 66.9.</strong></p>
                  </div>
                  <div className="dim">
                    <span className="dim__no">04</span>
                    <span className="dim__name">Data Sovereignty</span>
                    <span className="dim__weight">Weight 10–15%</span>
                    <p className="dim__body">National control over data localisation, trusted cloud environments,
                      security frameworks and jurisdictional certainty.</p>
                    <p className="dim__eg"><strong>United States: 69.2.</strong></p>
                  </div>
                  <div className="dim">
                    <span className="dim__no" data-di="">05</span>
                    <span className="dim__name" data-di="">Directed Intelligence</span>
                    <span className="dim__weight">Weight 25–30%</span>
                    <p className="dim__body"><span data-di="">Directed Intelligence</span> is SAPI's proprietary dimension, and its heaviest-weighted: whether a
                      state actually runs AI in production across its institutions, from mission design through to
                      durable adoption. Scored on a <span data-di="">five-stage maturity scale</span>.</p>
                    <p className="dim__eg"><strong>United States: <span data-di="n">52.8</span>.</strong> Composite <strong>57.5</strong>, rank
                      4. A country can lead the world on one pillar and still be held in the Developing tier.</p>
                  </div>
                </div>
      
                <p style={{ marginTop: "2.5rem" }}><a className="link-more" href="/methodology">How the scoring works</a></p>
              </div>
              <figure className="plate" data-plate="3">
                <svg className="pg pg--us" viewBox="-80 0 580 420" role="img" aria-label="The United States on five dimensions: Compute Capacity 91.0, Capital Formation 35.7, Regulatory Readiness 66.9, Data Sovereignty 69.2, Directed Intelligence 52.8. A dashed ring marks the simple average of those scores, 60.3; a solid ring marks SAPI's score, 57.5. The gap between them is the weak-link cost of one weak pillar.">
      <polygon className="pg-axis" points="210.0,187.4 237.2,207.2 226.8,239.1 193.2,239.1 182.8,207.2" fill="none" opacity="0.35" />
      <polygon className="pg-axis" points="210.0,158.9 264.3,198.3 243.6,262.2 176.4,262.2 155.7,198.3" fill="none" opacity="0.35" />
      <polygon className="pg-axis" points="210.0,130.3 291.5,189.5 260.4,285.3 159.6,285.3 128.5,189.5" fill="none" opacity="0.35" />
      <polygon className="pg-axis" points="210.0,101.8 318.6,180.7 277.1,308.4 142.9,308.4 101.4,180.7" fill="none" opacity="0.35" />
      <polygon className="pg-axis" points="210.0,73.2 345.8,171.9 293.9,331.5 126.1,331.5 74.2,171.9" fill="none" opacity="0.8" />
      <line className="pg-axis" x1="210.0" y1="216.0" x2="210.0" y2="73.2" />
      <line className="pg-axis" x1="210.0" y1="216.0" x2="345.8" y2="171.9" />
      <line className="pg-axis" x1="210.0" y1="216.0" x2="293.9" y2="331.5" />
      <line className="pg-axis" x1="210.0" y1="216.0" x2="126.1" y2="331.5" />
      <line className="pg-axis" x1="210.0" y1="216.0" x2="74.2" y2="171.9" />
      <circle className="pg-ring pg-ring--dash" cx="210.0" cy="216.0" r="85.7" />
      <circle className="pg-ring pg-ring--solid" cx="210.0" cy="216.0" r="82.1" />
      <polygon className="pg-shape pg-draw" points="210.0,86.1 258.5,200.2 266.2,293.3 151.9,295.9 138.3,192.7" />
      <circle className="pg-dot" cx="210.0" cy="86.1" r="3.5" />
      <text className="pg-val" x="210.0" y="45.5" textAnchor="middle">CC 91.0</text>
      <text className="pg-note" x="210.0" y="58.5" textAnchor="middle">Compute Capacity</text>
      <circle className="pg-dot" cx="258.5" cy="200.2" r="3.5" />
      <text className="pg-val" x="370.3" y="163.9" textAnchor="start">CF 35.7</text>
      <text className="pg-note" x="370.3" y="176.9" textAnchor="start">Capital Formation</text>
      <circle className="pg-dot" cx="266.2" cy="293.3" r="3.5" />
      <text className="pg-val" x="309.0" y="356.3" textAnchor="start">RR 66.9</text>
      <text className="pg-note" x="309.0" y="369.3" textAnchor="start">Regulatory Readiness</text>
      <circle className="pg-dot" cx="151.9" cy="295.9" r="3.5" />
      <text className="pg-val" x="111.0" y="356.3" textAnchor="end">DS 69.2</text>
      <text className="pg-note" x="111.0" y="369.3" textAnchor="end">Data Sovereignty</text>
      <circle className="pg-dot" cx="138.3" cy="192.7" r="3.5" />
      <text className="pg-val" x="49.7" y="163.9" textAnchor="end">DI 52.8</text>
      <text className="pg-note" x="49.7" y="176.9" textAnchor="end">Directed Intelligence</text>
      <text className="pg-note" x="210.0" y="398" textAnchor="middle">dashed: simple average, 60.3 · would reach Advanced</text>
      <text className="pg-note pg-note--gold" x="210.0" y="412" textAnchor="middle">solid: SAPI's score, 57.5 · Developing, fourth</text>
      </svg>
                <figcaption>Plate 3 · The United States on five arms: 91.0 / 35.7 / 66.9 / 69.2 / 52.8. A simple average of its scores is 60.3 (dashed); SAPI's score is 57.5 (solid). The gap, almost 3 points, is the weak-link cost of one weak pillar.</figcaption>
              </figure>
            </div>
          </div>
        </section>
      
      </div>{/* /act1 */}
      
      {/* 4 ───────────────────────── RESEARCH PREVIEWS ──────────────────────── */}
      <section className="section on-paper section--research">
        <div className="shell">
          <p className="eyebrow">Research</p>
          <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.3rem)" }}>Three findings from the current edition</h2>
          <p className="lede" style={{ marginBottom: "2.5rem" }}>Every note follows the same spine: finding, evidence,
            interpretation, decision implication, enquiry.</p>
      
          <div className="grid grid--3">
            <article className="card">
              <p className="card__kicker"><span className="card__tag">Thematic analysis</span><span>2 July 2026</span></p>
              <p className="claim">Compute is the least predictive pillar of sovereign AI power. <span data-di="">Directed Intelligence</span> is among the most.</p>
              <svg className="card__strip" viewBox="0 0 360 36" role="img" aria-label="Fifty countries by composite. Estonia, 56.6, is lit; the seven G7 members are marked. Of the G7, only the United States, 57.5, sits above Estonia.">
      <line className="cs-tier" x1="144.8" y1="4" x2="144.8" y2="28" />
      <line className="cs-tier" x1="215.2" y1="4" x2="215.2" y2="28" />
      <line className="cs-tier" x1="285.6" y1="4" x2="285.6" y2="28" />
      <g className="cs-cols">
      <line x1="212.4" y1="28" x2="212.4" y2="14.2"><title>South Korea 59.2</title></line>
      <line x1="211.3" y1="28" x2="211.3" y2="14.2"><title>United Arab Emirates 58.9</title></line>
      <line x1="208.9" y1="28" x2="208.9" y2="14.4"><title>Singapore 58.2</title></line>
      <line className="cs-mark" x1="206.4" y1="28" x2="206.4" y2="14.5"><title>United States 57.5</title></line>
      <line className="cs-lit" x1="203.2" y1="28" x2="203.2" y2="14.7"><title>Estonia 56.6</title></line>
      <line className="cs-mark" x1="199.7" y1="28" x2="199.7" y2="14.9"><title>France 55.6</title></line>
      <line x1="194.8" y1="28" x2="194.8" y2="15.2"><title>Saudi Arabia 54.2</title></line>
      <line x1="189.5" y1="28" x2="189.5" y2="15.5"><title>Oman 52.7</title></line>
      <line className="cs-mark" x1="182.1" y1="28" x2="182.1" y2="15.9"><title>Japan 50.6</title></line>
      <line className="cs-mark" x1="175.8" y1="28" x2="175.8" y2="16.2"><title>Italy 48.8</title></line>
      <line className="cs-mark" x1="175.1" y1="28" x2="175.1" y2="16.3"><title>Canada 48.6</title></line>
      <line className="cs-mark" x1="174.0" y1="28" x2="174.0" y2="16.3"><title>United Kingdom 48.3</title></line>
      <line x1="167.3" y1="28" x2="167.3" y2="16.7"><title>Finland 46.4</title></line>
      <line className="cs-mark" x1="167.0" y1="28" x2="167.0" y2="16.7"><title>Germany 46.3</title></line>
      <line x1="164.5" y1="28" x2="164.5" y2="16.9"><title>Australia 45.6</title></line>
      <line x1="163.1" y1="28" x2="163.1" y2="17.0"><title>India 45.2</title></line>
      <line x1="161.7" y1="28" x2="161.7" y2="17.0"><title>Norway 44.8</title></line>
      <line x1="159.6" y1="28" x2="159.6" y2="17.2"><title>Sweden 44.2</title></line>
      <line x1="158.9" y1="28" x2="158.9" y2="17.2"><title>Qatar 44.0</title></line>
      <line x1="155.4" y1="28" x2="155.4" y2="17.4"><title>Vietnam 43.0</title></line>
      <line x1="150.1" y1="28" x2="150.1" y2="17.7"><title>Chile 41.5</title></line>
      <line x1="148.3" y1="28" x2="148.3" y2="17.8"><title>Malaysia 41.0</title></line>
      <line x1="145.2" y1="28" x2="145.2" y2="18.0"><title>Egypt 40.1</title></line>
      <line x1="144.8" y1="28" x2="144.8" y2="18.0"><title>Kazakhstan 40.0</title></line>
      <line x1="143.0" y1="28" x2="143.0" y2="18.1"><title>Switzerland 39.5</title></line>
      <line x1="137.8" y1="28" x2="137.8" y2="18.4"><title>Brazil 38.0</title></line>
      <line x1="135.6" y1="28" x2="135.6" y2="18.5"><title>Türkiye 37.4</title></line>
      <line x1="123.3" y1="28" x2="123.3" y2="19.2"><title>Uzbekistan 33.9</title></line>
      <line x1="120.5" y1="28" x2="120.5" y2="19.4"><title>New Zealand 33.1</title></line>
      <line x1="118.8" y1="28" x2="118.8" y2="19.5"><title>Indonesia 32.6</title></line>
      <line x1="117.3" y1="28" x2="117.3" y2="19.6"><title>Bahrain 32.2</title></line>
      <line x1="116.6" y1="28" x2="116.6" y2="19.6"><title>Argentina 32.0</title></line>
      <line x1="111.4" y1="28" x2="111.4" y2="19.9"><title>Mexico 30.5</title></line>
      <line x1="110.3" y1="28" x2="110.3" y2="20.0"><title>Morocco 30.2</title></line>
      <line x1="107.1" y1="28" x2="107.1" y2="20.1"><title>Pakistan 29.3</title></line>
      <line x1="106.4" y1="28" x2="106.4" y2="20.2"><title>Kenya 29.1</title></line>
      <line x1="105.4" y1="28" x2="105.4" y2="20.2"><title>Azerbaijan 28.8</title></line>
      <line x1="100.4" y1="28" x2="100.4" y2="20.5"><title>Kuwait 27.4</title></line>
      <line x1="95.9" y1="28" x2="95.9" y2="20.8"><title>South Africa 26.1</title></line>
      <line x1="95.2" y1="28" x2="95.2" y2="20.8"><title>Rwanda 25.9</title></line>
      <line x1="95.2" y1="28" x2="95.2" y2="20.8"><title>Senegal 25.9</title></line>
      <line x1="91.6" y1="28" x2="91.6" y2="21.0"><title>Jordan 24.9</title></line>
      <line x1="88.5" y1="28" x2="88.5" y2="21.2"><title>Nigeria 24.0</title></line>
      <line x1="86.7" y1="28" x2="86.7" y2="21.3"><title>Ghana 23.5</title></line>
      <line x1="84.6" y1="28" x2="84.6" y2="21.4"><title>Kyrgyzstan 22.9</title></line>
      <line x1="82.5" y1="28" x2="82.5" y2="21.5"><title>Ethiopia 22.3</title></line>
      <line x1="73.0" y1="28" x2="73.0" y2="22.1"><title>Tajikistan 19.6</title></line>
      <line x1="72.6" y1="28" x2="72.6" y2="22.1"><title>Paraguay 19.5</title></line>
      <line x1="63.5" y1="28" x2="63.5" y2="22.6"><title>Iraq 16.9</title></line>
      <line x1="56.4" y1="28" x2="56.4" y2="23.0"><title>Turkmenistan 14.9</title></line>
      </g>
      <text className="cs-lbl" x="199.2" y="10" textAnchor="end">Estonia 56.6</text>
      <line className="cs-axis" x1="4" y1="28" x2="356" y2="28" />
      <text x="4.0" y="35" textAnchor="start">0</text>
      <text x="180.0" y="35" textAnchor="middle">50</text>
      <text x="356.0" y="35" textAnchor="end">100</text>
      </svg>
              <h3><span data-di="">Directed Intelligence</span>, not compute</h3>
              <p>Estonia, a state of 1.3 million, outranks every G7 member except the United States  -  on the strength of <span data-di="">Directed Intelligence</span>, not scale.</p>
            </article>
      
            <article className="card">
              <p className="card__kicker"><span className="card__tag">Strategic risk briefing</span><span>2 July 2026</span></p>
              <p className="claim">Capital Formation is the world's weakest pillar and its strongest predictor of rank.</p>
              <svg className="card__strip" viewBox="0 0 360 36" role="img" aria-label="Fifty countries by Capital Formation score. The dimension mean, 28.5, is marked: the lowest of the five dimension means.">
      <line className="cs-tier" x1="144.8" y1="4" x2="144.8" y2="28" />
      <line className="cs-tier" x1="215.2" y1="4" x2="215.2" y2="28" />
      <line className="cs-tier" x1="285.6" y1="4" x2="285.6" y2="28" />
      <g className="cs-cols">
      <line x1="181.8" y1="28" x2="181.8" y2="15.9"><title>South Korea 50.5</title></line>
      <line x1="230.7" y1="28" x2="230.7" y2="13.1"><title>United Arab Emirates 64.4</title></line>
      <line x1="176.1" y1="28" x2="176.1" y2="16.2"><title>Singapore 48.9</title></line>
      <line x1="129.7" y1="28" x2="129.7" y2="18.9"><title>United States 35.7</title></line>
      <line x1="147.6" y1="28" x2="147.6" y2="17.8"><title>Estonia 40.8</title></line>
      <line x1="173.7" y1="28" x2="173.7" y2="16.4"><title>France 48.2</title></line>
      <line x1="222.9" y1="28" x2="222.9" y2="13.6"><title>Saudi Arabia 62.2</title></line>
      <line x1="136.0" y1="28" x2="136.0" y2="18.5"><title>Oman 37.5</title></line>
      <line x1="133.9" y1="28" x2="133.9" y2="18.6"><title>Japan 36.9</title></line>
      <line x1="115.2" y1="28" x2="115.2" y2="19.7"><title>Italy 31.6</title></line>
      <line x1="133.5" y1="28" x2="133.5" y2="18.6"><title>Canada 36.8</title></line>
      <line x1="145.2" y1="28" x2="145.2" y2="18.0"><title>United Kingdom 40.1</title></line>
      <line x1="115.2" y1="28" x2="115.2" y2="19.7"><title>Finland 31.6</title></line>
      <line x1="115.6" y1="28" x2="115.6" y2="19.7"><title>Germany 31.7</title></line>
      <line x1="102.6" y1="28" x2="102.6" y2="20.4"><title>Australia 28.0</title></line>
      <line x1="123.7" y1="28" x2="123.7" y2="19.2"><title>India 34.0</title></line>
      <line x1="119.8" y1="28" x2="119.8" y2="19.4"><title>Norway 32.9</title></line>
      <line x1="114.2" y1="28" x2="114.2" y2="19.7"><title>Sweden 31.3</title></line>
      <line x1="173.7" y1="28" x2="173.7" y2="16.4"><title>Qatar 48.2</title></line>
      <line x1="111.7" y1="28" x2="111.7" y2="19.9"><title>Vietnam 30.6</title></line>
      <line x1="113.5" y1="28" x2="113.5" y2="19.8"><title>Chile 31.1</title></line>
      <line x1="120.2" y1="28" x2="120.2" y2="19.4"><title>Malaysia 33.0</title></line>
      <line x1="98.3" y1="28" x2="98.3" y2="20.6"><title>Egypt 26.8</title></line>
      <line x1="102.2" y1="28" x2="102.2" y2="20.4"><title>Kazakhstan 27.9</title></line>
      <line x1="90.6" y1="28" x2="90.6" y2="21.1"><title>Switzerland 24.6</title></line>
      <line x1="112.8" y1="28" x2="112.8" y2="19.8"><title>Brazil 30.9</title></line>
      <line x1="105.7" y1="28" x2="105.7" y2="20.2"><title>Türkiye 28.9</title></line>
      <line x1="99.0" y1="28" x2="99.0" y2="20.6"><title>Uzbekistan 27.0</title></line>
      <line x1="89.2" y1="28" x2="89.2" y2="21.2"><title>New Zealand 24.2</title></line>
      <line x1="71.9" y1="28" x2="71.9" y2="22.1"><title>Indonesia 19.3</title></line>
      <line x1="86.7" y1="28" x2="86.7" y2="21.3"><title>Bahrain 23.5</title></line>
      <line x1="57.2" y1="28" x2="57.2" y2="23.0"><title>Argentina 15.1</title></line>
      <line x1="75.1" y1="28" x2="75.1" y2="22.0"><title>Mexico 20.2</title></line>
      <line x1="95.2" y1="28" x2="95.2" y2="20.8"><title>Morocco 25.9</title></line>
      <line x1="82.1" y1="28" x2="82.1" y2="21.6"><title>Pakistan 22.2</title></line>
      <line x1="100.8" y1="28" x2="100.8" y2="20.5"><title>Kenya 27.5</title></line>
      <line x1="71.6" y1="28" x2="71.6" y2="22.2"><title>Azerbaijan 19.2</title></line>
      <line x1="79.3" y1="28" x2="79.3" y2="21.7"><title>Kuwait 21.4</title></line>
      <line x1="43.4" y1="28" x2="43.4" y2="23.8"><title>South Africa 11.2</title></line>
      <line x1="67.7" y1="28" x2="67.7" y2="22.4"><title>Rwanda 18.1</title></line>
      <line x1="92.7" y1="28" x2="92.7" y2="21.0"><title>Senegal 25.2</title></line>
      <line x1="67.0" y1="28" x2="67.0" y2="22.4"><title>Jordan 17.9</title></line>
      <line x1="52.9" y1="28" x2="52.9" y2="23.2"><title>Nigeria 13.9</title></line>
      <line x1="91.3" y1="28" x2="91.3" y2="21.0"><title>Ghana 24.8</title></line>
      <line x1="44.1" y1="28" x2="44.1" y2="23.7"><title>Kyrgyzstan 11.4</title></line>
      <line x1="35.7" y1="28" x2="35.7" y2="24.2"><title>Ethiopia 9.0</title></line>
      <line x1="70.5" y1="28" x2="70.5" y2="22.2"><title>Tajikistan 18.9</title></line>
      <line x1="28.3" y1="28" x2="28.3" y2="24.6"><title>Paraguay 6.9</title></line>
      <line x1="36.0" y1="28" x2="36.0" y2="24.2"><title>Iraq 9.1</title></line>
      <line x1="30.8" y1="28" x2="30.8" y2="24.5"><title>Turkmenistan 7.6</title></line>
      </g>
      <line className="cs-mean" x1="104.3" y1="2" x2="104.3" y2="30" />
      <text className="cs-lbl" x="108.3" y="10">CF mean 28.5</text>
      <line className="cs-axis" x1="4" y1="28" x2="356" y2="28" />
      <text x="4.0" y="35" textAnchor="start">0</text>
      <text x="180.0" y="35" textAnchor="middle">50</text>
      <text x="356.0" y="35" textAnchor="end">100</text>
      </svg>
              <h3>The financing gap</h3>
              <p>Governments have written the policy of sovereign AI well ahead of financing the machine.
                Field mean 28.5, correlation with the composite 0.89.</p>
            </article>
      
            <article className="card">
              <p className="card__kicker"><span className="card__tag">Guide for decision-makers</span><span>2 July 2026</span></p>
              <p className="claim">Most misreadings of a national AI score come from four repeatable mistakes.</p>
              <svg className="card__strip" viewBox="0 0 360 36" role="img" aria-label="Fifty countries by composite, with the six published movers drawn as arrows in composite points from the prior edition to the current one: Canada, Turkiye, Japan, Italy, Sweden and Norway.">
      <line className="cs-tier" x1="144.8" y1="4" x2="144.8" y2="28" />
      <line className="cs-tier" x1="215.2" y1="4" x2="215.2" y2="28" />
      <line className="cs-tier" x1="285.6" y1="4" x2="285.6" y2="28" />
      <g className="cs-cols">
      <line x1="212.4" y1="28" x2="212.4" y2="14.2"><title>South Korea 59.2</title></line>
      <line x1="211.3" y1="28" x2="211.3" y2="14.2"><title>United Arab Emirates 58.9</title></line>
      <line x1="208.9" y1="28" x2="208.9" y2="14.4"><title>Singapore 58.2</title></line>
      <line x1="206.4" y1="28" x2="206.4" y2="14.5"><title>United States 57.5</title></line>
      <line x1="203.2" y1="28" x2="203.2" y2="14.7"><title>Estonia 56.6</title></line>
      <line x1="199.7" y1="28" x2="199.7" y2="14.9"><title>France 55.6</title></line>
      <line x1="194.8" y1="28" x2="194.8" y2="15.2"><title>Saudi Arabia 54.2</title></line>
      <line x1="189.5" y1="28" x2="189.5" y2="15.5"><title>Oman 52.7</title></line>
      <line x1="182.1" y1="28" x2="182.1" y2="15.9"><title>Japan 50.6</title></line>
      <line x1="175.8" y1="28" x2="175.8" y2="16.2"><title>Italy 48.8</title></line>
      <line x1="175.1" y1="28" x2="175.1" y2="16.3"><title>Canada 48.6</title></line>
      <line x1="174.0" y1="28" x2="174.0" y2="16.3"><title>United Kingdom 48.3</title></line>
      <line x1="167.3" y1="28" x2="167.3" y2="16.7"><title>Finland 46.4</title></line>
      <line x1="167.0" y1="28" x2="167.0" y2="16.7"><title>Germany 46.3</title></line>
      <line x1="164.5" y1="28" x2="164.5" y2="16.9"><title>Australia 45.6</title></line>
      <line x1="163.1" y1="28" x2="163.1" y2="17.0"><title>India 45.2</title></line>
      <line x1="161.7" y1="28" x2="161.7" y2="17.0"><title>Norway 44.8</title></line>
      <line x1="159.6" y1="28" x2="159.6" y2="17.2"><title>Sweden 44.2</title></line>
      <line x1="158.9" y1="28" x2="158.9" y2="17.2"><title>Qatar 44.0</title></line>
      <line x1="155.4" y1="28" x2="155.4" y2="17.4"><title>Vietnam 43.0</title></line>
      <line x1="150.1" y1="28" x2="150.1" y2="17.7"><title>Chile 41.5</title></line>
      <line x1="148.3" y1="28" x2="148.3" y2="17.8"><title>Malaysia 41.0</title></line>
      <line x1="145.2" y1="28" x2="145.2" y2="18.0"><title>Egypt 40.1</title></line>
      <line x1="144.8" y1="28" x2="144.8" y2="18.0"><title>Kazakhstan 40.0</title></line>
      <line x1="143.0" y1="28" x2="143.0" y2="18.1"><title>Switzerland 39.5</title></line>
      <line x1="137.8" y1="28" x2="137.8" y2="18.4"><title>Brazil 38.0</title></line>
      <line x1="135.6" y1="28" x2="135.6" y2="18.5"><title>Türkiye 37.4</title></line>
      <line x1="123.3" y1="28" x2="123.3" y2="19.2"><title>Uzbekistan 33.9</title></line>
      <line x1="120.5" y1="28" x2="120.5" y2="19.4"><title>New Zealand 33.1</title></line>
      <line x1="118.8" y1="28" x2="118.8" y2="19.5"><title>Indonesia 32.6</title></line>
      <line x1="117.3" y1="28" x2="117.3" y2="19.6"><title>Bahrain 32.2</title></line>
      <line x1="116.6" y1="28" x2="116.6" y2="19.6"><title>Argentina 32.0</title></line>
      <line x1="111.4" y1="28" x2="111.4" y2="19.9"><title>Mexico 30.5</title></line>
      <line x1="110.3" y1="28" x2="110.3" y2="20.0"><title>Morocco 30.2</title></line>
      <line x1="107.1" y1="28" x2="107.1" y2="20.1"><title>Pakistan 29.3</title></line>
      <line x1="106.4" y1="28" x2="106.4" y2="20.2"><title>Kenya 29.1</title></line>
      <line x1="105.4" y1="28" x2="105.4" y2="20.2"><title>Azerbaijan 28.8</title></line>
      <line x1="100.4" y1="28" x2="100.4" y2="20.5"><title>Kuwait 27.4</title></line>
      <line x1="95.9" y1="28" x2="95.9" y2="20.8"><title>South Africa 26.1</title></line>
      <line x1="95.2" y1="28" x2="95.2" y2="20.8"><title>Rwanda 25.9</title></line>
      <line x1="95.2" y1="28" x2="95.2" y2="20.8"><title>Senegal 25.9</title></line>
      <line x1="91.6" y1="28" x2="91.6" y2="21.0"><title>Jordan 24.9</title></line>
      <line x1="88.5" y1="28" x2="88.5" y2="21.2"><title>Nigeria 24.0</title></line>
      <line x1="86.7" y1="28" x2="86.7" y2="21.3"><title>Ghana 23.5</title></line>
      <line x1="84.6" y1="28" x2="84.6" y2="21.4"><title>Kyrgyzstan 22.9</title></line>
      <line x1="82.5" y1="28" x2="82.5" y2="21.5"><title>Ethiopia 22.3</title></line>
      <line x1="73.0" y1="28" x2="73.0" y2="22.1"><title>Tajikistan 19.6</title></line>
      <line x1="72.6" y1="28" x2="72.6" y2="22.1"><title>Paraguay 19.5</title></line>
      <line x1="63.5" y1="28" x2="63.5" y2="22.6"><title>Iraq 16.9</title></line>
      <line x1="56.4" y1="28" x2="56.4" y2="23.0"><title>Turkmenistan 14.9</title></line>
      </g>
      <line className="cs-move" x1="145.2" y1="8" x2="175.1" y2="8"><title>Canada 40.1 to 48.6</title></line><circle className="cs-now" cx="175.1" cy="8" r="1.8" />
      <line className="cs-move" x1="108.5" y1="11" x2="135.6" y2="11"><title>Türkiye 29.7 to 37.4</title></line><circle className="cs-now" cx="135.6" cy="11" r="1.8" />
      <line className="cs-move" x1="165.9" y1="14" x2="182.1" y2="14"><title>Japan 46.0 to 50.6</title></line><circle className="cs-now" cx="182.1" cy="14" r="1.8" />
      <line className="cs-move" x1="168.4" y1="17" x2="175.8" y2="17"><title>Italy 46.7 to 48.8</title></line><circle className="cs-now" cx="175.8" cy="17" r="1.8" />
      <line className="cs-move cs-move--down" x1="177.9" y1="20" x2="159.6" y2="20"><title>Sweden 49.4 to 44.2</title></line><circle className="cs-now cs-now--down" cx="159.6" cy="20" r="1.8" />
      <line className="cs-move cs-move--down" x1="172.6" y1="23" x2="161.7" y2="23"><title>Norway 47.9 to 44.8</title></line><circle className="cs-now cs-now--down" cx="161.7" cy="23" r="1.8" />
      <line className="cs-axis" x1="4" y1="28" x2="356" y2="28" />
      <text x="4.0" y="35" textAnchor="start">0</text>
      <text x="180.0" y="35" textAnchor="middle">50</text>
      <text x="356.0" y="35" textAnchor="end">100</text>
      </svg>
              <h3>How to read a readiness score</h3>
              <p>What a rank movement between editions does and does not tell you, and why a country's
                weakest dimension is usually the more useful number.</p>
            </article>
          </div>
      
        </div>
      </section>
      
      {/* 5 ────────────────────────── LATEST CONVENING ──────────────────────── */}
      <section className="section on-paper">
        <div className="shell">
          <p className="eyebrow">Convenings</p>
          <div className="grid grid--2" style={{ alignItems: "center" }}>
            <div>
              <p className="meta segmented-meta"><span className="segment">2 July 2026</span><span className="segment"> · House of Lords, Westminster</span></p>
              <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.4rem)", marginTop: ".75rem" }}>The Quarter 2 Rankings launch</h2>
              <p>SAPI hosted the release of the Quarter 2 Rankings 2026 in a House of Lords committee room. Fifty nations were scored, and fifteen nations took part.</p>
            </div>
            <figure>
              <img className="event-photo" src="/assets/img/events/2026-07-02/room-wide.jpg" alt="Delegates seated along the committee table in a House of Lords committee room face the head table, where screens show the Quarter 2 Rankings 2026." width="1200" height="675" loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
      
      {/* 6 ────────────────────────── HOW TO WORK WITH ──────────────────────── */}
      <section className="section">
        <div className="shell">
          <p className="eyebrow">How to work with SAPI</p>
          <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.3rem)" }}>Four ways in</h2>
          <p className="lede" style={{ marginBottom: "2.5rem" }}>Each has a different scope, a different output and a
            different decision behind it.</p>
      
          <div className="grid grid--3 grid--services">
            <div className="service">
              <h3>Country assessment</h3>
              <p>A full SAPI assessment of a single nation across the five dimensions and thirty indicators,
                commissioned by the government or a body acting for it.</p>
              <ul className="service__what">
                <li>A scored assessment with every indicator traced to its source and confidence grade</li>
                <li>A gap analysis ranking the highest-leverage interventions</li>
                <li>The private score alongside the published one, and the distance between them</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">Commissioned engagement</span><span className="segment"> · scoped on enquiry</span></p>
            </div>
      
            <div className="service">
              <h3>Investor briefing</h3>
              <p>A working session for capital allocators evaluating national AI infrastructure exposure,
                against the current edition rather than a bespoke assessment.</p>
              <ul className="service__what">
                <li>Cross-country comparison on the dimensions relevant to the mandate</li>
                <li>Where the funded demand sits, and where capital has to arrive first</li>
                <li>Written follow-up covering the questions raised in the room</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">Half day</span><span className="segment"> · fee quoted on enquiry</span></p>
            </div>
      
            <div className="service">
              <h3>Convening participation</h3>
              <p>A seat at a SAPI convening, where national delegations, infrastructure operators and
                sovereign capital work from the same assessment.</p>
              <ul className="service__what">
                <li>Attendance, or a speaking slot for a national delegation</li>
                <li>Chatham House Rule throughout</li>
                <li>Reviewed against institutional mandate and timing</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">By application</span><span className="segment"> · see the convenings calendar</span></p>
            </div>
      
            <div className="service">
              <h3>Defence AI investment read</h3>
              <p><span data-di="">Directed Intelligence</span> applied to defence and national security: which AI investments turn into
                mission value, measured on your own programme data.</p>
              <ul className="service__what">
                <li>Data readiness, model performance, mission value, assurance and the wider portfolio</li>
                <li>Insight from SAPI's work across sectors and nations, never another client's data</li>
                <li>Your organisation is never scored or published on the index</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">Commissioned engagement</span><span className="segment"> · scoped on enquiry</span></p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 7 ───────────────────────── PEOPLE + ENQUIRY ───────────────────────── */}
      <section className="section on-ink">
        <div className="shell">
          <p className="eyebrow">Accountability</p>
          <div className="grid grid--2" style={{ alignItems: "start", gap: "3rem" }}>
            <div>
              <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.3rem)" }}>Who does the assessment</h2>
              <p className="lede">SAPI is an independent UK company.</p>
              <p><a className="link-more" href="/about">Leadership</a></p>
            </div>
            <div>
              <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.3rem)" }}>Talk to us</h2>
              <p className="lede">Tell us the decision you are trying to make.</p>
              <div className="btn-row" style={{ marginTop: "1.5rem" }}>
                <a className="btn btn--primary" href="/contact">Request a briefing</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      </main>    </>
  );
});

export const HomeFooter = memo(function HomeFooter() {
  return (
    <footer className="site-foot">
      <div className="shell">
        <div className="site-foot__grid">
          <div>
            <a className="wordmark" href="/main" style={{ marginBottom: "1rem" }}>
              <span className="wordmark__mark" aria-hidden="true"></span>
              <span className="wordmark__text">The Sovereign<br />AI Power Index</span>
            </a>
            <p style={{ fontSize: ".9rem", maxWidth: "34ch" }}>An independent UK sovereign AI intelligence company.
              Quarter 2 Rankings 2026 published 2 July 2026.</p>
          </div>
          <div>
            <h2>Research</h2>
            <ul>
              <li><a href="/sapi-index">The Index</a></li>
              <li><a href="/methodology">Methodology</a></li>
            </ul>
          </div>
          <div>
            <h2>Organisation</h2>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="https://www.linkedin.com/company/the-sovereign-ai-power-index/">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h2>Enquiries</h2>
            <ul>
              <li><a href="/contact">Request a briefing</a></li>
              <li><a href="/contact">Commission an assessment</a></li>
              <li><a href="/contact">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="site-foot__field" aria-hidden="false">
    <svg className="field-strip field-strip--foot" viewBox="0 0 600 40" preserveAspectRatio="none" role="img" aria-label="Fifty countries placed by composite score on a 0 to 100 axis. Tier lines at 40, 60 and 80. The highest column is South Korea at 59.2; the field mean is 37.8. No column lies beyond 60.">
    <line className="fs-tier" x1="244.8" y1="4" x2="244.8" y2="28" />
    <line className="fs-tier" x1="355.2" y1="4" x2="355.2" y2="28" />
    <line className="fs-tier" x1="465.6" y1="4" x2="465.6" y2="28" />
    <g className="fs-cols">
    <line x1="350.8" y1="28.0" x2="350.8" y2="6.0"><title>South Korea 59.2</title></line>
    <line x1="349.1" y1="28.0" x2="349.1" y2="6.1"><title>United Arab Emirates 58.9</title></line>
    <line x1="345.3" y1="28.0" x2="345.3" y2="6.2"><title>Singapore 58.2</title></line>
    <line x1="341.4" y1="28.0" x2="341.4" y2="6.3"><title>United States 57.5</title></line>
    <line x1="336.4" y1="28.0" x2="336.4" y2="6.4"><title>Estonia 56.6</title></line>
    <line x1="330.9" y1="28.0" x2="330.9" y2="6.6"><title>France 55.6</title></line>
    <line x1="323.2" y1="28.0" x2="323.2" y2="6.8"><title>Saudi Arabia 54.2</title></line>
    <line x1="314.9" y1="28.0" x2="314.9" y2="7.1"><title>Oman 52.7</title></line>
    <line x1="303.3" y1="28.0" x2="303.3" y2="7.4"><title>Japan 50.6</title></line>
    <line x1="293.4" y1="28.0" x2="293.4" y2="7.7"><title>Italy 48.8</title></line>
    <line x1="292.3" y1="28.0" x2="292.3" y2="7.8"><title>Canada 48.6</title></line>
    <line x1="290.6" y1="28.0" x2="290.6" y2="7.8"><title>United Kingdom 48.3</title></line>
    <line x1="280.1" y1="28.0" x2="280.1" y2="8.1"><title>Finland 46.4</title></line>
    <line x1="279.6" y1="28.0" x2="279.6" y2="8.2"><title>Germany 46.3</title></line>
    <line x1="275.7" y1="28.0" x2="275.7" y2="8.3"><title>Australia 45.6</title></line>
    <line x1="273.5" y1="28.0" x2="273.5" y2="8.3"><title>India 45.2</title></line>
    <line x1="271.3" y1="28.0" x2="271.3" y2="8.4"><title>Norway 44.8</title></line>
    <line x1="268.0" y1="28.0" x2="268.0" y2="8.5"><title>Sweden 44.2</title></line>
    <line x1="266.9" y1="28.0" x2="266.9" y2="8.5"><title>Qatar 44.0</title></line>
    <line x1="261.4" y1="28.0" x2="261.4" y2="8.7"><title>Vietnam 43.0</title></line>
    <line x1="253.1" y1="28.0" x2="253.1" y2="9.0"><title>Chile 41.5</title></line>
    <line x1="250.3" y1="28.0" x2="250.3" y2="9.0"><title>Malaysia 41.0</title></line>
    <line x1="245.4" y1="28.0" x2="245.4" y2="9.2"><title>Egypt 40.1</title></line>
    <line x1="244.8" y1="28.0" x2="244.8" y2="9.2"><title>Kazakhstan 40.0</title></line>
    <line x1="242.0" y1="28.0" x2="242.0" y2="9.3"><title>Switzerland 39.5</title></line>
    <line x1="233.8" y1="28.0" x2="233.8" y2="9.5"><title>Brazil 38.0</title></line>
    <line x1="230.4" y1="28.0" x2="230.4" y2="9.6"><title>Türkiye 37.4</title></line>
    <line x1="211.1" y1="28.0" x2="211.1" y2="10.2"><title>Uzbekistan 33.9</title></line>
    <line x1="206.7" y1="28.0" x2="206.7" y2="10.4"><title>New Zealand 33.1</title></line>
    <line x1="204.0" y1="28.0" x2="204.0" y2="10.4"><title>Indonesia 32.6</title></line>
    <line x1="201.7" y1="28.0" x2="201.7" y2="10.5"><title>Bahrain 32.2</title></line>
    <line x1="200.6" y1="28.0" x2="200.6" y2="10.5"><title>Argentina 32.0</title></line>
    <line x1="192.4" y1="28.0" x2="192.4" y2="10.8"><title>Mexico 30.5</title></line>
    <line x1="190.7" y1="28.0" x2="190.7" y2="10.8"><title>Morocco 30.2</title></line>
    <line x1="185.7" y1="28.0" x2="185.7" y2="11.0"><title>Pakistan 29.3</title></line>
    <line x1="184.6" y1="28.0" x2="184.6" y2="11.0"><title>Kenya 29.1</title></line>
    <line x1="183.0" y1="28.0" x2="183.0" y2="11.1"><title>Azerbaijan 28.8</title></line>
    <line x1="175.2" y1="28.0" x2="175.2" y2="11.3"><title>Kuwait 27.4</title></line>
    <line x1="168.1" y1="28.0" x2="168.1" y2="11.5"><title>South Africa 26.1</title></line>
    <line x1="167.0" y1="28.0" x2="167.0" y2="11.6"><title>Rwanda 25.9</title></line>
    <line x1="167.0" y1="28.0" x2="167.0" y2="11.6"><title>Senegal 25.9</title></line>
    <line x1="161.4" y1="28.0" x2="161.4" y2="11.7"><title>Jordan 24.9</title></line>
    <line x1="156.5" y1="28.0" x2="156.5" y2="11.9"><title>Nigeria 24.0</title></line>
    <line x1="153.7" y1="28.0" x2="153.7" y2="12.0"><title>Ghana 23.5</title></line>
    <line x1="150.4" y1="28.0" x2="150.4" y2="12.1"><title>Kyrgyzstan 22.9</title></line>
    <line x1="147.1" y1="28.0" x2="147.1" y2="12.2"><title>Ethiopia 22.3</title></line>
    <line x1="132.2" y1="28.0" x2="132.2" y2="12.6"><title>Tajikistan 19.6</title></line>
    <line x1="131.6" y1="28.0" x2="131.6" y2="12.6"><title>Paraguay 19.5</title></line>
    <line x1="117.3" y1="28.0" x2="117.3" y2="13.1"><title>Iraq 16.9</title></line>
    <line x1="106.2" y1="28.0" x2="106.2" y2="13.4"><title>Turkmenistan 14.9</title></line>
    </g>
    <line className="fs-mean" x1="232.7" y1="6" x2="232.7" y2="32" />
    <line className="fs-tier" style={{ strokeDasharray: "none", opacity: ".5" }} x1="237.6" y1="18" x2="237.6" y2="32" />
    <line className="fs-axis" x1="24" y1="28" x2="576" y2="28" stroke="#241F33" />
    </svg>
    <p>The field, Quarter 2 Rankings 2026 · fifty countries by composite · tier lines at 40, 60 and 80 · the bright tick is the mean, 37.8 · nothing beyond 60</p>
    </div>
        <div className="site-foot__legal">
          <span>© 2026 The Sovereign AI Power Index (SAPI)</span>
        </div>
      </div>
    </footer>  );
});
