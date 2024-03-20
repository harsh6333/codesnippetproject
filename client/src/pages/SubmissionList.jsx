import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";

import ace from "ace-builds";
ace.config.set("basePath", "node_modules/ace-builds/src-noconflict");

function SubmissionList() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/submissions`
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="flex flex-col  container mx-auto mt-8 w-full gap-4 justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Submitted Entries</h2>
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Language</th>
              <th className="px-4 py-2 border">Stdin</th>
              <th className="px-4 py-2 border">Source Code</th>
              <th className="px-4 py-2 border">Output</th> {/* New column */}
              <th className="px-4 py-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="px-4 py-2 border">{submission.username}</td>
                <td className="px-4 py-2 border">{submission.language}</td>
                <td className="px-4 py-2 border">{submission.stdin}</td>
                <td className="px-4 py-2 border">
                  <AceEditor
                    mode={submission.language}
                    theme="github"
                    value={submission.code.substring(0, 100)}
                    readOnly={true}
                    width="300px"
                    height="100px"
                  />
                </td>
                <td className="px-4 py-2 border">{submission.output}</td>{" "}
                {/* Display output */}
                <td className="px-4 py-2 border">{submission.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Submit New Code
        </button>
      </Link>
    </div>
  );
}

export default SubmissionList;
