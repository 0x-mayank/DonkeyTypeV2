import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { api } from "../utils/api";

const WORDS = [
  "area","baby","back","ball","bank","base","bill","body","book","call","card","care","case","cash","city","club","coat","code","cold","cost","date","deal","door","duty","east","edge","face","fact","farm","fast",
  "fear","feel","file","film","fire","firm","fish","food","foot","form","free","full","fund","game","girl","give","goal","gold","good","hair","about","above","actor","acute","admit","adopt","adult","after","again","agent",
  "agree","ahead","alarm","album","alert","alive","allow","alone","along","alter","angle","angry","apart","apple","apply","arena","argue","arise","array","aside","asset","audio","audit","avoid","award","aware","basic","basis","beach","began",
  "begin","being","below","bench","birth","black","blame","blind","block","blood","abroad","accept","access","across","acting","action","active","actual","advice","advise","affect","afford","afraid","agency","agenda","almost","always","amount","animal","annual",
  "answer","anyone","anyway","appeal","appear","around","arrive","artist","aspect","assess","assist","assume","attack","attend","author","avenue","backed","barely","battle","beauty","became","become","before","behalf","behind","belief","belong","better","beyond","bishop",
];

function makeWords(count){
  const arr = new Array(count);
  for (let i = 0; i < count; i++){
     arr[i] = WORDS[Math.floor(Math.random()* WORDS.length)];
  }
  return arr;
}

