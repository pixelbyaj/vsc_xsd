import * as express from 'express';
import * as path from 'path';
import { State } from './models';
import { Logger } from './logging';
const app = express();
let server: any = null;

export function startServer() {
    if(server !== null)
        return;
    const port = 8080;
    app.use(express.static(path.join(__dirname, 'app')));
    // Define a route to serve the HTML file
    app.get('/', (req: any, res: any) => {
        // Send the "index.html" file as the response
        res.sendFile(path.join(__dirname, 'app', 'index.html'));
    });

    // Start the server
    server = app.listen(port, () => {
        Logger.info(`Server is running on http://localhost:${port}`);
    });
}

export function stopServer() {
    if (server) {
        server.close(() => {
            Logger.info("Server closed");
        });
    }
}