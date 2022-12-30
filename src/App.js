import "./App.css";
import { useEffect, useRef, useState } from "react";

function testForBuckets(str) {
  const buckets = ['"', "'", "`"];
  const result = buckets.filter((i) => !str.includes(i));
  // console.log(result);
  return result;
}

function formatString(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/(\r\n|\n|\r)/gm, " ")
    .trim();
}

function getResultData(q, a) {
  const qBuckets = testForBuckets(q);
  const q1 = qBuckets[0] + formatString(q) + qBuckets[0];

  let a1 = "";
  if (a.length === 1) {
    const aBuckets = testForBuckets(a[0].value);
    a1 = aBuckets[0] + formatString(a[0].value) + aBuckets[0];
  } else {
    let result = "[";
    a.map((i, index) => {
      const aBuckets = testForBuckets(i.value);
      if (index === 0) {
        result += aBuckets[0] + formatString(i.value) + aBuckets[0];
      } else {
        result += ", " + aBuckets[0] + formatString(i.value) + aBuckets[0];
      }
    });
    a1 = result + "]";
  }
  return `{
  question: ${q1},
  answer: ${a1},
},
`;
}

// "homepage": "https://cheechqt.github.io/uncle-bens-data",

function App() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ id: 666, value: "" }]);

  let resultRef = useRef("");

  useEffect(() => {
    resultRef.current.value = getResultData(question, answers);
  }, [question, answers]);

  return (
    <div className="flex items-center flex-col bg-cyan-900 h-screen">
      <h1 className="text-3xl font-bold">Uncle Bens Data Converter</h1>
      <h4>Вопрос</h4>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} />
      <h4>Ответ</h4>
      <ul className="flex flex-col w-[80%]">
        {answers.map((item) => {
          return (
            <li className="flex" key={item.id}>
              <input
                className="w-full"
                key={item.id}
                value={item.value}
                onChange={(e) => {
                  const curAnswer = answers.find((a) => a.id === item.id);
                  curAnswer.value = e.target.value;
                  setAnswers([...answers]);
                }}
              />
              <button
                className="bg-yellow-600 px-3 ml-2 rounded-full text-black disabled:hidden"
                disabled={answers.length < 2}
                onClick={() =>
                  setAnswers([...answers.filter((i) => i.id !== item.id)])
                }
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex gap-x-3 mt-3">
        <button
          className="bg-gray-900 hover:bg-yellow-500 hover:text-black font-bold p-3 rounded-2xl"
          onClick={() =>
            setAnswers([...answers, { id: Date.now(), value: "" }])
          }
        >
          Еще один ответ
        </button>
        <button
          className="bg-gray-900 text-red-500 hover:bg-red-500 hover:text-black font-bold p-3 rounded-2xl"
          onClick={() => {
            setQuestion("");
            setAnswers([{ id: Date.now(), value: "" }]);
          }}
        >
          Удалить все
        </button>
      </div>
      <h4>Результат</h4>
      <div className="relative w-[80%]">
        <textarea
          className="text-cyan-900 relative w-full"
          ref={resultRef}
          rows="30"
          readOnly
        ></textarea>
        <button
          className="absolute right-0 top-1 py-1 px-2 bg-gray-900 hover:bg-gray-700 rounded-xl font-bold"
          onClick={() => navigator.clipboard.writeText(resultRef.current.value)}
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default App;
