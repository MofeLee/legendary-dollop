import React, { Component } from 'react';
import reactCSS from 'reactcss';
import _ from 'lodash';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }


  componentWillUnmount() {
  }

  tooglePlay(){
    if(!this.video) return;
    if(this.video.paused){
      return this.video.play();
    }

    this.video.pause();
  }

  onClick(){
    this.tooglePlay();
  }

  render() {
    return (
      <div onClick={this.onClick.bind(this)}>
        <video
          ref={ref=>this.video = ref}
          style={s.video}
          preload="auto">
          <source src="http://loc:8080/DevBytes%20-%20Web%20Components%20-%20Template-qC5xK6H0GlQ.mp4" type='video/mp4'/>
        </video>
      </div>
   );
  }
}

const s = reactCSS({
  'default': {
    video: {
      width: '100%',
    }
  }
})
