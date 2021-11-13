import React from 'react';
import hello from './core/hello';

class App extends React.Component {
  render(): JSX.Element {
    return <h1>{hello()}</h1>;
  }
}

export default App;
