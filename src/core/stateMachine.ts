import {Driver, PlayerState} from '@king-prawns/pine-roots';

class StateMachine {
  private _currentState: PlayerState = PlayerState.UNKNOWN;
  private _isBuffering = false;

  constructor(private driver: Driver, private videoElement: HTMLVideoElement) {}

  private onPlayerStateUpdate(state: PlayerState): void {
    if (this._currentState !== state) {
      this._currentState = state;
      this.driver.onPlayerStateUpdate(state);
    }
  }

  public transition(state: PlayerState): void {
    switch (state) {
      case PlayerState.LOADING:
        if (this._currentState === PlayerState.UNKNOWN) {
          this.onPlayerStateUpdate(PlayerState.LOADING);
        }
        break;
      case PlayerState.BUFFERING:
        if (
          this._currentState === PlayerState.PLAYING ||
          this._currentState === PlayerState.LOADING ||
          this._currentState === PlayerState.PAUSED ||
          this._currentState === PlayerState.ENDED
        ) {
          this._isBuffering = true;
          this.onPlayerStateUpdate(PlayerState.BUFFERING);
        }
        break;
      case PlayerState.PLAYING:
        if (this._currentState === PlayerState.PAUSED || !this._isBuffering) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.PAUSED:
        if (this._currentState === PlayerState.PLAYING || !this._isBuffering) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.ENDED:
        if (this._currentState === PlayerState.PLAYING) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.ERRORED:
        this.onPlayerStateUpdate(state);
        break;
    }
  }

  public endBuffering(): void {
    this._isBuffering = false;
    if (this.videoElement.paused) {
      this.onPlayerStateUpdate(PlayerState.PAUSED);
    } else {
      this.onPlayerStateUpdate(PlayerState.PLAYING);
    }
  }
}

export default StateMachine;
