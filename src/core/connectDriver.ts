import {Driver, PlayerState} from '@king-prawns/pine-roots';
import StateMachine from './stateMachine';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shaka = require('shaka-player/dist/shaka-player.ui.js');

const connectDriver = (
  player: any,
  videoElement: HTMLVideoElement,
  driver: Driver
): void => {
  let polling: number;

  const getPlayerStats = (): void => {
    const stats = player.getStats();
    const {streamBandwidth, estimatedBandwidth} = stats;

    if (streamBandwidth) {
      driver.onVariantUpdate(streamBandwidth / 1000000);
    }

    if (estimatedBandwidth) {
      driver.onEstimatedBandwidthUpdate(estimatedBandwidth / 1000000);
    }

    const bufferedInfo = player.getBufferedInfo();

    if (bufferedInfo.audio[0] && bufferedInfo.video[0]) {
      driver.onBufferInfoUpdate({
        audio: bufferedInfo.audio[0].end - bufferedInfo.audio[0].start,
        video: bufferedInfo.video[0].end - bufferedInfo.video[0].start
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const usedJSHeapSize = window.performance.memory.usedJSHeapSize;
    driver.onUsedJSHeapSizeUpdate(usedJSHeapSize / 1000000);
  };

  driver.onPlayerMetadataUpdate({
    name: 'Shaka Player',
    version: '3.2.1'
  });

  player
    .getNetworkingEngine()
    .registerRequestFilter((_type: any, request: any) => {
      driver.onHttpRequest(request.uris[0]);
    });

  player
    .getNetworkingEngine()
    .registerResponseFilter((type: any, response: any) => {
      if (type == shaka.net.NetworkingEngine.RequestType.MANIFEST) {
        driver.onManifestUpdate(response.uri);
      }

      driver.onHttpResponse({
        url: response.uri,
        timeMs: response.timeMs,
        byteLength: response.data.byteLength
      });
    });
  // eslint-disable-next-line prefer-const
  polling = window.setInterval(getPlayerStats, 500);

  const stateMachine = new StateMachine(driver);

  player.addEventListener('loading', () => {
    stateMachine.transition(PlayerState.LOADING);
  });
  player.addEventListener('buffering', (event: any) => {
    if (event.buffering) {
      stateMachine.transition(PlayerState.BUFFERING);
    } else {
      stateMachine.transition(stateMachine.previousState);
    }
  });
  videoElement.addEventListener('seeking', () => {
    if (stateMachine.currentState === PlayerState.ENDED) {
      polling = window.setInterval(getPlayerStats, 500);
    }
    stateMachine.transition(PlayerState.SEEKING);
  });
  videoElement.addEventListener('playing', () => {
    stateMachine.transition(PlayerState.PLAYING);
  });
  videoElement.addEventListener('play', () => {
    stateMachine.transition(PlayerState.PLAYING);
  });
  videoElement.addEventListener('pause', () => {
    stateMachine.transition(PlayerState.PAUSED);
  });
  videoElement.addEventListener('ended', () => {
    clearInterval(polling);
    stateMachine.transition(PlayerState.ENDED);
  });
  player.addEventListener('error', () => {
    stateMachine.transition(PlayerState.ERRORED);
  });
};

export default connectDriver;
