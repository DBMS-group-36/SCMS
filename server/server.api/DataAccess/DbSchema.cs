//using Microsoft.AspNetCore.Identity;

//using server.api.Identity;

//namespace server.api.DataAccess;

//public static class DbSchema
//{
//    public static Dictionary<Type, Table> Tables = new()
//    {
//        { 
//            typeof(SCMSUser), new() { 
//                Name = "users", 
//                Columns = {
//                    new("Id", "NVARCHAR(450)"),
//                    new("UserName", "NVARCHAR(256)"),
//                    new("NormalizedUserName", "NVARCHAR(256)"),
//                    new("Email", "NVARCHAR(256)"),
//                    new("NormalizedEmail", "NVARCHAR(256)"),
//                    new("EmailConfirmed", "BOOL"),
//                    new("PasswordHash", "LONGTEXT"),
//                    new("SecurityStamp", "LONGTEXT"),
//                    new("ConcurrencyStamp", "LONGTEXT"),
//                    new("PhoneNumber", "LONGTEXT"),
//                    new("PhoneNumberConfirmed", "BOOL"),
//                    new("TwoFactorEnabled", "BOOL"),
//                    new("LockoutEnd", "DATETIME"),
//                    new("LockoutEnabled", "BOOL"),
//                    new("AccessFailedCount", "INT"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('Id')",
//                    "UNIQUE KEY 'UserNameIndex' ('NormalizedUserName')",
//                    "KEY 'EmailIndex' ('NormalizedEmail')",
//                }
//            }
//        },
//        {
//            typeof(SCMSRole), new() {
//                Name = "roles",
//                Columns = {
//                    new("Id", "NVARCHAR(450)"),
//                    new("Name", "NVARCHAR(256)"),
//                    new("NormalizedName", "NVARCHAR(256)"),
//                    new("ConcurrencyStamp", "LONGTEXT"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('Id')",
//                    "UNIQUE KEY 'RoleNameIndex' ('NormalizedName')",
//                }
//            }
//        },
//        {
//            typeof(IdentityUserRole<string>), new() {
//                Name = "userroles",
//                Columns = {
//                    new("UserID", "NVARCHAR(450)"),
//                    new("RoleID", "NVARCHAR(450)"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('UserId','RoleId')",
//                    "KEY 'IX_UserRoles_RoleId' ('RoleId')",
//                    "CONSTRAINT 'userroles_ibfk_1' FOREIGN KEY ('RoleId') REFERENCES 'roles' ('Id') ON DELETE CASCADE",
//                    "CONSTRAINT 'userroles_ibfk_2' FOREIGN KEY ('UserId') REFERENCES 'users' ('Id') ON DELETE CASCADE",
//                }
//            }
//        },
//        {
//            typeof(IdentityUserClaim<string>), new() {
//                Name = "userclaims",
//                Columns = {
//                    new("Id", "INT"),
//                    new("UserID", "NVARCHAR(450)"),
//                    new("ClaimType", "LONGTEXT"),
//                    new("ClaimValue", "LONGTEXT"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('LoginProvider','ProviderKey')",
//                    "KEY 'IX_UserLogins_UserId' ('UserId')",
//                    "CONSTRAINT 'userlogins_ibfk_1' FOREIGN KEY ('UserId') REFERENCES 'users' ('Id') ON DELETE CASCADE",
//                }
//            }
//        },
//        {
//            typeof(IdentityRoleClaim<string>), new() {
//                Name = "roleclaims",
//                Columns = {
//                    new("Id", "INT"),
//                    new("RoleID", "NVARCHAR(450)"),
//                    new("ClaimType", "LONGTEXT"),
//                    new("ClaimValue", "LONGTEXT"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('Id')",
//                    "KEY 'IX_RoleClaims_RoleId' ('RoleId')",
//                    "CONSTRAINT 'roleclaims_ibfk_1' FOREIGN KEY ('RoleId') REFERENCES 'roles' ('Id') ON DELETE CASCADE",
//                }
//            }
//        },
//        {
//            typeof(IdentityUserLogin<string>), new() {
//                Name = "userlogins",
//                Columns = {
//                    new("LoginProvider", "NVARCHAR(128)"),
//                    new("ProviderKey", "NVARCHAR(128)"),
//                    new("ProviderDisplayName", "LONGTEXT"),
//                    new("UserId", "NVARCHAR(450)"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('Id')",
//                    "KEY 'IX_RoleClaims_RoleId' ('RoleId')",
//                    "CONSTRAINT 'roleclaims_ibfk_1' FOREIGN KEY ('RoleId') REFERENCES 'roles' ('Id') ON DELETE CASCADE",
//                }
//            }
//        },
//        {
//            typeof(IdentityUserToken<string>), new() {
//                Name = "usertokens",
//                Columns = {
//                    new("UserId", "NVARCHAR(450)"),
//                    new("ProviderKey", "NVARCHAR(128)"),
//                    new("Name", "NVARCHAR(128)"),
//                    new("Value", "LONGTEXT"),
//                },
//                Constraints = {
//                    "PRIMARY KEY ('UserId','LoginProvider','Name')",
//                    "CONSTRAINT 'usertokens_ibfk_1' FOREIGN KEY ('UserId') REFERENCES 'users' ('Id') ON DELETE CASCADE",
//                }
//            }
//        }

//    };

//    public record Column(string Name, string Type, bool NotNull = false, bool Unique = false, bool AutoIncrement = false);
//    public record Table
//    {
//        public string Name { get; set; }
//        public List<Column> Columns { get; set; }
//        public List<string> Constraints { get; set; }
//    }
//}
