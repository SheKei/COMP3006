class Account {

    constructor(theUerID,forename, surname, dateOfBirth, emailAddress, street, thePostCode, thePassword) {
        this.userID = theUerID;
        this.firstname =forename;
        this.lastname = surname;
        this.birthday = dateOfBirth;
        this.email = emailAddress;
        this.streetName = street;
        this.postCode = thePostCode;
        this.password = thePassword;
    }

    getUserID(){
        return this.userID;
    }

    getFirstName(){
        return this.firstname;
    }

    getSurname() {
        return this.lastname;
    }

    getDateOfBirth() {
        return this.birthday;
    }

    getEmailAddress() {
        return this.email;
    }

    getStreet() {
        return this.streetName;
    }

    getThePostCode() {
        return this.postCode;
    }

    getPassword(){
        return this.password;
    }
}

module.exports = Account;