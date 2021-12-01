import {Driver, PlayerState} from '@king-prawns/pine-roots';

class StateMachine {
  private _currentState: PlayerState = PlayerState.UNKNOWN;
  private _prevState: PlayerState = PlayerState.UNKNOWN;

  constructor(private driver: Driver) {}

  public transition(state: PlayerState): void {
    // TODO: simplify && add more condition on transitions
    switch (state) {
      case PlayerState.LOADING:
        if (this.currentState === PlayerState.UNKNOWN) {
          this.currentState = state;
          this.driver.onPlayerStateUpdate(PlayerState.UNKNOWN);
        }
        break;
      case PlayerState.BUFFERING:
        if (
          this.currentState === PlayerState.LOADING ||
          this.currentState === PlayerState.SEEKING
        ) {
          return;
        }
        this.driver.onPlayerStateUpdate(PlayerState.BUFFERING);
        break;
      case PlayerState.PAUSED:
        this.currentState = state;
        this.driver.onPlayerStateUpdate(PlayerState.PAUSED);
        break;
      case PlayerState.PLAYING:
        if (
          this.currentState === PlayerState.BUFFERING ||
          this.currentState === PlayerState.SEEKING
        ) {
          return;
        }
        this.currentState = state;
        this.driver.onPlayerStateUpdate(PlayerState.PLAYING);
        break;
      case PlayerState.ENDED:
        this.currentState = state;
        this.driver.onPlayerStateUpdate(PlayerState.ENDED);
        break;
      case PlayerState.SEEKING:
        this.currentState = state;
        this.driver.onPlayerStateUpdate(PlayerState.SEEKING);
        break;
    }
  }

  set currentState(state: PlayerState) {
    if (this._currentState !== state) {
      this._prevState = this._currentState;
      this._currentState = state;
    }
  }

  get currentState(): PlayerState {
    return this._currentState;
  }

  get prevState(): PlayerState {
    return this._prevState;
  }
}

export default StateMachine;
