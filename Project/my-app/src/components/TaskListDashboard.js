import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

import TaskDescription from './TaskDescription';
import SessionStats from './SessionStats';
import UserRole from './UserRole';
import Instructions from '../components/Instructions';

function TaskListDashboard(props) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div class="taskListDashboard grid-container">
        <div class="grid-item__role">
        <UserRole title="USER ROLE:" description={props.userDetails.role}/>
        </div>
        <div class="grid-item__stats">
          <SessionStats title="SESSION STATS:" description="hnfdvjl fndvfn jlavnfdl vngfj rjgf vnileagfv rnae hrf abgvpd janl" />
        </div>
        <div class="grid-item__tasks">
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={false} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
          <TaskDescription title="1.Task" description="Brief Description ......... ............. ........... .......... ........ ........" languages="Javascript" isLocked={true} />
        </div>
        <div class="grid-item__button">
          <Button className="btn-back">Quit</Button>
          <Button className="btn-instructions" onClick={() => setModalShow(true)}>Need Help?</Button>
        </div>   
      </div>
      <Instructions
            show={modalShow}
            onHide={() => setModalShow(false)}
        />
    </>
  );
}

export default TaskListDashboard;