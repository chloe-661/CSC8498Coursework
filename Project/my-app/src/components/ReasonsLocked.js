import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ReasonsLocked(props) {
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
        <p>This is because: </p>
        <p>{props.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="closeButton__text" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReasonsLocked