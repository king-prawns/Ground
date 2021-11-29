import React from 'react';
import VideoPlayer from './components/VideoPlayer';

class App extends React.Component {
  render(): JSX.Element {
    return (
      <>
        <VideoPlayer isProxyEnabled={true} />
      </>
    );
  }
}

export default App;
