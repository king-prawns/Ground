import 'shaka-player/dist/controls.css';
import './VideoPlayer.css';
import React from 'react';
import {proxyfy} from '@king-prawns/pine-roots';
import connectDriver from '../core/connectDriver';

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

    this.onPlayerErrorEvent = this.onPlayerErrorEvent.bind(this);
    this.onUIErrorEvent = this.onUIErrorEvent.bind(this);
    this.onError = this.onError.bind(this);
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

  private onPlayerErrorEvent(event: any): void {
    this.onError(event.detail);
  }

  private onUIErrorEvent(event: any): void {
    this.onError(event.detail);
  }

  private onError(detail: any): void {
    const {code, error} = detail;
    // eslint-disable-next-line no-console
    console.error('Error code', code, 'object', error);
  }

  private async initPlayer(): Promise<void> {
    const videoElement = this.videoComponent.current;
    const videoContainerElement = this.videoContainer.current;

    const player = new shaka.Player(videoElement);
    const ui = new shaka.ui.Overlay(
      player,
      videoContainerElement,
      videoElement
    );

    const controls = ui.getControls();

    player.addEventListener('error', this.onPlayerErrorEvent);
    controls.addEventListener('error', this.onUIErrorEvent);

    try {
      const {proxyManifestUrl, driver} = proxyfy(MANIFEST);

      connectDriver(player, driver);

      const manifestUri = this.props.isProxyEnabled
        ? proxyManifestUrl
        : MANIFEST;

      await player.load(manifestUri);
      // eslint-disable-next-line no-console
      console.log('The video has now been loaded!');
    } catch (e) {
      this.onError(e);
    }
  }

  render(): JSX.Element {
    return (
      <div className="video-container" ref={this.videoContainer}>
        <video ref={this.videoComponent} />
      </div>
    );
  }
}

export default VideoPlayer;
