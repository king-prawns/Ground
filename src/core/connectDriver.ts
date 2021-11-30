import {Driver} from '@king-prawns/pine-roots';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shaka = require('shaka-player/dist/shaka-player.ui.js');

const connectDriver = (
  player: any,
  videoElement: HTMLVideoElement,
  driver: Driver
): void => {
  let isLoading = false;
  let isSeeking = false;
  let isBuffering = false;
  let isPaused = false;

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
  player.addEventListener('loading', () => {
    isLoading = true;
    driver.onLoading();
  });
  player.addEventListener('buffering', (event: any) => {
    if (isLoading) {
      return;
    }

    const {buffering} = event;
    if (buffering) {
      if (isSeeking) {
        return;
      } else {
        isBuffering = true;
        driver.onBuffering();
      }
    } else {
      if (isSeeking) {
        isSeeking = false;
        if (isPaused) {
          driver.onPaused();
        } else {
          driver.onPlaying();
        }
      } else {
        if (isBuffering) {
          isBuffering = false;
          driver.onPlaying();
        }
      }
    }
  });
  videoElement.addEventListener('playing', () => {
    isLoading = false;
    isPaused = false;
    if (isBuffering || isSeeking) {
      return;
    } else {
      driver.onPlaying();
    }
  });
  videoElement.addEventListener('pause', () => {
    isPaused = true;
    driver.onPaused();
  });
  videoElement.addEventListener('ended', () => {
    driver.onEnded();
  });
  videoElement.addEventListener('seeking', () => {
    isSeeking = true;
    driver.onSeeking();
  });

  setInterval(() => {
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
      driver.onBufferedInfoUpdate({
        audio: bufferedInfo.audio[0].end - bufferedInfo.audio[0].start,
        video: bufferedInfo.video[0].end - bufferedInfo.video[0].start
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const usedJSHeapSize = window.performance.memory.usedJSHeapSize;
    driver.onUsedJSHeapSizeUpdate(usedJSHeapSize / 1000000);
  }, 500);

  // TODO:
  // after seeking return latest state
  // install 1.1.1
};

export default connectDriver;
