import React from 'react';
import Background1 from '../components/Background1';

function Page404 (){
    return (
        <>
        <Background1 />

        <div className="gameFrameContainer">
          <div className="gameFrame">  
            <h1>404</h1>
            <h6>PAGE NOT FOUND</h6>
          </div>
        </div>
        </>
      );
}

export default Page404;