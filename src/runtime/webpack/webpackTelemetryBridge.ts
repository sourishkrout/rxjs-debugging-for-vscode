import { TelemetryEvent } from '../../shared/telemetry';
import matchTelemetryEvent from '../../shared/telemetry/match';
import { IOperatorIdentifier } from '../../shared/telemetry/operatorIdentifier';
import TelemetryBridge from '../telemetryBridge';

const WEBPACK_PREFIX = 'webpack://';

export default class WebpackTelemetryBridge extends TelemetryBridge {
  /**
   * @inheritdoc
   */
  forward(telemetryEvent: TelemetryEvent): void {
    const eventToForward = matchTelemetryEvent({
      OperatorLogPoint: (o) => {
        const operatorIdentifier = this.getEnabledOperatorIdentifier(o.operator);
        if (operatorIdentifier) {
          return { ...telemetryEvent, operator: operatorIdentifier };
        }
        return;
      },
    })(telemetryEvent);

    if (eventToForward) {
      this.send(eventToForward);
    }
  }

  protected getEnabledOperatorIdentifier(operatorIdentifier: IOperatorIdentifier): IOperatorIdentifier | undefined {
    if (this.enabledOperatorLogPoints.size === 0) {
      return undefined;
    }

    // TODO Highly inefficient. Can we improve this by building the index better upfront?
    const withoutPrefix = operatorIdentifier.fileName.substr(WEBPACK_PREFIX.length);
    const relativeFileName = withoutPrefix.substr(withoutPrefix.indexOf('/') + 1);

    for (const o of this.enabledOperatorLogPoints.values()) {
      if (
        o.fileName.endsWith(relativeFileName) &&
        o.line === operatorIdentifier.line &&
        o.character - 1 === operatorIdentifier.character &&
        o.operatorIndex === operatorIdentifier.operatorIndex
      ) {
        return o;
      }
      return undefined;
    }
  }
}