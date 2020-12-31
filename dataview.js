module.exports = function(RED) {
    
    function DataView(config) {
        RED.nodes.createNode(this, config);
        this.active = (config.active === null || typeof config.active === "undefined") || config.active;
        this.passthru = config.passthru;
        this.property = config.property || 'payload';
        
        var node = this;
        var errorCondition = false;
        
        function sendDataToClient(data, msg) {
            var d = {
                id:node.id,
            };
            if (data) {
                d.data = data;
            }
            try {
                RED.comms.publish("data-view", d);
            }
            catch(e) {
                node.error("Error sending data", msg);
            }
        }
        
        function handleError(err, msg, statusText) {
            if (!errorCondition) {
                node.status({ fill:"red", shape:"dot", text:statusText });
                errorCondition = true;
            }
            node.error(err, msg);
        }

        function clearError() {
            if (errorCondition) {
                node.status({});
                errorCondition = false;
            }
        }

        node.on("input", function(msg) {       
            if (this.active !== true) { return; }
            let value = msg[node.property];

            if (value == null) {      // null or undefined
                clearError();
                sendDataToClient(null, msg);    // delete chart
                return;
            }
            if (typeof value !== 'number') {
                handleError(`msg.${node.property} is not a number`, msg, `msg.${node.property} is not a number`);
                return;
            }
            if (node.passthru) { node.send(msg); }
            clearError();
            data = {
                value,
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
