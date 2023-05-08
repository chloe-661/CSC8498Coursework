import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function QuitWarning(props) {
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
        <h4>Are you sure you want to quit?</h4>
        <h6>SOLO:</h6>
        <p><em>!!! You will loose all progress</em></p>
        <h6>CO-OP:</h6>
        <p><em>!!! You will NOT be able to rejoin the session you were in</em></p>
        <p><em>!!! If you are the leader of your session, quitting will end the session for EVERYONE</em></p>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button> */}
        <Button className="quitWarning-btn" onClick={() => props.onQuit()}>Yes- I want to quit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuitWarning