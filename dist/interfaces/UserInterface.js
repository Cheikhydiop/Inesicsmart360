"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING"] = "pending";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["PROJECT_MANAGER"] = "project_manager";
    UserRole["SUPERVISOR"] = "supervisor";
    UserRole["TECHNICIAN"] = "technician";
    UserRole["CONTRACTOR"] = "contractor";
    UserRole["CLIENT"] = "client";
    UserRole["GOVERNMENT"] = "government";
    UserRole["CALL_CENTER"] = "call_center";
    UserRole["AUDITOR"] = "auditor";
    UserRole["CITIZEN"] = "citizen";
})(UserRole || (exports.UserRole = UserRole = {}));
