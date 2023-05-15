import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function HintModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-instructions"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          HINTS
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.hints.map((hint, index) => (
          <p className="listP" key={index}>- {hint}</p>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button className="closeButton__text" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HintModal