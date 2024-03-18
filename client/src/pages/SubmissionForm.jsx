import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";

function SubmissionForm() {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [stdin, setStdin] = useState("");
  const [code, setCode] = useState("");
  const languageIds = useMemo(
    () => ({
      JavaScript: 63,
      python: 71,
      Java: 62,
      c_cpp: 53,
    }),
    []
  ); // Empty dependency array to ensure it's only computed once

  const [formData, setFormData] = useState({
    username: "",
    language: "",
    stdin: "",
    code: "",
    languageId: languageIds.JavaScript, // Default to JavaScript language ID
  });

  useEffect(() => {
    setFormData({
      username,
      language,
      stdin,
      code,
      languageId: languageIds[language],
    });
  }, [username, language, stdin, code, languageIds]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/submit`,
        formData
      );
      setFormData({
        username: "",
        language: "",
        stdin: "",
        code: "",
        languageId: languageIds.javascript,
      });
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white flex flex-col justify-center items-center gap-2 shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-xl font-bold mb-4">Submit Code Snippet</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block font-semibold text-gray-700 mb-2"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-semibold text-gray-700 mb-2"
              htmlFor="language"
            >
              Preferred Code Language:
            </label>
            <select
              id="language"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="JavaScript">JavaScript</option>
              <option value="python">Python</option>
              <option value="Java">Java</option>
              <option value="c_cpp">C++</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block font-semibold text-gray-700 mb-2"
              htmlFor="stdin"
            >
              Standard Input (stdin):
            </label>
            <textarea
              id="stdin"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4 w-full">
            <label
              className="block font-semibold text-gray-700 mb-2"
              htmlFor="source-code"
            >
              Source Code:
            </label>
            <AceEditor
              mode={language}
              className="w-full border rounded-md focus:outline-none focus:border-blue-500"
              theme="github"
              name="source-code"
              onChange={setCode}
              value={code}
              editorProps={{ $blockScrolling: true }}
              width="100%"
              height="200px"
            />
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            type="submit"
          >
            Submit
          </button>
        </form>
        <Link to="/submissions">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Check Submissions
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SubmissionForm;
