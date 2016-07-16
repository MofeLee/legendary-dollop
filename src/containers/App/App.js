import React from 'react';
import Counter from '../Counter';
import VideoPlayer from 'components/VideoPlayer';
import reactCSS from 'reactcss';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const App = () => (
  <div style={s.container}>
    <div></div>
    <VideoPlayer />
  </div>
);

export default App;

const s = reactCSS({
  'default': {
    container: {
      width: '100%',
      flex: 1,
      backgroundColor: 'red'
    }
  }
})
