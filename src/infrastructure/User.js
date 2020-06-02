export default class User {

    id;
    email;
    name;
    roles;
    preferences;

    static getGuest() {
        return new User(-1, "", "Guest", [], {});
    }

    constructor(id, email, name, roles, preferences) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.preferences = preferences;
    }

    isReal() {
        return this.id !== -1;
    }

    hasRole(rolesToCheck) {
        if (Array.isArray(rolesToCheck)) {
            const role = rolesToCheck.find(role => this.roles.includes(role));
            return Boolean(role);
        } else {
            const role = this.roles.includes(rolesToCheck);
            return Boolean(role);
        }
    }
}
