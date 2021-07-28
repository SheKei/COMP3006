class Account {

    constructor(forename, surname, dateOfBirth, emailAddress, street, thePostCode) {
        this.firstname =forename;
        this.lastname = surname;
        this.birthday = dateOfBirth;
        this.email = emailAddress;
        this.streetName = street;
        this.postCode = thePostCode;
    }

    getFirstName(){
        return this.firstname;
    }


    get surname() {
        return this.lastname;
    }

    get dateOfBirth() {
        return this.birthday;
    }

    get emailAddress() {
        return this.email;
    }

    get street() {
        return this.streetName;
    }

    get thePostCode() {
        return this.postCode;
    }
}

module.exports = Account;