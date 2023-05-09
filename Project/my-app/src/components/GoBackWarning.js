import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function GoBackWarning(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-quitWarning"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          WARNING
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Are you sure you want to go back?</h4>
        <p><em>!!! You will loose all progress on this task</em></p>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button> */}
        <Button className="quitWarning-btn" onClick={() => props.onGoBack(props.taskId)}>Yes- I want to go back</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GoBackWarning