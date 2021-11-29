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
        driver.onBufferingStarted();
      }
    } else {
      if (isSeeking) {
        isSeeking = false;
        driver.onSeekEnded();
        driver.onPlaying();
      } else {
        if (isBuffering) {
          isBuffering = false;
          driver.onBufferingEnded();
          driver.onPlaying();
        }
      }
    }
  });
  videoElement.addEventListener('playing', () => {
    isLoading = false;
    if (isBuffering || isSeeking) {
      return;
    } else {
      driver.onPlaying();
    }
  });
  videoElement.addEventListener('pause', () => {
    driver.onPaused();
  });
  videoElement.addEventListener('ended', () => {
    driver.onEnded();
  });
  videoElement.addEventListener('timeupdate', () => {
    const currentTimeMs = Math.trunc(videoElement.currentTime * 1000);
    driver.onTimeUpdate(currentTimeMs);
  });
  videoElement.addEventListener('seeking', () => {
    isSeeking = true;
    driver.onSeekStarted();
  });

  // TODO:
  // from shaka with polling?
  // buffer audio video
  // active variant
  // estimated bandwidth
  // memory heap?
  // install 1.1.1
};

export default connectDriver;
