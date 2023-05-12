import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function WrongAnswerModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-wrongAnswer"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          OOPS!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Some of your answers are wrong</h4>
        <p className="listP">Correct: {props.errors.correct} &nbsp;&nbsp;&nbsp; Wrong: {props.errors.wrong}</p>
        <p>Go back and see if you can figure it out.</p>
        <hr />
        <p className="bold">Below are the answers you got wrong:</p>
        {props.errors.err.map(({ lineNum, correction }, index) => (
                    <p className="listP" key={index}>Line Number: {lineNum} &nbsp;&nbsp;&nbsp; Answer: {correction}</p>
        ))}
        <hr />
        <p className=" greenText listP bold"><u>Note:</u></p>
        <p className=" greenText listP"><i>- Check that there are no unnecessary spaces in your answer</i></p>
        <p className=" greenText listP"><i>- You don't need to include the symbol at the end of the line if you're doing a task that involves finding and correcting the errors, unless that is the error. For example, write "10px" NOT "10px;" but if a line is missing the ";", then ";" alone is your answer</i></p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="closeButton__text" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WrongAnswerModal