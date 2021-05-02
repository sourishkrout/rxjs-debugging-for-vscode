import { interfaces } from 'inversify';
import * as vscode from 'vscode';
import LogPointRecommender, { ILogPointRecommender } from '../codeAnalysis/logPointRecommender';
import {
  INodeWithRxJSDebugConfigurationResolver,
  NodeWithRxJSDebugConfigurationResolver,
} from '../debugConfigurationProvider';
import LogPointDecorationProvider, { ILogPointDecorationProvider } from '../decoration/logPointDecorationProvider';
import { IRxJSDetector, RxJSDetector } from '../detector';
import LogPointHoverProvider, { ILogPointHoverProvider } from '../hover/hoverProvider';
import Logger, { ILogger, LogLevel } from '../logger';
import ConsoleLogSink from '../logger/console';
import LogPointManager, { ILogPointManager } from '../logPointManager';
import SessionManager, { ISessionManager } from '../sessionManager';
import DefaultCDPClientAddressProvider, { ICDPClientAddressProvider } from '../sessionManager/cdpClientAddressProvider';
import { DefaultCDPClientProvider, ICDPClientProvider } from '../telemetryBridge/cdpClientProvider';
import DisposableContainer, { IDisposableContainer } from './disposableContainer';
import { ExtensionContext, RootContainer, VsCodeApi } from './types';

export default function createRootContainer(extensionContext: vscode.ExtensionContext): IDisposableContainer {
  const container = new DisposableContainer('Root');

  container.bind<typeof vscode>(VsCodeApi).toConstantValue(vscode);

  container.bind<interfaces.Container>(RootContainer).toConstantValue(container);
  container.bind<vscode.ExtensionContext>(ExtensionContext).toConstantValue(extensionContext);

  const logger = new Logger([new ConsoleLogSink()], LogLevel.Info); // TODO Make configurable?
  container.bind<ILogger>(ILogger).toConstantValue(logger);

  container.bind<IRxJSDetector>(IRxJSDetector).to(RxJSDetector).inSingletonScope();
  container
    .bind<vscode.DebugConfigurationProvider>(INodeWithRxJSDebugConfigurationResolver)
    .to(NodeWithRxJSDebugConfigurationResolver)
    .inSingletonScope();

  container
    .bind<ILogPointRecommender>(ILogPointRecommender)
    .to(LogPointRecommender)
    .inSingletonScope()
    .onActivation(container.trackDisposableBinding);
  container
    .bind<ILogPointDecorationProvider>(ILogPointDecorationProvider)
    .to(LogPointDecorationProvider)
    .inSingletonScope()
    .onActivation(container.trackDisposableBinding);
  container
    .bind<ILogPointHoverProvider>(ILogPointHoverProvider)
    .to(LogPointHoverProvider)
    .inSingletonScope()
    .onActivation(container.trackDisposableBinding);
  container.bind<ILogPointManager>(ILogPointManager).to(LogPointManager).inSingletonScope();

  container
    .bind<ISessionManager>(ISessionManager)
    .to(SessionManager)
    .inSingletonScope()
    .onActivation(container.trackDisposableBinding);
  container
    .bind<ICDPClientAddressProvider>(ICDPClientAddressProvider)
    .to(DefaultCDPClientAddressProvider)
    .inSingletonScope();

  container.bind<ICDPClientProvider>(ICDPClientProvider).to(DefaultCDPClientProvider).inSingletonScope();

  // Ensure SessionManager is initialized:
  container.get<ISessionManager>(ISessionManager);

  return container;
}
