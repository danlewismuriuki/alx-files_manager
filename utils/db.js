const mongoose = require('mongoose');


class DBClient {
    constructor() {
        this.client = createClient();

        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 2707;
        const database = process.env.DB_DATABASE || files_manager;
        const url = `mongodb://${host}: ${port}: ${database}`;

        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                this.connected = true;
            })
            .catch(() => {
                this.connected = false;
            });
    }

    isAlive() {
        return this.connected;
    }

    async nbUsers() {
        if (!this.connected) return 0;
        const db = this.client.db();
        const usersCollections = db.collection('users');
        return await usersCollections.countDocuments();
    }

    async nbUsers() {
        if (!this.connected) return 0;
        const db = this.client.db();
        const filesCollections = db.collection('files');
        return await filesCollections.countDocuments();
    }


}

const mdbClient = new DBClient();
export default DBClient;