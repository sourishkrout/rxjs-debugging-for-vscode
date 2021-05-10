import { interfaces } from 'inversify';
import * as vscode from 'vscode';
import {
  INodeWithRxJSDebugConfigurationResolver,
  NodeWithRxJSDebugConfigurationResolver,
} from '../debugConfigurationProvider';
import DecorationManager, { IDecorationManager } from '../decoration/decorationManager';
import { IRxJSDetector, RxJSDetector } from '../detector';
import Logger, { ILogger, LogLevel } from '../logger';
import ConsoleLogSink from '../logger/console';
import LogPointManager, { ILogPointManager } from '../logPoint/logPointManager';
import LogPointRecommender, { ILogPointRecommender } from '../logPoint/logPointRecommender';
import DefaultResourceProvider, { IResourceProvider } from '../resources';
import SessionManager, { ISessionManager } from '../sessionManager';
import DefaultCDPClientAddressProvider, { ICDPClientAddressProvider } from '../sessionManager/cdpClientAddressProvider';
import { DefaultCDPClientProvider, ICDPClientProvider } from '../telemetryBridge/cdpClientProvider';
import WorkspaceMonitor, { IWorkspaceMonitor } from '../workspaceMonitor';
import DisposableContainer, { IDisposableContainer } from './disposableContainer';
import { ExtensionContext, RootContainer, VsCodeApi } from './types';

export default function createRootContainer(extensionContext: vscode.ExtensionContext): IDisposableContainer {
  const container = new DisposableContainer('Root');

  container.bind<typeof vscode>(VsCodeApi).toConstantValue(vscode);

  container.bind<interfaces.Container>(RootContainer).toConstantValue(container);
  container.bind<vscode.ExtensionContext>(ExtensionContext).toConstantValue(extensionContext);

  const logger = new Logger([new ConsoleLogSink()], LogLevel.Info); // TODO Make configurable?
  container.bind<ILogger>(ILogger).toConstantValue(logger);

  container.bind<IResourceProvider>(IResourceProvider).to(DefaultResourceProvider).inTransientScope();

  container
    .bind<IWorkspaceMonitor>(IWorkspaceMonitor)
    .to(WorkspaceMonitor)
    .inSingletonScope()
    .onActivation(container.trackDisposableBinding);

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
  container.bind<ILogPointManager>(ILogPointManager).to(LogPointManager).inSingletonScope();

  container
    .bind<IDecorationManager>(IDecorationManager)
    .to(DecorationManager)
    .inSingletonScope()
    .onActivation(container.trackDisposableBinding);

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

  // Ensure necessary components are initialized and active by default:
  container.get<ISessionManager>(ISessionManager);
  container.get<IDecorationManager>(IDecorationManager);
  container.get<IWorkspaceMonitor>(IWorkspaceMonitor);

  return container;
}
