import {IDriver, EPlayerState} from '@king-prawns/pine-roots';
import IConnection from '../interfaces/IConnection';
import StateMachine from './stateMachine';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shaka = require('shaka-player/dist/shaka-player.ui.js');

const connectDriver = (
  player: any,
  controls: any,
  videoElement: HTMLVideoElement,
  driver: IDriver,
  stateMachine: StateMachine
): IConnection => {
  let polling: number;

  const clearPolling = (): void => {
    window.clearInterval(polling);
    polling = 0;
  };

  const getPlayerStats = (): void => {
    if (!player) {
      clearPolling();
    }

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

  polling = window.setInterval(getPlayerStats, 1000);

  const handleLoading = (): void => {
    stateMachine.transition(EPlayerState.LOADING);
  };

  const handleBuffering = (event: any): void => {
    if (event.buffering) {
      stateMachine.transition(EPlayerState.BUFFERING);
    } else {
      stateMachine.endBuffering();
    }
  };

  const handleError = (e: any): void => {
    const {code, data, severity} = e.detail;
    const message = `Error code: ${code}, details: ${JSON.stringify(data)}`;
    if (severity === shaka.util.Error.Severity.CRITICAL) {
      // eslint-disable-next-line no-console
      console.error(message);
      stateMachine.transition(EPlayerState.ERRORED);
      clearPolling();
    } else {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  };

  const handleSeeking = (): void => {
    if (!polling) {
      polling = window.setInterval(getPlayerStats, 500);
    }
  };

  const handlePlaying = (): void => {
    stateMachine.transition(EPlayerState.PLAYING);
  };

  const handlePause = (): void => {
    if (controls.isSeeking() || videoElement.ended) {
      return;
    }
    stateMachine.transition(EPlayerState.PAUSED);
  };

  const handleEnded = (): void => {
    clearPolling();
    stateMachine.transition(EPlayerState.ENDED);
  };

  player.addEventListener('loading', handleLoading);
  player.addEventListener('buffering', handleBuffering);
  player.addEventListener('error', handleError);
  videoElement.addEventListener('seeking', handleSeeking);
  videoElement.addEventListener('playing', handlePlaying);
  videoElement.addEventListener('pause', handlePause);
  videoElement.addEventListener('ended', handleEnded);

  return {
    destroy: (): void => {
      player.removeEventListener('loading', handleLoading);
      player.removeEventListener('buffering', handleBuffering);
      player.removeEventListener('error', handleError);
      videoElement.removeEventListener('seeking', handleSeeking);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      clearPolling();
    }
  };
};

export default connectDriver;
