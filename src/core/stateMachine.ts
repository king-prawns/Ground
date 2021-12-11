import {IDriver, EPlayerState} from '@king-prawns/pine-roots';

class StateMachine {
  private _currentState?: EPlayerState;
  private _isBuffering = false;

  constructor(
    private driver: IDriver,
    private videoElement: HTMLVideoElement
  ) {}

  private onPlayerStateUpdate(state: EPlayerState): void {
    if (this._currentState !== state) {
      this._currentState = state;
      this.driver.onPlayerStateUpdate(state);
    }
  }

  public transition(state: EPlayerState): void {
    switch (state) {
      case EPlayerState.LOADING:
        if (!this._currentState) {
          this.onPlayerStateUpdate(EPlayerState.LOADING);
        }
        break;
      case EPlayerState.BUFFERING:
        if (
          this._currentState === EPlayerState.PLAYING ||
          this._currentState === EPlayerState.LOADING ||
          this._currentState === EPlayerState.PAUSED ||
          this._currentState === EPlayerState.ENDED
        ) {
          this._isBuffering = true;
          this.onPlayerStateUpdate(EPlayerState.BUFFERING);
        }
        break;
      case EPlayerState.PLAYING:
        if (this._currentState === EPlayerState.PAUSED || !this._isBuffering) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case EPlayerState.PAUSED:
        if (this._currentState === EPlayerState.PLAYING || !this._isBuffering) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case EPlayerState.ENDED:
        if (this._currentState === EPlayerState.PLAYING) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case EPlayerState.ERRORED:
        this.onPlayerStateUpdate(state);
        break;
    }
  }

  public endBuffering(): void {
    this._isBuffering = false;
    if (this.videoElement.paused) {
      this.onPlayerStateUpdate(EPlayerState.PAUSED);
    } else {
      this.onPlayerStateUpdate(EPlayerState.PLAYING);
    }
  }
}

export default StateMachine;
