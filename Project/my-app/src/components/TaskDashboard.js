//Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

//React-Syntax-Highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

//Components
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import GoBackWarning from '../components/GoBackWarning';
import TaskDashboardStats from '../components/TaskDashboardStats';
import WrongAnswerModal from './wrongAnswerModal';
import HintModal from './HintModal';

//Text
import { getCodeSnippet } from "../codeSnippets";

//Hooks
import { useState, useEffect } from 'react';

//Database
import { completeTaskInDb } from "../firebase";

function TaskDashboard(props) {

  //State ------------------------------------------------------------------------------------------------------------------------

  const [task, setTask] = useState(null);                                     //The task and all it's details
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);    //Modal popup that shows which answers were wrong
  const [showHintModal, setShowHintModal] = useState(false);                  //Modal popup that shows some hints for the task
  const [inputs, setInputs] = useState(null);                                 //The answers the user has inputted/submitted
  const [submitAnswers, setSubmitAnswers] = useState({                        //The outcome of the answers the user has submitted
    success: false,
    taskType: " ",
    correct: 0,
    wrong: 0,
    err: [],
  });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

          //For the type-the-code tasks
  const [codeLines, setCodeLines] = useState([])
  const [numCodeLines, setNumCodeLine] = useState(0);
  const [completedCodeLines, setCompletedCodeLines] = useState (["...", "...", "..."])
  const [currInput, setCurrInput] = useState("")
  const [currLineIndex, setCurrLineIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState("")

  //Hooks ------------------------------------------------------------------------------------------------------------------------
  
  useEffect(() => {
    getTask();
  })

  //Event Handlers ------------------------------------------------------------------------------------------------------------------------

  const handleChange = (value, index, type) => {
    const values = [...inputs];
    if (type == "lineNum"){
      values[index].lineNum = value;
    }
    else if (type == "correction") {
      values[index].correction = value;
    }
    setInputs(values);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkAnswers();
  }

  const handleCompleted = async (event) => {
    event.preventDefault();
    const result = await completeTaskInDb(props.sessionDetails.sessionId, props.taskId);

    if (result.success){
      props.onGoBack(props.taskId);
    }
  }

  function handleKeyDown(e) {
    // enter 
    if (e.keyCode === 13){
      console.log("Enter was pressed")
      e.preventDefault();

      checkMatch()
      setCurrInput("")
      setCurrCharIndex(-1)
    }
    // backspace
    else if (e.keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar("")
    } 
    else if (e.shiftKey && e.keyCode !== 16) {
      setCurrCharIndex(currCharIndex + 1)
      setCurrChar(e.key)
    }
    else if (!e.shiftKey){
      setCurrCharIndex(currCharIndex + 1)
      setCurrChar(e.key)
    }
  }

  function deleteOnPaste(e){
    e.preventDefault()
    setCurrInput("");
    setCurrCharIndex(-1);
    return false;
  }

  function resetAll(){
    splitCodeIntoLines();
    setCompletedCodeLines(["...", "...", "...", "..."]);
    setCurrInput("");
    setCurrLineIndex(0);
    setCurrCharIndex(-1);
    setCurrChar("");
  
  }

  function resetLine(){
    setCurrInput("");
    setCurrCharIndex(-1);
    setCurrChar("");
  }

  //Initalisations ------------------------------------------------------------------------------------------------------------------------

  function initaliseFormInputs(){
    let arr = []
    task.answerLines.forEach(item => {
      arr.push({
        lineNum: "",
        correction: "",
      })
    })
    setInputs(arr);
  }

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

  function splitCodeIntoLines(){
    const code = getCodeSnippet(`${task.title}__2`);
    const result = code.split(/\r?\n/);
    setCodeLines(result);
    setNumCodeLine(result.length);
    // setCodeWords(result);
    // console.log(r[3]);
  }

  //Functionality ------------------------------------------------------------------------------------------------------------------------

  function startTimer() {
    const time = Date.now();
    setStartTime(time);
  }

  function stopTimer(){
   const time = Date.now();
   setEndTime(time) ;
  }

  function formatTime(){
    const timeInMilliseconds = getTimeDurationInMilliseconds(startTime, endTime);
    const timeFormatted = convertMillisecondsToMinutesAndSeconds(timeInMilliseconds);
    return timeFormatted;
  }

  function convertMillisecondsToMinutesAndSeconds(milliseconds){
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
  }

  function getTimeDurationInMilliseconds(start, end){
      return (end - start);
  }

  function checkMatch() {
    const lineToCompare = codeLines[0]
    const doesItMatch = lineToCompare === currInput.trim()
    if (doesItMatch) {
      const tempArr = [...codeLines]
      const element = tempArr.shift();

      const tempArr2 = [...completedCodeLines]
      tempArr2.shift();
      tempArr2.push(element);

      setCodeLines(tempArr);
      setCompletedCodeLines(tempArr2);
      setCurrLineIndex(currLineIndex + 1);
    } else {
      console.log("incorrect");
    }
  }

  function getCharClass(lineIdx, charIdx, char) {
    if (charIdx === currCharIndex+1){
      return 'codeChar__current'
    }
    if (lineIdx === 0 && charIdx === currCharIndex && currChar) {
      if (char === currChar) {
        return 'codeChar__success'
      } else {
        return 'codeChar__error'
      }
    } else if (lineIdx === 0 && currCharIndex >= codeLines[0].length) {
      return 'codeChar__error'
    } else {
      return ''
    }
  }

  //Answer Verification ------------------------------------------------------------------------------------------------------------------------

  function checkAnswers(){
    if (task.type == "find-the-errors"){
      let numCorrect = 0;
      let errors = [];
      for (let i = 0; i < task.answerLines.length; i++){
        let found = false;
        for (let j = 0; j < task.answerLines.length; j++){
          if (inputs[i].lineNum == task.answerLines[j]){
            if (inputs[i].correction == task.answers[j]){
              numCorrect++;
              found = true;
              break;
            }
          }
        }

        if (!found){
          errors.push ({
            lineNum: inputs[i].lineNum,
            correction: inputs[i].correction,
          })
        }
      }

      if (numCorrect == task.answers.length){        
        const result = {
          success: true,
          taskType: "find-the-errors",
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }
        
        setSubmitAnswers(result);
      }
      else {
        const result = {
          success: false,
          taskType: "find-the-errors",
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }

        setSubmitAnswers(result);
        setShowWrongAnswerModal(true);
      }
    }

    if (task.type == "fill-in-the-blanks"){
      let numCorrect = 0;
      let errors = [];
      for (let i = 0; i < task.answerLines.length; i++){
        if (inputs[i].correction == task.answers[i]){
          numCorrect++;
        }
        else {
          errors.push ({
            lineNum: task.answerLines[i],
            correction: inputs[i].correction,
          })
        }
      }

      if (numCorrect == task.answers.length){        
        const result = {
          success: true,
          taskType: "fill-in-the-blanks",
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }
        
        setSubmitAnswers(result);
      }
      else {
        const result = {
          success: false,
          taskType: "fill-in-the-blanks",
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }

        setSubmitAnswers(result);
        setShowWrongAnswerModal(true);
      }
    }

    if (task.type == "type-the-code"){
      if (currLineIndex >= numCodeLines){
        const result = {
          success: true,
          taskType: "type-the-code",
          correct: 0,
          wrong: 0,
          err: [],
        }
        setSubmitAnswers(result);
      }
      else {
        const result = {
          success: false,
          taskType: "type-the-code",
          correct: [],
          wrong: [],
          err: [],
        }
        setSubmitAnswers(result);
        setShowWrongAnswerModal(true);
      }
    }
  }

  //Formatting & Display -----------------------------------------------------------------------------------------------------------------------

  function formatAnswers(){
    if (task != null && submitAnswers.success == false){
      if (task.type == "find-the-errors"){
        if (inputs == null) {
          initaliseFormInputs();
        }

        if (inputs != null){
          return (
            <>
              <hr />
              {task.answerLines.map((item, index) => (
                <>
                <div className="answersForm-container" key={index}>
                  <div className="grid-container">
                    <label className="grid-item__text">Line Number:</label>
                    <input className="grid-item__input" type="text"  value={inputs[index].lineNum || ""} onChange={(e) => handleChange(e.target.value, index, "lineNum")} required></input>
                  </div>
                  <div className="grid-container">
                    <label className="grid-item__text">Correction:</label>
                    <input className="grid-item__input" type="text" value={inputs[index].correction} onChange={(e) => handleChange(e.target.value, index, "correction")} required></input>
                  </div>
                  <hr />
                </div>
                </>
              ))}
            </>
          )
        }
      }
      if (task.type == "fill-in-the-blanks"){
        if (inputs == null) {
          initaliseFormInputs();
        }

        if (inputs != null){
          return (
            <>
              <hr />
              {task.answerLines.map((item, index) => (
                <>
                <div className="answersForm-container">
                  <div className="grid-container">
                    <label className="grid-item__text" >Line {item}:</label>
                    <input className="grid-item__input" type="text" value={inputs[index].correction} onChange={(e) => handleChange(e.target.value, index, "correction")} required></input>
                  </div>
                  <hr />
                </div>
                </>
              ))}
            </>
          )
        }
      }
      if (task.type == "type-the-code"){
        if (codeLines.length == 0 && currLineIndex == 0){
          splitCodeIntoLines();
        }
        if (codeLines.length > 0 || numCodeLines == currLineIndex){
          return (
            <>
            <br />
              <div>
                {completedCodeLines.map((line, index) => (
                    <p className="codeLine codeLine__completed greenText listP" key={index}>
                      {line}
                    </p>
                  ))}
              </div>

              <div className="answersForm-container">
                <hr />
                <div className="grid-container">
                  <label className="grid-item__text" >Start Typing...</label>
                  <input className="grid-item__input" type="text" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)} onPaste={deleteOnPaste} autocomplete="off"/>
                </div>
                <hr />
                <div className="task-reset">
                  <Button className="reset__small" onClick={resetAll}>Reset All</Button>
                  <Button className="reset__small" onClick={resetLine}>Reset Current Line</Button>  
                  </div>
                <hr />
              </div>

              <div>
                {codeLines.slice(0,4).map((line, index) => (
                    <p className={`codeLine ${index == 0 ? "codeLine__first" : "codeLine__onwards"}`} key={index}>
                      <span>
                        {line.split("").map((char, idx) => (
                            <span className={getCharClass(index, idx, char)} key={idx}>{char}</span>
                          )) }
                      </span>
                    </p>
                  ))}
              </div>
              {checkIfAllTyped()}
            </>
          )
        }
      }
    }
  }

  function checkIfAllTyped(){
    if (currLineIndex >= numCodeLines){
      return (
        <>
        <div style={{textAlign: "center"}}>
          <p>Congrats</p>
          <p>You have typed it all correctly</p> 
          <br />
          <p>PRESS SUBMIT TO CONTINUE</p>
          </div> 
        </>
      )
    }
    
  }

  function formatTask(){
      if (task != null && submitAnswers.success == false){
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
          if (task.type == "type-the-code"){
            const code = getCodeSnippet(`${task.title}__1`);

            return (
                <>
                    <SyntaxHighlighter  wrapLines={true} 
                                        wrapLongLines={true}
                                        lineProps={lineNumber => {
                                          let style = { display: 'block' };
                                          if (lineNumber == currLineIndex+1) {
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

  function displayTaskCompletedCard(){
    if (task != null){
      if (submitAnswers.success){
        if (endTime == null){
          stopTimer();
        }
        else {
          return (
            <>
              <h1 class="title2">SUCCESS</h1>
              <Card>
                <Card.Body>
                  <Card.Title className="taskDashboard__title">TASK COMPLETED</Card.Title>
                  <br />
                  <Card.Text>Congradulations, you got all the answers correct</Card.Text>
                  <Card.Text>{formatTime()}</Card.Text>
                  <hr />
                  <Card.Text>Type: &nbsp; {task.type} </Card.Text>
                  <Card.Text>Language: &nbsp; {task.language} </Card.Text>
                  <Card.Text>Role: &nbsp; {task.role}</Card.Text>
                  <Button onClick={handleCompleted}>Continue</Button>
                </Card.Body>
              </Card>
            </>
          )
        }
      }
    }
  }

  function displayTitleCard(){
    if (startTime == null){
      startTimer();
    }
    if (task != null && submitAnswers.success == false){
      return (
        <>
          <Card className="taskDashboardStats">
            <Card.Body>
              <Card.Title className="taskDashboard__title">{task.title}</Card.Title>
            </Card.Body>
          </Card>
        </>
      )
    }
  }

  function displayDescriptionCard(){
    if (task != null && submitAnswers.success == false){
      return (
        <TaskDashboardStats title="DESCRIPTION" originalTaskId={task.taskId} />
      )
    }
  }

  function displayInfoCard(){
    if (task != null && submitAnswers.success == false){
      return (
        <>
          <Card className="taskDashboardStats">
          <Card.Body>
            <Card.Title></Card.Title>
              <Card.Text>
              {<>Type: &nbsp; {task.type} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Language: &nbsp; {task.language} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Role: &nbsp; {task.role}</>}
              </Card.Text>
          </Card.Body>
          </Card>
        </>
      )
    }
  }

  function displayTaskCard(){
    if (task != null && submitAnswers.success == false){
      return (
        <>
          <Card className="task">
            <Card.Body>
                {formatTask()}
            </Card.Body>
          </Card>
        </>
      )
    }
  }

  function displayAnswerCard(){
    if (task != null && submitAnswers.success == false){
      return (
        <>
          <Card className="answers">
            <Card.Body>
                <Card.Title>Answers:</Card.Title>
                <Card.Text>
                  <form>
                    {task ? formatAnswers() : <p>Loading...</p>}
                  </form>
                </Card.Text>
            </Card.Body>
          </Card>
        </>
      )
    }
  }

  function displayButtons(){
    if (task != null && submitAnswers.success == false){
      return (
        <>
          <Button className="btn-hint" onClick={() => setShowHintModal(true)}>Hint?</Button>
          <Button className="btn-back" onClick={props.onShowQuitWarning}>Quit</Button>
          <Button className="btn-back" onClick={props.onShowGoBackWarning}>Go Back</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      )
    }
  }

//Render ---------------------------------------------------------------------------------------------------------------------------

  return (
    <>
    {displayTaskCompletedCard()}    
      <div class="taskDashboard grid-container">
        <div class="grid-item__name">
            {displayTitleCard()}
        </div>
        <div class="grid-item__description">
          {displayDescriptionCard()}
        </div>
        <div class="grid-item__task">
          {displayTaskCard()}
        </div>
        <div class="grid-item__answers">
          {displayAnswerCard()}
        </div>
        <div class="grid-item__info">
          {displayInfoCard()}
        </div>
        <div class="grid-item__button">
          {displayButtons()}
        </div>
      </div>
      <Instructions
        show={props.showInstructions}
        onHide={props.onHideIntructions}
        />
      <QuitWarning 
        show={props.showQuitWarning}
        onHide={props.onHideQuitWarning}
        onQuit={props.onQuit}
        />
      <GoBackWarning 
        show={props.showGoBackWarning}
        onHide={props.onHideGoBackWarning}
        onGoBack={props.onGoBack}
        taskId={props.taskId}
        />
      <WrongAnswerModal 
        show={showWrongAnswerModal}
        onHide={() => setShowWrongAnswerModal(false)}
        errors={submitAnswers}
        />
      <HintModal 
        show={showHintModal}
        onHide={() => setShowHintModal(false)}
        hints={task != null ? task.hints : []}
        />
    </>
  );
}

export default TaskDashboard;