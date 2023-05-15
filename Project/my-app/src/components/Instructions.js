import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Instructions(props) {
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
          HELP
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>The Aim</h4>
        <p>
          The aim of the game is to complete a collection of tasks that work towards building something you would commonly 
          use when developing a web application, such as a navigation bar or a login form to name a few. This is to help 
          improve your skills and reinforce the basics. 
        </p>
        <p>PLEASE NOTE: This does not teach you the web languages. You will need to know a little bit before attempting this.</p>

        <h4>Game Modes</h4>
        <p>
          You can work by yourself, or in a group of up to 4 people.  
        </p>
        <p>
          If playing in a group, you will be assign a role or two, which will determine which languages 
          and types of tasks you will have to complete. The other members in your teams will complete the 
          remaining tasks. </p>
        <p>
          If playing solo, you will have all the roles to do yourself. 
        </p>

        <h4>Webstacks</h4>
        <p>
          When playing solo or creating a group session, you will be asked to pick a webstack. 
          This is a collection of languages that are often used together in the real world to produce a 
          web application. There are many versions of these, with lots of frameworks and libraries that 
          can be added to expand the functionality of the basic languages. 
          </p>
        <p>Pick a webstack based on the languages you want to practice. More options will come as this site grows
        </p>

        <h4>Session Keys</h4>
        <p>These keys are what allows you to play with your friends. </p>
        <p>One person takes charge (the leader) and starts a session - the screen will then show you a 6 digit code. </p>
        <p>This can then be shared with friends and they can choose "join" on the Co-Op page and input the code into the white box.</p>
        <p>Please note it is case sensitive</p>
        <p>PLAYING SOLO: You will be presented with a session key even when playing solo, 
          but if you wish to continue playing solo, just click "start" and ignore the code</p>

        <h4>The tasks</h4>
        <p>The tasks will have a specific language and therefore role assigned to them. If you are playing co-op, you will only be shown tasks that fit the role assigned to you. Your friends will have the remaining tasks</p>
        <p>There are two kinds of tasks: Practice tasks (they need to be completed, but the order in which you do them doesn't matter) or Senario tasks (they need to be completed in a certain order) and will work towards an overall goal, such as building a working Login Form.</p>
        <p>Senario tasks may be locked until a different task is completed. You may have to wait for a friend to finish the task first, and therefore the Practice tasks are there to help fill the time</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="closeButton__text" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Instructions