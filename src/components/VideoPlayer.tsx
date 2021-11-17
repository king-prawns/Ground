import React from 'react';
import shaka from 'shaka-player';
import replaceManifestUrl from '../core/replaceManifestUrl';

type IProps = Record<string, never>;
type IState = Record<string, never>;

class VideoPlayer extends React.Component<IProps, IState> {
  private videoComponent: React.RefObject<HTMLVideoElement>;

  constructor(props: IProps) {
    super(props);
    this.videoComponent = React.createRef();

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

  private onErrorEvent(event: any): void {
    this.onError(event.detail);
  }

  private onError(event: any): void {
    const {code, error} = event.detail;
    // eslint-disable-next-line no-console
    console.error('Error code', code, 'object', error);
  }

  private async initPlayer(): Promise<void> {
    const manifestUri = replaceManifestUrl(
      'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'
    );

    const video = this.videoComponent.current;

    const player = new shaka.Player(video);

    player.addEventListener('error', this.onErrorEvent);

    try {
      await player.load(manifestUri);
      // eslint-disable-next-line no-console
      console.log('The video has now been loaded!');
    } catch (e) {
      this.onError(e);
    }
  }

  render(): JSX.Element {
    return <video width="640" ref={this.videoComponent} controls />;
  }
}

export default VideoPlayer;
