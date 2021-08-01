class Credentials {

    constructor(emailAddress, thePassword) {
        this.email = emailAddress;
        this.postCode = thePostCode;
    }

    getEmailAddress() {
        return this.email;
    }

    getPassword(){
        return this.password;
    }
}

module.exports = Credentials;