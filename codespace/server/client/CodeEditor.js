import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = () => {
        const [htmlCode, setHtmlCode] = useState("<h1>Hello, World!</h1>");
        const [cssCode, setCssCode] = useState("body { background-color: lightblue; }");
        const [jsCode, setJsCode] = useState("console.log('Hello from JavaScript');");
        const [errors, setErrors] = useState("");
        const [projects, setProjects] = useState([]);

        useEffect(() => {
            axios.get("http://localhost:5000/projects").then((response) => {
                setProjects(response.data);
            });
        }, []);

        const getPreview = () => {
            return `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
        };

        const handleDebug = async() => {
            try {
                const response = await axios.post("http://localhost:5000/debug", {
                    html: htmlCode,
                    css: cssCode,
                    js: jsCode,
                });
                setErrors(response.data.errors);
            } catch (error) {
                console.error("Error debugging code", error);
            }
        };

        const handleSave = async() => {
            try {
                await axios.post("http://localhost:5000/save", {
                    html: htmlCode,
                    css: cssCode,
                    js: jsCode,
                });
                alert("Project saved successfully!");
            } catch (error) {
                console.error("Error saving project", error);
            }
        };

        return ( <
            div style = {
                { display: "flex", flexDirection: "column", height: "100vh", padding: "10px" } } >
            <
            h2 style = {
                { textAlign: "center", color: "#fff", background: "#007BFF", padding: "10px", borderRadius: "5px" } } > Docs File Editor < /h2> <
            div style = {
                { display: "flex", height: "50vh" } } >
            <
            Editor height = "100%"
            language = "html"
            theme = "vs-dark"
            value = { htmlCode }
            onChange = { setHtmlCode }
            /> <
            Editor height = "100%"
            language = "css"
            theme = "vs-dark"
            value = { cssCode }
            onChange = { setCssCode }
            /> <
            Editor height = "100%"
            language = "javascript"
            theme = "vs-dark"
            value = { jsCode }
            onChange = { setJsCode }
            /> <
            /div> <
            div style = {
                { display: "flex", gap: "10px", margin: "10px 0" } } >
            <
            button onClick = { handleDebug }
            style = {
                { padding: "10px", background: "#007BFF", color: "white", border: "none", cursor: "pointer" } } > Debug Code < /button> <
            button onClick = { handleSave }
            style = {
                { padding: "10px", background: "#28A745", color: "white", border: "none", cursor: "pointer" } } > Save Project < /button> <
            /div> {
                errors && < pre style = {
                        { color: "red", background: "#fff", padding: "10px", borderRadius: "5px" } } > { errors } < /pre>} <
                    iframe
                srcDoc = { getPreview() }
                title = "Output"
                style = {
                    { width: "100%", height: "50vh", border: "1px solid #ddd", marginTop: "10px" } }
                /> <
                div style = {
                        { marginTop: "20px" } } >
                    <
                    h3 > Saved Projects < /h3> <
                    ul > {
                        projects.map((project, index) => ( <
                            li key = { index } > Project { index + 1 } < /li>
                        ))
                    } <
                    /ul> <
                    /div> <
                    /div>
            );
        };

        export default CodeEditor;