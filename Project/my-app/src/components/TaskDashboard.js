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

  const [task, setTask] = useState(null); //The task and all it's details
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false); //Modal popup that shows which answers were wrong
  const [showHintModal, setShowHintModal] = useState(false); //Modal popup that shows some hints for the task
  const [inputs, setInputs] = useState(null); //The answers the user has inputted/submitted
  const [submitAnswers, setSubmitAnswers] = useState({ //The outcome of the answers the user has submitted
    success: false,
    correct: 0,
    wrong: 0,
    err: [],
  });

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

  //Answer Verification ------------------------------------------------------------------------------------------------------------------------

  function checkAnswers(){
    if (task.type == "find-the-errors"){
      let numCorrect = 0;
      let errors = [];
      for (let i = 0; i < task.answerLines.length; i++){
        if (inputs[i].lineNum == task.answerLines[i] && inputs[i].correction == task.answers[i]){
          numCorrect++;
        }
        else {
          errors.push ({
            lineNum: inputs[i].lineNum,
            correction: inputs[i].correction,
          })
        }
      }

      if (numCorrect == task.answers.length){        
        const result = {
          success: true,
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }
        
        setSubmitAnswers(result);
      }
      else {
        const result = {
          success: false,
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }

        setSubmitAnswers(result);
        setShowWrongAnswerModal(true);
      }
    }

    if (task.type == "find-in-the-blanks"){
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
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }
        
        setSubmitAnswers(result);
      }
      else {
        const result = {
          success: false,
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
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
      }
  } 

  function displayTaskCompletedCard(){
    if (task != null){
      if (submitAnswers.success){
        return (
          <>
            <h1 class="title2">SUCCESS</h1>
            <Card>
              <Card.Body>
                <Card.Title className="taskDashboard__title">TASK COMPLETED</Card.Title>
                <br />
                <Card.Text>Congradulations, you got all the answers correct</Card.Text>
                <Card.Text>TIME</Card.Text>
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

  function displayTitleCard(){
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
                <Card.Title>Put your answers here:</Card.Title>
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