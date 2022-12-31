const Sequelize = require("sequelize");
const env = "dev";
const config = require("../config.json")[env];
const password = config?.password ? config?.password : null;

const sequelize = new Sequelize(config?.database, config?.user, config?.password, {
	logging: console.log,
	dialect: "mysql",
	define: {
		timestamps: false
	},
	sync: true
});

exports.sequelize =  sequelize


exports.UserTypes = sequelize.define("user_types", {
	name: { type: Sequelize.STRING },
	is_active: { type: Sequelize.ENUM("1", "0") },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.UserCountries = sequelize.define("user_countries", {
    user_id: { type: Sequelize.INTEGER },
    country_id: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.UserBankBranches = sequelize.define("user_bank_branches", {
    user_id: { type: Sequelize.INTEGER },
    bank_id: { type: Sequelize.INTEGER },
    branch_id: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.Users = sequelize.define("users", {
	user_type_id: { type: Sequelize.INTEGER },
	username: { type: Sequelize.STRING },
	email: { type: Sequelize.STRING },
	password: { type: Sequelize.STRING },
    otp: { type: Sequelize.STRING },
    device_id: { type: Sequelize.STRING },
    latitude: { type: Sequelize.STRING },
    longitude: { type: Sequelize.STRING },
	is_active: { type: Sequelize.ENUM("1", "0") },
	online_status: { type: Sequelize.ENUM("online", "offline") },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.Employees = sequelize.define("employees", {
    user_id: { type: Sequelize.INTEGER },
	company_id: { type: Sequelize.INTEGER },
	first_name_en: { type: Sequelize.STRING },
	second_name_en: { type: Sequelize.STRING },
	third_name_en: { type: Sequelize.STRING },
	first_name_ar: { type: Sequelize.STRING },
	second_name_ar: { type: Sequelize.STRING },
    third_name_ar: { type: Sequelize.STRING },
    family_name_en: { type: Sequelize.STRING },
    family_name_ar: { type: Sequelize.STRING },
	phone_no: { type: Sequelize.STRING },
	gender: { type: Sequelize.ENUM("Male", "Female") },
    marital_status: { type: Sequelize.ENUM("Married", "Unmarried") },
    street: { type: Sequelize.STRING },
    area: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
	department: { type: Sequelize.STRING },
	job_title: { type: Sequelize.STRING },
	salary: { type: Sequelize.STRING },
	bank_iban: { type: Sequelize.STRING },
	image: { type: Sequelize.STRING },
	social_security_number: { type: Sequelize.STRING },
	work_start_time: { type: Sequelize.TIME },
	work_end_time: { type: Sequelize.TIME },
    dob: { type: Sequelize.DATE },
    start_date: { type: Sequelize.DATE },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.Companies = sequelize.define("companies", {
    user_id: { type: Sequelize.INTEGER },
	name_en: { type: Sequelize.STRING },
    name_ar: { type: Sequelize.STRING },
    contact_person_name_en: { type: Sequelize.STRING },
    contact_person_name_ar: { type: Sequelize.STRING },
	phone_no: { type: Sequelize.STRING },
	bank_iban: { type: Sequelize.STRING },
	image: { type: Sequelize.STRING },
	social_security_number: { type: Sequelize.STRING },
	work_start_time: { type: Sequelize.TIME },
    work_end_time: { type: Sequelize.TIME },
    license_start_date: { type: Sequelize.DATE },
    license_end_date: { type: Sequelize.DATE },
    users_limit: { type: Sequelize.INTEGER },
    branches_limit: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.CompanyBranches = sequelize.define("company_branches", {
    company_id: { type: Sequelize.INTEGER },
    branch_name: { type: Sequelize.STRING },
    street: { type: Sequelize.STRING },
    area: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    latitude: { type: Sequelize.STRING },
    longitude: { type: Sequelize.STRING },
    created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
})

exports.LeaveTypes = sequelize.define("leave_types", {
    company_id: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    type: { type: Sequelize.ENUM("leave", "vacation") },
    available_number: { type: Sequelize.INTEGER },
	is_active: { type: Sequelize.ENUM("1", "0") },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.EmployeeLeaveRequests = sequelize.define("employee_leave_requests", {
	employee_id: { type: Sequelize.INTEGER },
	company_id: { type: Sequelize.INTEGER },
	leave_type_id: { type: Sequelize.INTEGER },
	start_date_time: { type: Sequelize.DATE },
	end_date_time: { type: Sequelize.DATE },
	note: { type: Sequelize.STRING },
	image: { type: Sequelize.STRING },
	status: { type: Sequelize.ENUM("accepted", "rejected", "pending") },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.Attendances = sequelize.define("attendances", {
	employee_id: { type: Sequelize.INTEGER },
	company_id: { type: Sequelize.INTEGER },
	attendance_date: { type: Sequelize.DATE },
	punch_in: { type: Sequelize.TIME },
	punch_out: { type: Sequelize.TIME },
	latitude: { type: Sequelize.STRING },
    longitude: { type: Sequelize.STRING },
    note: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM("accepted", "rejected", "pending") },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


exports.EmployeeAvailableLeaveNumbers = sequelize.define("employee_available_leave_numbers", {
    employee_id: { type: Sequelize.INTEGER },
    company_id: { type: Sequelize.INTEGER },
    leave_type_id: { type: Sequelize.INTEGER },
    available_leaves: { type: Sequelize.INTEGER },
    is_individual: { type: Sequelize.ENUM("1", "0") },
    accepted_leave_number: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


exports.Countries = sequelize.define("countries", {
	name: { type: Sequelize.STRING },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.Banks = sequelize.define("banks", {
    name: { type: Sequelize.STRING },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE }
});

exports.Branches = sequelize.define("branches", {
    bank_id: { type: Sequelize.INTEGER },
	name: { type: Sequelize.STRING },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


exports.Departments = sequelize.define("departments", {
    company_id: { type: Sequelize.INTEGER },
    supervisor_id: { type: Sequelize.INTEGER },
	name: { type: Sequelize.STRING },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


exports.EmployeeDepartments = sequelize.define("employee_departments", {
    employee_id: { type: Sequelize.INTEGER },
    department_id: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


exports.Designations = sequelize.define("designations", {
    company_id: { type: Sequelize.INTEGER },
	name: { type: Sequelize.STRING },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});

exports.EmployeeDesignations = sequelize.define("employee_designations", {
    employee_id: { type: Sequelize.INTEGER },
    designation_id: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


exports.EmployeeCompanyBranches = sequelize.define("employee_company_branches", {
    employee_id: { type: Sequelize.INTEGER },
    company_branch_id: { type: Sequelize.INTEGER },
	created_at: { type: Sequelize.DATE },
	updated_at: { type: Sequelize.DATE }
});


/* ------------------------------------------------- ASSOCIATIONS ----------------------------------*/

this.UserTypes.hasMany(this.Users, {
    foreignKey: "user_type_id",
    as: "users_in_user_type"
});

this.Users.belongsTo(this.UserTypes, {
    foreignKey: "user_type_id",
    as: "user_in_user_type"
});

this.Users.hasOne(this.Employees, {
    foreignKey: "user_id",
    as: "employee_info"
})

this.Employees.belongsTo(this.Users, {
    foreignKey: "user_id"
})

this.Users.hasOne(this.Companies, {
    foreignKey: "user_id"
})

this.Companies.belongsTo(this.Users, {
    foreignKey: "user_id"
})

this.Companies.hasMany(this.CompanyBranches, {
    foreignKey: "company_id"
})





this.Users.hasOne(this.UserCountries, {
    foreignKey: "user_id",
    as: "user_country_in_user"
})

this.Countries.hasMany(this.UserCountries, {
    foreignKey: "country_id"
})

this.UserCountries.belongsTo(this.Countries, {
    foreignKey: "country_id"
})






this.Users.hasOne(this.UserBankBranches, {
    foreignKey: "user_id"
})

this.Banks.hasMany(this.Branches, {
    foreignKey: "bank_id"
})

this.Banks.hasMany(this.UserBankBranches, {
    foreignKey: "bank_id"
})

this.UserBankBranches.belongsTo(this.Banks, {
    foreignKey: "bank_id"
})

this.Branches.hasMany(this.UserBankBranches, {
    foreignKey: "branch_id"
})

this.UserBankBranches.belongsTo(this.Branches, {
    foreignKey: "branch_id"
})




this.Employees.belongsToMany(this.LeaveTypes, {
    through: this.EmployeeAvailableLeaveNumbers,
    foreignKey: "employee_id"
});
  
this.LeaveTypes.belongsToMany(this.Employees, {
    through: this.EmployeeAvailableLeaveNumbers,
    foreignKey: "leave_type_id"
});



this.LeaveTypes.hasMany(this.EmployeeLeaveRequests, {
    foreignKey: "leave_type_id"
})

this.EmployeeLeaveRequests.belongsTo(this.LeaveTypes, {
    foreignKey: "leave_type_id"
})

this.Employees.hasMany(this.EmployeeLeaveRequests, {
    foreignKey: "employee_id"
})

this.EmployeeLeaveRequests.belongsTo(this.Employees, {
    foreignKey: "employee_id"
})




this.Employees.hasMany(this.Attendances, {
    foreignKey: "employee_id"
})

this.Attendances.belongsTo(this.Employees, {
    foreignKey: "employee_id"
})

this.Companies.hasMany(this.Employees, {
    foreignKey: "company_id"
})

this.Employees.belongsTo(this.Companies, {
    foreignKey: "company_id"
})





this.Companies.hasMany(this.Departments, {
    foreignKey: "company_id"
})
this.Departments.belongsTo(this.Companies, {
    foreignKey: "company_id"
})

this.Departments.belongsTo(this.Employees, {
    foreignKey: "supervisor_id"
})

this.Departments.hasMany(this.EmployeeDepartments, {
    foreignKey: "department_id"
})
this.EmployeeDepartments.belongsTo(this.Departments, {
    foreignKey: "department_id"
})
this.Employees.hasOne(this.EmployeeDepartments, {
    foreignKey: "employee_id"
})
this.EmployeeDepartments.belongsTo(this.Employees, {
    foreignKey: "employee_id"
})





this.Companies.hasMany(this.Designations, {
    foreignKey: "company_id"
})

this.Designations.hasMany(this.EmployeeDesignations, {
    foreignKey: "designation_id"
})

this.EmployeeDesignations.belongsTo(this.Designations, {
    foreignKey: "designation_id"
})

this.Employees.hasOne(this.EmployeeDesignations, {
    foreignKey: "employee_id"
})

this.Employees.hasMany(this.EmployeeAvailableLeaveNumbers, {
    foreignKey: "employee_id"
})

this.LeaveTypes.hasMany(this.EmployeeAvailableLeaveNumbers, {
    foreignKey: "leave_type_id"
})

this.EmployeeAvailableLeaveNumbers.belongsTo(this.LeaveTypes, {
    foreignKey: "leave_type_id"
})


this.Employees.hasOne(this.EmployeeCompanyBranches, {
    foreignKey: "employee_id"
})

this.CompanyBranches.hasMany(this.EmployeeCompanyBranches, {
    foreignKey: "company_branch_id"
})

this.EmployeeCompanyBranches.belongsTo(this.CompanyBranches, {
    foreignKey: "company_branch_id"
})