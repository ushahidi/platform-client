class Datalayer {
    constructor() {
        this.pushQ = [];
        this.userProperties = {};
    }

    initialize() {
        // Listen to user property change events
        window.addEventListener("datalayer:userprops", ({detail}) => {
           this.userProperties = detail;
            if (this.pushQ.length > 0) {
                for (var obj of this.pushQ) {
                    obj.user_properties = this.userProperties;
                    this.push(obj);
                }
                this.pushQ = [];
            } else {
                this.push({user_properties: this.userProperties});
            }
        });

        // Listen to custom events to be pushed
        window.addEventListener("datalayer:custom-event", ({detail}) => {
            this.push(detail);
        });

        // Watching for routing events
        window.addEventListener("single-spa:routing-event",
            ({ detail: { newUrl } }) => {
                const path = new URL(newUrl).pathname;
                const pageType = this.pathToPageType(path);
                
                // Corner case: routing event before user properties set
                if (Object.keys(this.userProperties).length > 0) {
                    this.push({'page_type': pageType, user_properties: this.userProperties});
                } else {
                    // If user properties have not been initialised yet, we should queue
                    this.pushQ.push({'page_type': pageType});
                }
            });
    }

    push(obj) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push(obj);
        console.log("pushed");
        console.log(obj);
    }

    pathToPageType(path) {
        // i.e. '/settings/general' -> ['settings', 'general']
        const tokens = path.split('/').filter(Boolean);

        if (tokens[0] == 'settings') {
            return 'deployment-settings';
        } else if (tokens[0] == 'activity') {
            return 'deployment-activity';
        } else {
            return 'deployment-other';
        }
    }
}

export const datalayer = new Datalayer();
