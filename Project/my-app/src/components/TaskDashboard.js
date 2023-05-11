import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';
import QuitWarning from '../components/QuitWarning';
import GoBackWarning from '../components/GoBackWarning';
import TaskDashboardStats from '../components/TaskDashboardStats';
import Task from '../components/Task';
import Answers from '../components/Answers';
import { 
  getTaskLongDescription
} from "../taskLongDescriptions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';
import { 
    getCodeSnippet
} from "../codeSnippets";

function TaskDashboard(props) {

  const [task, setTask] = useState(null);
  const [inputs, setInputs] = useState(null);

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
        console.log("Got all them right")
        return {
          success: true,
          correct: numCorrect,
        }
      }
      else {
        console.log("Got some wrong");
        return {
          sucess: false,
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }
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
        console.log("Got all them right")
        return {
          success: true,
          correct: numCorrect,
        }
      }
      else {
        console.log("Got some wrong");
        return {
          sucess: false,
          correct: numCorrect,
          wrong: errors.length,
          err: errors,
        }
      }
    }
  }


    useEffect(() => {
        getTask();
    })

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

    function formatAnswers(){
      if (task != null){
        if (task.type == "find-the-errors"){
          if (inputs == null) {
            initaliseFormInputs();
          }

          if (inputs != null){
            console.log("inputs:" + inputs[0].lineNum);
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

    function displayTitleCard(){
      if (task != null){
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
      if (task != null){
        return (
          <TaskDashboardStats title="DESCRIPTION" originalTaskId={task.taskId} />
        )
      }
    }

    function displayInfoCard(){
      if (task != null){
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
          // <TaskDashboardStats description={<>Type: &nbsp; {task.type} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Language: &nbsp; {task.language} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Role: &nbsp; {task.role}</>}/>
        )
      }
    }

  return (
    <>
      <div class="taskDashboard grid-container">
        <div class="grid-item__name">
            {/* <TaskDashboardStats extraClass="taskDashboard__title" title={task.title} /> */}
            {displayTitleCard()}
        </div>
        <div class="grid-item__description">
          {/* <TaskDashboardStats title="DESCRIPTION" originalTaskId={task.taskId} /> */}
          {displayDescriptionCard()}
        </div>
        <div class="grid-item__task">
          <Card className="task">
            <Card.Body>
                {formatTask()}
            </Card.Body>
          </Card>
          {/* <Task taskDetails={props.taskDetails} taskId={props.taskId}/> */}
          {/* <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/> */}
        </div>
        <div class="grid-item__answers">
          {/* <Answers taskDetails={props.taskDetails} taskId={props.taskId}/> */}
          {/* <UserRole description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl"/> */}
          <Card className="answers">
            <Card.Body>
                <Card.Title>Put your answers here:</Card.Title>
                <Card.Text>
                  <form>
                    {task ? formatAnswers() : <p>TESTING</p>}
                  </form>
                </Card.Text>
            </Card.Body>
            </Card>
        </div>
        <div class="grid-item__info">
          {/* <TaskDashboardStats description={<>Type: &nbsp; {task.type} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Language: &nbsp; {task.language} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Role: &nbsp; {task.role}</>}/> */}
          {displayInfoCard()}
        </div>
        <div class="grid-item__button">
          <Button className="btn-hint" >Hint?</Button>
          <Button className="btn-back" onClick={props.onShowQuitWarning}>Quit</Button>
          <Button className="btn-back" onClick={props.onShowGoBackWarning}>Go Back</Button>
          <Button onClick={handleSubmit}>Submit</Button>
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
    </>
  );
}

export default TaskDashboard;