export default function TypingBox({ duration = 20 }) {
  const words = useRef(makeWords(100));
  const [idx, setIdx] = useState(0);                 
  const [committed, setCommitted] = useState([]);    
  const [buffer, setBuffer] = useState("");          
  const [started, setStarted] = useState(false);
   const [timeLeft, setTimeLeft] = useState(duration);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [isFocused, setIsFocused] = useState(true);

   const inputRef = useRef(null);
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const wordRefs = useRef([]);
  const caretRef = useRef(null);
  const timerRef = useRef(null);
  
  useEffect(() => {
    inputRef.current?.focus();
    setIsFocused(document.activeElement === inputRef.current);
  }, []);

  useEffect(() => {
    function onGlobalKey(e) {
      if (e.key !== "Tab") return;
      const active = document.activeElement;
      const isOurHiddenInput = active === inputRef.current;
      const isBodyFocused = active === document.body || active === document.documentElement;
      if (!isOurHiddenInput && !isBodyFocused) return;
      e.preventDefault();
      restart();
    }
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0){
      finalize();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft, finished]);

  const computedFinalWpm = (totalCorrect) => Math.round((totalCorrect/4)/(duration/60));
  const computedFinalAcc = (totalCorrect, totalIncorrect) =>
    totalCorrect + totalIncorrect > 0 ? Math.round((totalCorrect/(totalCorrect+totalIncorrect))* 100) : 0;

  async function sendResultToBackend(payload){
    try {
      const data = await api.post("/result/submit", payload); 
      return { ok: true, data };
    } catch (err) {
      console.error("Save failed:", err);
      return { ok: false, error: err };
    }
  }

  function ensureStarted() {
    if (started) return;
    setStarted(true);
    setTimeLeft(duration);
  }

  function finalize(){
    const bufferTrim = (buffer || "").trim();
    let bufC = 0, bufIC = 0;

    if (bufferTrim.length > 0) {
      const expected = words.current[idx] || "";
      const minl = Math.min(bufferTrim.length, expected.length);
      for (let i = 0; i < minl; i++) {
        if (bufferTrim[i] === expected[i]) bufC++; else bufIC++;
      }
      if (bufferTrim.length > expected.length) bufIC += bufferTrim.length - expected.length;
      else if (expected.length > bufferTrim.length) bufIC += expected.length - bufferTrim.length;
    }

    const totalCorrect = correctChars + bufC;
    const totalIncorrect = incorrectChars + bufIC;

    const wpm = computedFinalWpm(totalCorrect);
    const acc = computedFinalAcc(totalCorrect, totalIncorrect);

    const correctWordsCount = computeCorrectWordsCount(committed, words.current);

    const rawChars = totalCorrect + totalIncorrect;
    const durationSec = duration;

    const resultObj = {
      wpm,
      accuracy: acc,
      correctChars: totalCorrect,
      incorrectChars: totalIncorrect,
      correctWords: correctWordsCount,
      rawChars,
      durationSec,
      timestamp: new Date().toISOString(),
    };

    setFinalResult({
      wpm,
      accuracy: acc,
      correctChars: totalCorrect,
      incorrectChars: totalIncorrect,
    });

    setFinished(true);

    sendResultToBackend({
      wpm,
      accuracy: acc,
      rawChars,
      correctWords: correctWordsCount,
      durationSec,
      timestamp: resultObj.timestamp,
    });
  }

  function computeCorrectWordsCount(committedArr, wordsArr){
    let count = 0;
    for (let i = 0; i < committedArr.length; i++) {
      const typedWord = committedArr[i] || "";
      const expected = wordsArr[i] || "";
      if (typedWord === expected) count++;
    }
    return count;
  }

  function restart(){
    words.current = makeWords(100);
    setIdx(0);
    setCommitted([]);
    setBuffer("");
    setStarted(false);
    setTimeLeft(duration);
    setCorrectChars(0);
    setIncorrectChars(0);
    setFinished(false);
    setFinalResult(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
      setIsFocused(true);
    }
  }

  function commit(wordText) {
    const expected = words.current[idx] || "";
    let c = 0, ic = 0;
    const minl = Math.min(wordText.length, expected.length);
    for (let i = 0; i < minl; i++) {
      if (wordText[i] === expected[i]) c++; else ic++;
    }
    
    if (wordText.length > expected.length) ic += wordText.length - expected.length;
    else if (expected.length > wordText.length) ic += expected.length - wordText.length;

    setCorrectChars((v) => v + c);
    setIncorrectChars((v) => v + ic);
    setCommitted((s) => [...s, wordText]);
    setIdx((i) => i + 1);
    setBuffer("");
  }

  function onChange(e) {
    const v = e.target.value;
    if (!started && v.length > 0) {
      ensureStarted();
    }
    setBuffer(v.replace(/\s+/g, " "));
  }

  function onKeyDown(e) {
    if (finished) {
      if (e.key === "Tab") { e.preventDefault(); restart(); }
      return;
    }
    if (!started && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      ensureStarted();
    }

    if (e.key === " ") {
      e.preventDefault();
      commit(buffer.trim()); 
      if (inputRef.current) inputRef.current.value = "";
    }else if (e.key === "Backspace") {}
    else if (e.key === "Tab") {
      e.preventDefault();
      restart();
    }
  }

  function handleFocus() { setIsFocused(true); }
  function handleBlur() {
    setTimeout(() => {
      setIsFocused(document.activeElement === inputRef.current);
    }, 0);
  }

  useLayoutEffect(() => {
    const caret = caretRef.current;
    const container = viewportRef.current;
    const content = contentRef.current;
    if (!caret || !container || !content) return;

    const el = wordRefs.current[idx];
    if (!el) {
      caret.style.opacity ="0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const wordRect = el.getBoundingClientRect();

    const charSpans = el.querySelectorAll("span.char, span.char-extra");
    let leftOffset = 0;
    
    const typedLen = Math.min(buffer.length, charSpans.length);
    for (let i = 0; i < typedLen; i++) {
      const cs = charSpans[i];
      leftOffset += cs ? cs.offsetWidth + parseFloat(getComputedStyle(cs).marginRight || 0) : 0;
    }

    const caretLeft = (wordRect.left - containerRect.left) + leftOffset + 2 + container.scrollLeft;
    const caretTop = (wordRect.top - containerRect.top) + (wordRect.height/2) - (caret.offsetHeight/2) + container.scrollTop;

    caret.style.transform = `translate(${Math.round(caretLeft)}px, ${Math.round(caretTop)}px)`;
    caret.style.opacity = "1";

    const target = el.offsetTop - (container.clientHeight/2) + (el.clientHeight/2);
    container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [idx, buffer, isFocused]);

  return (
    <div className="w-full pt-[22vh] pb-[8vh]">
      <div className="mb-3">
        <div className="text-center">
          <div className="text-red-500">{timeLeft}s</div>
        </div>
      </div>

      {!finished ? (
        <>
          <div className="w-[90%] h-30 overflow-hidden m-auto relative"
            ref={viewportRef}
            onClick={() => { inputRef.current?.focus();}}
          >
            <div className="absolute w-0.5 h-8 bg-[#3A2B21] border-r-2 opacity-0 z-5"
              ref={caretRef}
              aria-hidden
              style={{
                transform: "translate(-9999px, -9999px)",
                transition: "transform 80ms linear",
                animation: "tt-blink 1s steps(1) infinite",
              }}
            />
            <div
              ref={contentRef}
              style={{
                filter: !isFocused ? "blur(2px) brightness(0.96)" : "none",
                transition: "filter .18s ease",
              }}
            >
              <div className="text-4xl text-gray-400 px-3 font-textbox whitespace-normal "
                style={{
                  lineHeight: "2.3rem",
                  wordSpacing: 12,
                }}
              >
                {words.current.map((word, i) => {
                  const isCommitted = i < committed.length;
                  const isCurrent = i=== idx;
                  const typed = committed[i] || "";

                  return (
                    <span className="inline-block mr-3"
                      key={i}
                      ref={(el) => (wordRefs.current[i] = el)}
                      style={{verticalAlign: "middle",whiteSpace: "nowrap"}}
                    >
                      {word.split("").map((ch, ci) => {
                        let color = "#7f8588";
                        if (isCommitted) {
                          const t = typed[ci] || "";
                          if (t === ch) color = "#50c878";
                          else color = "#ff9b9b";
                        } else if(isCurrent){
                          const t= buffer[ci] || "";
                          if (t=== "") color = "#7f8588";
                          else if (t=== ch) { color = "#50c878"; }
                          else { color = "#ffb7b7"; }
                        }
                        return (
                          <span
                            key={`${i}-${ci}`}
                            className="char inline-block min-w-[0.45rem] px-0.5 mr-0.5"
                            style={{
                              color,
                              borderRadius: 3,
                            }}
                          >
                            {ch}
                          </span>
                        );
                      })}

                      {isCurrent && buffer.length > word.length && buffer.slice(word.length).split("").map((ch, exi) => (
                            <span
                              key={`ex${exi}`}
                              className="char-extra inline-block px-0.5 mr-0.5 rounded-[3px]"
                              style={{
                                color: "#ca4754", 
                                backgroundColor: "rgba(202, 71, 84, 0.2)"
                              }}
                            >
                              {ch}
                            </span>
                          ))
                       }
                       {isCommitted && typed.length > word.length && typed.slice(word.length).split("").map((ch, exi) => (
                            <span
                              key={`cex${exi}`}
                              className="inline-block px-0.5 mr-0.5 rounded-[3]"
                              style={{
                                color: "#ca4754", 
                                backgroundColor: "rgba(202, 71, 84, 0.2)"
                              }}
                            >
                              {ch}
                            </span>
                          ))
                       }
                      <span className="inline-block w-[0.4em]">&nbsp;</span>
                    </span>
                  );
                })}
              </div>
            </div>
            {!isFocused && (
              <div
                onClick={() => {
                  inputRef.current?.focus();
                  setIsFocused(true);
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-text z-10"
              >
                <div className="py-2 px-3.5 rounded-xl bg-white text-gray-600 font-semibold">
                  Click to focus
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-[90%] max-w-[1200] m-auto text-center py-8 px-4 text-[#f76f53]">
          <div className="text-3xl font-bold mb-8">Test Complete!</div>

          {finalResult && (
            <>
              <div className="flex justify-center gap-10 mt-5 flex-wrap">
                <div>
                  <div className="text-[12px] text-gray-500">WPM</div>
                  <div className="text-[36px] font-bold">{finalResult.wpm}</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500">Accuracy</div>
                  <div className="text-[36px] font-bold">{finalResult.accuracy}%</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500">Characters</div>
                  <div className="text-[36px] font-bold">
                    {finalResult.correctChars}/{finalResult.correctChars + finalResult.incorrectChars}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="py-2.5 px-5 bg-gray-800 text-white font-semibold rounded-xl"
                  onClick={restart}
                >
                  Try Again
                </button>
                <div className="mt-2 text-gray-500 text-[12px]">or press Tab</div>
              </div>
            </>
          )}
        </div>
      )}

      {!finished && <div className="text-center mt-4.5 text-gray-500 text-[12px]">Press Tab to restart</div>}
      <input
        className="absolute left-[-9999] opacity-0"
        ref={inputRef}
        autoFocus
        disabled={finished}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}