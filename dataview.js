module.exports = function(RED) {
    
    function DataView(config) {
        RED.nodes.createNode(this, config);
        this.active = (config.active === null || typeof config.active === "undefined") || config.active;
        this.passthru = config.passthru;
        
        var node = this;
        
        function sendDataToClient(data, msg) {
            var d = {
                id:node.id,
                data
            }
            try {
                RED.comms.publish("data-view", d);
            }
            catch(e) {
                node.error("Error sending data", msg);
            }
        }
        
        function handleError(err, msg, statusText) {
            node.status({ fill:"red", shape:"dot", text:statusText });
            node.error(err, msg);
        }

        node.on("input", function(msg) {       
            var data;     
            if (this.active !== true) { return; }
            if (node.passthru) { node.send(msg); }
            // Get the image from the location specified in the typedinput field
            data = {
                value: msg.payload,
                time: new Date()
            }
            sendDataToClient(data, msg);
        });

        node.on("close", function() {
            // send empty data to close the view
            RED.comms.publish("data", { id:this.id });
            node.status({});
        });
    }
    RED.nodes.registerType("data-view", DataView);
    
    // Via the button on the node (in the FLOW EDITOR), the image pushing can be enabled or disabled
    RED.httpAdmin.post("/data-view/:id/:state", RED.auth.needsPermission("image-output.write"), function(req,res) {
        var state = req.params.state;
        var node = RED.nodes.getNode(req.params.id);
        
        if(node === null || typeof node === "undefined") {
            res.sendStatus(404);
            return;  
        }

        if (state === "enable") {
            node.active = true;
            res.send('activated');
        }
        else if (state === "disable") {
            node.active = false;
            res.send('deactivated');
        }
        else {
            res.sendStatus(404);
        }
    });
};
