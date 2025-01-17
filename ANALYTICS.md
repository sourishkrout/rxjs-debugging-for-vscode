# Extension Usage Analytics

> 🥽 For Science!

The initial version of "RxJS Debugging for Visual Studio Code" resulted from a [research project](./RESEARCH.md). Doing (serious) research relies on empirical data. Thus, "RxJS Debugging for Visual Studio Code" asks its users to opt-in to collecting user behavior analytics data on its first activation.

It is essential for us that our users understand what data we collect and why we do it. This document gives full disclosure on [every event and data point](#tracked-events) we collect. We reveal further [where and how information is stored](#data-transmission-and-storage) and how you can [access it for your research work or contribution to the extension](#open-source-open-research-and-open-data) itself.

## Tracked Events

If analytics is enabled, the extension tracks user behavior at events detailed below. Each event consists of an [anonymized machine identifier provided by Visual Studio Code](https://code.visualstudio.com/api/references/vscode-api#env) and a set of event-specific data points.

All data points are carefully crafted to protect the users' privacy while providing empirical evidence for future research work. The machine identifier **DOES NOT** reveal the identity of users accordingly. Its sole purpose is the consolidation of events that belong together over time.

We discard IP addresses before storing any tracking event. This makes it impossible to reconstruct or estimate your geographical location later.

The following list documents all tracked analytic events. Feel free to review their implementation directly in the source code: [packages/extension/src/analytics](./packages/extension/src/analytics).

### Extension Started

| Data Point                                                   | Reason                                                       | Example Values              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------- |
| [**Visual Studio Code Version**](https://code.visualstudio.com/api/references/vscode-api#env) | The version of your Visual Studio Code installation.<br />This data point helps us to understand, which versions of Visual Studio Code are relevant for our users. It allows us to decide on if we can stop supporting outdated versions of Visual Studio Code, or not. | `1.61.0`                    |
| [**Visual Studio Code Language**](https://code.visualstudio.com/api/references/vscode-api#env) | The preferred language of your Visual Studio Code installation.<br />This data point allows us to prioritze the languages for which we might translate "RxJS Debugging for Visual Studio Code" next. | `en-US`, `de-CH`, `fr`, ... |
| **Extension Version**                                        | Identifies the version of "RxJS Debugging for Visual Studio Code" currently installed on your machine.<br />This data point helps us understand how our users install updates of our extension after release. | `1.0.0`                     |

### Debug Session Started

| Data Point       | Reason                                                       | Example Values      |
| ---------------- | ------------------------------------------------------------ | ------------------- |
| **Runtime Type** | The runtime type declares how the RxJS debugger connects to your application.<br />This data point helps us to understand what kind of RxJS applications (e.g. backend or frontend) our users debug most. | `nodejs`, `webpack` |

### Debug Session Stopped

*This event does not include any additional data points.*

### Operator Log Point Enabled/Disabled

| Data Point        | Reason                                                       | Example Values        |
| ----------------- | ------------------------------------------------------------ | --------------------- |
| **Operator Name** | Identifies **[built-in operators](https://rxjs.dev/api?type=function)** for which you enable/disable a log point. We will **NOT** track the name of a custom operator nor anything else related to your source code (line numbers, structure, etc.)<br />This data point helps us to understand which operators are the most problematic ones for our users. Thus, it helps us to build better debugging tools in the future accordingly. | `map`, `flatMap`, ... |

## Data Transmission and Storage

All analytic events are securely transmitted over an HTTPS connection.

Usage analytics data is collected using [Posthog](https://posthog.com/). It runs on the premises of the [Eastern Switzerland University of Applied Sciences (OST)](https://ost.ch) where all data ist stored as well.

## Open Source, Open Research and Open Data

[Posthog](https://posthog.com/) does not allow the creation of read-only users at the time of writing this document. 🙏 Please [create an issue](https://github.com/swissmanu/rxjs-debugging-for-vscode/issues/new?template=request_analytics_data_access.md) using the appropriate template if you want to access to the collected analytics data for your own research project or contribution to the extension. We happily assist you either with an export of a data set or grant you access to Posthog itself if required.
