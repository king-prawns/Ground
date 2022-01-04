import 'shaka-player/dist/controls.css';
import './VideoPlayer.css';
import React from 'react';
import {pinefy, EPlayerState} from '@king-prawns/pine-roots';
import connectDriver from '../core/connectDriver';
import StateMachine from '../core/stateMachine';
import IConnection from '../interfaces/IConnection';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shaka = require('shaka-player/dist/shaka-player.ui.js');

type IProps = {
  isProxyEnabled: boolean;
};
type IState = Record<string, never>;

const MANIFEST =
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel-multi-lang.ism/.mpd';

class VideoPlayer extends React.Component<IProps, IState> {
  private videoComponent: React.RefObject<HTMLVideoElement>;
  private videoContainer: React.RefObject<HTMLDivElement>;

  constructor(props: IProps) {
    super(props);
    this.videoComponent = React.createRef();
    this.videoContainer = React.createRef();
  }

  componentDidMount(): void {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
      this.initPlayer();
    } else {
      // eslint-disable-next-line no-console
      console.error('Browser not supported!');
    }
  }

  private async initPlayer(): Promise<void> {
    const videoElement = this.videoComponent.current;
    const videoContainerElement = this.videoContainer.current;

    const player = new shaka.Player(videoElement);
    player.configure({
      manifest: {
        retryParameters: {
          maxAttempts: 5
        }
      },
      streaming: {
        retryParameters: {
          maxAttempts: 5
        }
      }
    });
    const ui = new shaka.ui.Overlay(
      player,
      videoContainerElement,
      videoElement
    );

    const controls = ui.getControls();

    const {proxyManifestUrl, driver} = pinefy(MANIFEST);

    const stateMachine = new StateMachine(driver, videoElement!);

    const connection: IConnection = connectDriver(
      player,
      controls,
      videoElement!,
      driver,
      stateMachine
    );

    const manifestUri = this.props.isProxyEnabled ? proxyManifestUrl : MANIFEST;

    try {
      await player.load(manifestUri);
      // eslint-disable-next-line no-console
      console.log('The video has now been loaded!');
    } catch (e: any) {
      const {code, data} = e;
      const message = `Error code: ${code}, details: ${JSON.stringify(data)}`;
      // eslint-disable-next-line no-console
      console.error(message);
      stateMachine.transition(EPlayerState.ERRORED);
      connection.destroy();
    }
  }

  render(): JSX.Element {
    return (
      <div className="video-container" ref={this.videoContainer}>
        <video ref={this.videoComponent} autoPlay muted />
      </div>
    );
  }
}

export default VideoPlayer;
