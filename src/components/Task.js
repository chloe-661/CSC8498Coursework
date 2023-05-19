import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';
import { 
    getCodeSnippet
} from "../codeSnippets";

function Task(props) {
    const [task, setTask] = useState(null);

    useEffect(() => {
        getTask();
    })

    function getTask(){
        props.taskDetails.forEach(t => {
            if (t.id == props.taskId){
                setTask(t);
            }
        })
    }

    function getLanguage(){
        switch (task.language){
            case "HTML":
                return "xml";
            case "CSS":
                return "css";
            case "Javascript":
                return "javascript";
        }
    }

    function formatTask(){
        if (task != null){
            if (task.type == "find-the-errors"){
                const code = getCodeSnippet(task.title);

                return (
                    <>
                        <SyntaxHighlighter  wrapLines={true} 
                                            wrapLongLines={true} 
                                            customStyle={{ 
                                                fontSize: 13.5, 
                                                backgroundColor: 'transparent', 
                                                padding: 0, 
                                                margin: 0 }}
                                            showLineNumbers={true} 
                                            language={getLanguage()} 
                                            style={dracula}
                                            children={code} />
                    </>
                )
            }
            if (task.type == "fill-in-the-blanks"){
                const code = getCodeSnippet(task.title);
                return (
                    <>
                        <SyntaxHighlighter  wrapLines={true} 
                                            wrapLongLines={true} 
                                            lineProps={lineNumber => {
                                                let style = { display: 'block' };
                                                if (task.answerLines.includes(lineNumber)) {
                                                    style.backgroundColor = '#2d3a3aff';
                                                }
                                                return { style };
                                                }} 
                                            customStyle={{ 
                                                fontSize: 13.5, 
                                                backgroundColor: 'transparent', 
                                                padding: 0, 
                                                margin: 0 }}
                                            showLineNumbers={true} 
                                            language={getLanguage()} 
                                            style={dracula}
                                            children={code} />
                    </>
                )
            }
        }
    }   

    function fillInBlanks(){
        // const split = task.content.split(/\\n/);
        let arr = task.content.split(/ (\\t) /);
        return arr;
    }

    return (
        <>
            <Card className="task">
            <Card.Body>
                {formatTask()}
            </Card.Body>
            </Card>
        </>

    );
}

export default Task;