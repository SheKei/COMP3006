class Chat {

    constructor(sender, recipient, message, timestamp) {
        this._sender = sender;
        this._recipient = recipient;
        this._message = message;
        this._timestamp = timestamp;
    }

    getSender() {
        return this._sender;
    }

    getRecipient() {
        return this._recipient;
    }

    getMessage() {
        return this._message;
    }

    getTimestamp() {
        return this._timestamp;
    }
}

module.exports = Chat;