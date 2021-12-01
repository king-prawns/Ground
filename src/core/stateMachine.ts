import {Driver, PlayerState} from '@king-prawns/pine-roots';

class StateMachine {
  private _currentState: PlayerState = PlayerState.UNKNOWN;
  private _previousState: PlayerState = PlayerState.UNKNOWN;

  constructor(private driver: Driver) {}

  public transition(state: PlayerState): void {
    switch (state) {
      case PlayerState.LOADING:
        if (this.currentState === PlayerState.UNKNOWN) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.BUFFERING:
        if (
          this.currentState === PlayerState.PLAYING ||
          this.currentState === PlayerState.LOADING
        ) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.PAUSED:
        if (this.currentState === PlayerState.PLAYING) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.PLAYING:
        if (
          this.currentState === PlayerState.PAUSED ||
          this.currentState === PlayerState.BUFFERING ||
          this.currentState === PlayerState.SEEKING
        ) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.ENDED:
        if (this.currentState === PlayerState.PLAYING) {
          this.onPlayerStateUpdate(state);
        }
        break;
      case PlayerState.SEEKING:
        if (
          this.currentState === PlayerState.PAUSED ||
          this.currentState === PlayerState.BUFFERING ||
          this.currentState === PlayerState.PLAYING ||
          this.currentState === PlayerState.ENDED
        ) {
          this.onPlayerStateUpdate(state);
        }
        break;
    }
  }

  get currentState(): PlayerState {
    return this._currentState;
  }

  set currentState(state: PlayerState) {
    if (this._currentState !== state) {
      this._previousState = this._currentState;
      this._currentState = state;
    }
  }

  get previousState(): PlayerState {
    return this._previousState;
  }

  private onPlayerStateUpdate(state: PlayerState): void {
    this.currentState = state;
    this.driver.onPlayerStateUpdate(state);
  }
}

export default StateMachine;
