import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ReasonsLocked(props) {

  function displayReason(){
    if (props.reasons != "") {
      if (props.reasons.tasks.length > 0){
        return (
          <>
            {props.reasons.tasks.map(({name}, index) => (
              <p key={index} className="listP"><span className="bold">Name:&nbsp;</span> {name}</p>
            ))}
            <hr />
            <p>If these tasks aren't on your list, then someone else in your group needs to do them</p>
            <p>Try doing one of the PRACTICE tasks while you wait</p>
          </>
        )
      }
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-taskLocked"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          TASK LOCKED
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>You cannot do this task at the moment</h4>
        <p>This is because {props.reasons.message}</p>
        {displayReason()}
      </Modal.Body>
      <Modal.Footer>
        <Button className="closeButton__text" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReasonsLocked