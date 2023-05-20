import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, getUserResults, getTaskSet, getWebStacksById } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

//Styles
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

//Components
import Background1 from '../components/Background1';

function Dashboard() {
  
  //State -------------------------------------------------------------------------------------------------------------------------------
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [results, setResults] = useState(null);
  const [soloResults, setSoloResults] = useState(null);
  const [coopResults, setCoopResults] = useState(null);

  
  //Hooks -------------------------------------------------------------------------------------------------------------------------------
  
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login", {state:{previousPath: "/dashboard"}});
    fetchUserName();
  }, [user, loading]);
  
  //Data Retrieval functions -------------------------------------------------------------------------------------------------------------------------------
  
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const getResults = async () => {
    const request = await getUserResults(user?.uid);
    setResults(request);
  }

  const getSenario = async(taskSetId) => {
    const request = await getTaskSet(taskSetId);
    const senario = request.senarioDescription
    return senario;
  }

  const getWebStackLanguages = async(webStackId) => {
    const request = await getWebStacksById(webStackId);
    return request.languages;
  }
  
  //Other functions -------------------------------------------------------------------------------------------------------------------------------

  const sortResults = async() => {
    let solo = [];
    let coop = [];

    if (results){

      for (let i=0; i < results.length; i++){
        if (results[i].sessionPeople == 1){
          //solo
          let x = results[i];
          const s = await getSenario(x.taskSetId);
          const l = await getWebStackLanguages(x.webStackId);
          x.senarioDescription = s
          x.languages = l

          const timeInMilliseconds = getTimeDurationInMilliseconds(x.startTime, x.endTime);
          const timeFormatted = convertMillisecondsToMinutesAndSeconds(timeInMilliseconds);
          x.duration = timeFormatted;

          solo.push(x);
        }
        else {
          //coop
          let x = results[i];
          const s = await getSenario(x.taskSetId);
          const l = await getWebStackLanguages(x.webStackId);
          x.senarioDescription = s
          x.languages = l

          const timeInMilliseconds = getTimeDurationInMilliseconds(x.startTime, x.endTime);
          const timeFormatted = convertMillisecondsToMinutesAndSeconds(timeInMilliseconds);
          x.duration = timeFormatted;

          coop.push(x);
        }
      }

      const soloSorted = solo.sort(
        (objA, objB) => Number((objA.endTime - objA.startTime)) - Number((objB.endTime - objB.startTime)),
      );

      const coopSorted = coop.sort(
        (objA, objB) => Number((objA.endTime - objA.startTime)) - Number((objB.endTime - objB.startTime)),
      );
        
      setSoloResults(soloSorted);
      setCoopResults(coopSorted);
    }
    
  }

  function convertMillisecondsToMinutesAndSeconds(milliseconds){
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
  }

  function getTimeDurationInMilliseconds(start, end){
      return (end - start);
  }

  //Display functions -------------------------------------------------------------------------------------------------------------------------------

  function displayUserDetailsCard(){
    return (
      <>
        <Card className="userDashboard__detailsCard">
          <Card.Body>
              <Card.Title>LOGGED IN AS:</Card.Title>
              <hr className="card-options__hr"/>
              <Card.Text>{name}</Card.Text>
              <Card.Text>{user?.email}</Card.Text>
              <Button className="dashboard__btn" onClick={logout}>Logout</Button>
          </Card.Body>
        </Card>
      </>
    )
  }

  function displaySoloCard(){
    if (!results){
      getResults()
    }

    if (!soloResults){
      sortResults();
    }

    if (soloResults){
      return (
        <>
          <Card className="userResults">
              <Card.Body>
                <Card.Title style={{textAlign: "center"}}>SOLO</Card.Title>
                <hr />
                <div className="grid-container">
                    <div style={{textAlign: "center"}} className="grid-item__duration">
                      <Card.Text className="tinyText greenText">Duration</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__description">
                        <Card.Text className="tinyText greenText">Overall Task Aim</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__roles">
                        <Card.Text className="tinyText greenText">Roles</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__language">
                        <Card.Text className="tinyText greenText">Languages</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__people">
                      <Card.Text className="tinyText greenText">People &</Card.Text>
                    </div> 
                </div> 
              </Card.Body>
            </Card>

          {soloResults.map(({senarioDescription, role, languages, duration, sessionPeople}, index) => (
            <Card key={index} className="userResults">
              <Card.Body>
                <div className="grid-container">
                    <div className="grid-item__duration">
                        <Card.Title className="number">{duration}</Card.Title>
                    </div>
                    <div className="grid-item__description">
                        <Card.Text>{senarioDescription}</Card.Text>
                    </div>
                    <div className="grid-item__roles">
                        <Card.Text className="tinyText">
                        {
                          role.map((r, index) => (
                            <p key={index} className="tinyText listP">{r}</p>
                          ))
                        }
                        </Card.Text>
                    </div>
                    <div className="grid-item__language">
                        <Card.Text>
                        {
                          languages.map((l, index) => (
                            <p key={index} className="tinyText listP">{l}</p>
                          ))
                        }
                        </Card.Text>
                    </div>
                    <div className="grid-item__people">
                      <Card.Text className="number">{sessionPeople}</Card.Text>
                    </div> 
                </div> 
              </Card.Body>
            </Card>
          ))}
        </>
      )
    }
    else {
      return (
        <>
          <Card className="userResults">
              <Card.Body>
                <Card.Title style={{textAlign: "center"}}>SOLO</Card.Title>
                <hr />
                <div className="grid-container">
                    <div style={{textAlign: "center"}} className="grid-item__duration">
                      <Card.Text className="tinyText greenText">Duration</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__description">
                        <Card.Text className="tinyText greenText">Overall Task Aim</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__roles">
                        <Card.Text className="tinyText greenText">Roles</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__language">
                        <Card.Text className="tinyText greenText">Languages</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__people">
                      <Card.Text className="tinyText greenText">People &</Card.Text>
                    </div> 
                </div> 
              </Card.Body>
            </Card>
        </>
      )
    }
   
  }

  function displayCoopCard(){
    if (!results){
      getResults()
    }
    if (!coopResults){
      sortResults();
    }

    if (coopResults){
      return (
        <>
          <Card className="userResults">
              <Card.Body>
                <Card.Title style={{textAlign: "center"}}>CO-OP</Card.Title>
                <hr />
                <div className="grid-container">
                    <div style={{textAlign: "center"}} className="grid-item__duration">
                      <Card.Text className="tinyText greenText">Duration</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__description">
                        <Card.Text className="tinyText greenText">Overall Task Aim</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__roles">
                        <Card.Text className="tinyText greenText">Roles</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__language">
                        <Card.Text className="tinyText greenText">Languages</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__people">
                      <Card.Text className="tinyText greenText">People &</Card.Text>
                    </div> 
                </div> 
              </Card.Body>
            </Card>

          {coopResults.map(({senarioDescription, role, languages, duration, sessionPeople}, index) => (
            <Card key={index} className="userResults">
              <Card.Body>
                <div className="grid-container">
                    <div className="grid-item__duration">
                        <Card.Title className="number">{duration}</Card.Title>
                    </div>
                    <div className="grid-item__description">
                        <Card.Text>{senarioDescription}</Card.Text>
                    </div>
                    <div className="grid-item__roles">
                        <Card.Text className="tinyText">
                        {
                          role.map((r, index) => (
                            <p key={index} className="tinyText listP">{r}</p>
                          ))
                        }
                        </Card.Text>
                    </div>
                    <div className="grid-item__language">
                        <Card.Text>
                        {
                          languages.map((l, index) => (
                            <p key={index} className="tinyText listP">{l}</p>
                          ))
                        }
                        </Card.Text>
                    </div>
                    <div className="grid-item__people">
                      <Card.Text className="number">{sessionPeople}</Card.Text>
                    </div> 
                </div> 
              </Card.Body>
            </Card>
          ))}
        </>
      )
    }
    else {
      return (
        <>
          <Card className="userResults">
              <Card.Body>
                <Card.Title style={{textAlign: "center"}}>CO-OP</Card.Title>
                <hr />
                <div className="grid-container">
                    <div style={{textAlign: "center"}} className="grid-item__duration">
                      <Card.Text className="tinyText greenText">Duration</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__description">
                        <Card.Text className="tinyText greenText">Overall Task Aim</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__roles">
                        <Card.Text className="tinyText greenText">Roles</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__language">
                        <Card.Text className="tinyText greenText">Languages</Card.Text>
                    </div>
                    <div style={{textAlign: "center"}} className="grid-item__people">
                      <Card.Text className="tinyText greenText">People &</Card.Text>
                    </div> 
                </div> 
              </Card.Body>
            </Card>
        </>
      )
    }
  }


  //Render function -------------------------------------------------------------------------------------------------------------------------------
  return (
    <>
    <div className="gameFrameContainer">
      <div className="gameFrame">
        <h1 className="title2">USER DASHBOARD</h1>
        <div className="userDashboard grid-container">
          <div className="grid-item__details">
            {displayUserDetailsCard()}
          </div>
          <div className="grid-item__solo">
            {displaySoloCard()}
          </div>
          <div className="grid-item__coop">
            {displayCoopCard()}
          </div>
        </div>
        </div>
        </div>
          <Background1 />
     </>
  );
}
export default Dashboard;