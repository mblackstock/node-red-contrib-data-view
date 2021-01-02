# node-red-contrib-data-view
Node-RED node to preview data with a simple line chart inside the Node-RED flow editor. This node was inspired by the simple image preview node `node-red-contrib-image-output`.

Currently the node expects the input `msg.payload` to contain a number value. The node will then create a line chart in the flow editor under the node displaying values received over time. 

> NOTE: This node is a work in progress. The intended use case for this node is for simple demos and debugging. The state of the chart is currently maintained in the client, so that refreshing the page, or opening a new view on the flow will cause the chart to reset. I expect to add additional chart options, chart types and support different shapes of data. Feedback is welcome.

## Installation
Either use the Editor - Menu - Manage Palette - Install option, or run the following npm command in your Node-RED user directory (typically `~/.node-red`):
```
npm i node-red-contrib-data-view
```

## Node usage
This node can be used to view simple line charts inside the Node-RED flow editor as illustrated below.

![Example](https://user-images.githubusercontent.com/707704/103465930-15b7d600-4cf5-11eb-808d-9bddcdf68c25.png)

The following example demonstrates how to inject numbers into the node to generate charts. To clear a chart, send a null or undefined <code>msg.payload</code> value as shown, or click on the trash button in the top right corner.

```
[{"id":"2cd7059b.70ec6a","type":"data-view","z":"de60a83e.dce718","name":"wide chart","width":"400","height":"160","points":"100","active":true,"passthru":false,"outputs":0,"x":550,"y":120,"wires":[]},{"id":"1459af05.cfcc01","type":"inject","z":"de60a83e.dce718","name":"trigger data","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":150,"y":120,"wires":[["93544758.228ec8"]]},{"id":"93544758.228ec8","type":"function","z":"de60a83e.dce718","name":"generate values","func":"msg.payload = Math.floor(Math.random() * 100)-50;\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":360,"y":120,"wires":[["2cd7059b.70ec6a","e2c1381f.9dad28","47a657d1.c696f8"]]},{"id":"8841bc1f.0fee1","type":"debug","z":"de60a83e.dce718","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":730,"y":340,"wires":[]},{"id":"a0e15f78.4871c","type":"inject","z":"de60a83e.dce718","name":"clear chart","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"test","x":160,"y":160,"wires":[["2cd7059b.70ec6a"]]},{"id":"4de026cb.33c388","type":"inject","z":"de60a83e.dce718","name":"send bad data","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"strings can't be graphes","payloadType":"str","x":150,"y":200,"wires":[["2cd7059b.70ec6a"]]},{"id":"e2c1381f.9dad28","type":"data-view","z":"de60a83e.dce718","name":"pass through","width":"300","height":"160","points":"50","active":true,"passthru":true,"outputs":1,"x":550,"y":340,"wires":[["8841bc1f.0fee1"]]},{"id":"47a657d1.c696f8","type":"data-view","z":"de60a83e.dce718","name":"","width":200,"height":160,"active":true,"passthru":false,"outputs":0,"x":320,"y":340,"wires":[]}]
```

This example flow is also available via the *'Import'* menu in the Node-RED flow editor.

## Node configuration
### Property
Choose the message property containing the value to plot, `msg.payload` by default.

### Height
The height (in pixels) of the chart.

### Width
The width (in pixels) of the chart.

### Line points
The number of points to display in the chart before they are dropped. The client side code maintains a circular buffer for each node.

### Hide chart on deactivate
Hide the chart when node is deactivated to reduce clutter. This is set to true to default. Note that when the node is deactivated, any data sent to the chart is dropped.

### Allow data passthrough
When selected this adds an output wire to the node in order to pass the original message through to a following node. This performs better than forking the wires, however it does remove the enable/disable button.

