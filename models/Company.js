const sendPushNotification = require("../service/send_push_notification");
const httpErrors = require("../http/error");
const Messages = require("../common_string")["messages"];
const winston = require("winston");
const bcrypt = require("bcryptjs");
const Models = require("./dbmodel");
const schema = require("../utils/schema");
const { daysBetweenDates } = require("../utils/daysBetweenDates");
const { hoursBetweenDates } = require("../utils/hoursBetweenDates")
const getDate = require("../utils/getDate");
const { Op } = require("sequelize");

const Company = function (data) {
	console.log("info", data);
	this.data = data;
	this.errors = [];
};

Company.prototype.addEmployee = function () {
	return new Promise(async (resolve, reject) => {
		const {
			username,
			email,
			password1,
			password2,
			company_id,
			first_name_en,
			second_name_en,
			third_name_en,
			first_name_ar,
			second_name_ar,
			third_name_ar,
			family_name_en,
			family_name_ar,
			phone_no,
			gender,
			marital_status,
			department_id,
			designation_id,
			salary,
			street,
			area,
			city,
			bank_iban,
			image,
			social_security_number,
			work_start_time,
			work_end_time,
			start_date,
			dob,
			bank_id,
			branch_id,
			country_id,
			is_active,
		} = this.data;

		const { error } = schema.signupSchema.validate({
			username,
			email,
			password: password1,
			repeat_password: password2,
		});

		if (error)
			return reject(
				httpErrors.unauthorized("Invalid username or email or password")
			);

		if (password1 != password2)
			return reject(httpErrors.unauthorized("Password not matched"));

		// making hash of the password
		const hashedPassword = bcrypt.hashSync(password1, 8);

		try {
			const user = await Models.Users.create({
				user_type_id: 1,
				username,
				email,
				password: hashedPassword,
				is_active,
			});

			const employee = await Models.Employees.create({
				user_id: user.dataValues.id,
				company_id,
				first_name_en,
				second_name_en,
				third_name_en,
				first_name_ar,
				second_name_ar,
				third_name_ar,
				family_name_en,
				family_name_ar,
				phone_no,
				gender,
				marital_status,
				salary,
				street,
				area,
				city,
				bank_iban,
				image,
				social_security_number,
				work_start_time,
				work_end_time,
				dob,
				start_date,
			});

			if (department_id) {
				await Models.EmployeeDepartments.create({
					employee_id: employee.dataValues.id,
					department_id,
				});
			}

			if (designation_id) {
				await Models.EmployeeDesignations.create({
					employee_id: employee.dataValues.id,
					designation_id,
				});
			}

			if (bank_id && branch_id) {
				await Models.UserBankBranches.create({
					user_id: user.dataValues.id,
					bank_id,
					branch_id,
				});
			}

			if (country_id) {
				await Models.UserCountries.create({
					user_id: user.dataValues.id,
					country_id,
				});
			}

			return resolve();
		} catch (err) {
			winston.log("error", err);
			console.log(err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.allEmployeeInfo = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {

            const users = await Models.Users.findAll({
                where: {
                    user_type_id: 1,
                    '$employee_info.company_id$': company_id
				},
				include: [
					{
						model: Models.UserTypes,
						as: "user_in_user_type",
					},
					{
                        model: Models.Employees,
                        // required: true,
                        as: "employee_info",
						include: [
							{
								model: Models.EmployeeDepartments,
								include: [
									{
                                        model: Models.Departments,
                                        include: [
                                            {
                                                model: Models.Employees,
                                                include: [
                                                    {
                                                        model: Models.Users
                                                    }
                                                ]
                                            }
                                        ]
									},
								],
							},
							{
								model: Models.EmployeeDesignations,
								include: [
									{
										model: Models.Designations,
									},
								],
                            },
                            {
                                model: Models.EmployeeCompanyBranches,
                                include: [
                                    {
                                        model: Models.CompanyBranches
                                    }
                                ]
                            }
						],
					},
					{
						model: Models.UserBankBranches,
						include: [
							{
								model: Models.Banks,
							},
							{
								model: Models.Branches,
							},
						],
					},
					{
						model: Models.UserCountries,
						as: "user_country_in_user",
						include: [
							{
								model: Models.Countries,
							},
						],
					},
				],
				attributes: {
					exclude: ["otp"],
				},
			});

			

			if (users) return resolve(users);
			return reject(httpErrors.notFound());
		} catch (err) {
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.oneEmployeeInfo = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, username } = this.data;

		if (!(company_id && username)) return reject(httpErrors.unauthorized());

		try {
			const user = await Models.Users.findOne({
				where: {
					username,
				},
				include: [
					{
						model: Models.UserTypes,
						as: "user_in_user_type",
					},
					{
						model: Models.Employees,
						as: "employee_info",
						include: [
							{
								model: Models.EmployeeDepartments,
								include: [
									{
										model: Models.Departments,
									},
								],
							},
							{
								model: Models.EmployeeDesignations,
								include: [
									{
										model: Models.Designations,
									},
								],
							},
						],
					},
					{
						model: Models.UserBankBranches,
						include: [
							{
								model: Models.Banks,
							},
							{
								model: Models.Branches,
							},
						],
					},
					{
						model: Models.UserCountries,
						as: "user_country_in_user",
						include: [
							{
								model: Models.Countries,
							},
						],
					},
				],
				attributes: {
					exclude: ["otp"],
				},
			});

			if (user) return resolve(user);
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log("error employee info =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.updateEmployeeInfo = function () {
	return new Promise(async (resolve, reject) => {
		const {
			company_id,
            employee_id,
            
			first_name_en,
			second_name_en,
			third_name_en,
			first_name_ar,
			second_name_ar,
            third_name_ar,
            family_name_en,
            family_name_ar,

            username,
            email,
            password1,
            password2,
			phone_no, 
			is_active,

			gender,
			marital_status,
            country_id,
			social_security_number,
			dob,

			street,
			area,
            city,
            
			image,
			

            
			bank_id,
			branch_id,
            bank_iban,
            
			department_id,
			designation_id,
            salary,
            work_start_time,
			work_end_time,
		} = this.data;

        if (!(company_id, employee_id)) return reject(httpErrors.unauthorized());
        
        if (password1 != password2)
            return reject(httpErrors.unauthorized("Password not matched"));
    

		try {
			const user = await Models.Employees.findOne({
				where: {
					id: employee_id,
					company_id,
				},
			});
			

			if (user) {
				if (image) user.update({ image });
				if (first_name_en) user.update({ first_name_en });
				if (second_name_en) user.update({ second_name_en });
				if (third_name_en) user.update({ third_name_en });
				if (first_name_ar) user.update({ first_name_ar });
				if (second_name_ar) user.update({ second_name_ar });
				if (third_name_ar) user.update({ third_name_ar });
				if (phone_no) user.update({ phone_no });
				if (gender) user.update({ gender });
				if (marital_status) user.update({ marital_status });
				if (street) user.update({ street });
				if (area) user.update({ area });
				if (city) user.update({ city });
				if (salary) user.update({ salary });
				if (bank_iban) user.update({ bank_iban });
				if (social_security_number) user.update({ social_security_number });
				if (work_start_time) user.update({ work_start_time });
				if (work_end_time) user.update({ work_end_time });
                if (dob) user.update({ dob });
                if(family_name_en) user.update({ family_name_en })
                if(family_name_ar) user.update({ family_name_ar })
                
                if(is_active){
                    await Models.Users.update(
                        { is_active: (is_active == 1) ? "1" : "0" },
                        {
                            where: {
                                id: user.dataValues.user_id,
                            },
                        }
                    );
                }

                // updating password
                if(password1 && password2){
                    const hashedPassword = bcrypt.hashSync(password1, 8);

                    await Models.Users.update({
                        password: hashedPassword
                    },
                    {
                        where: {
                            id: user.dataValues.user_id,
                        },
                    })
                }

                // updating department
				if (department_id) {
                    const department = await Models.EmployeeDepartments.findOne({
                        where: {
                            employee_id
                        }
                    })
                    
                    if(department) department.update({ department_id })
                    else {
                        await Models.EmployeeDepartments.create({ 
                            department_id,
                            employee_id
                        })
                    }
				}

                // updating position
				if (designation_id) {
					const designation = await Models.EmployeeDesignations.findOne({
                        where: {
                            employee_id
                        }
                    })
                    
                    if(designation) designation.update({ designation_id })
                    else {
                        await Models.EmployeeDesignations.create({ 
                            designation_id,
                            employee_id
                        })
                    }
				}
                
                // updating country
                if (country_id) {
                    const country = await Models.UserCountries.findOne({
                        where: {
                            user_id: user.dataValues.user_id
                        }
                    })
                    
                    if(country) country.update({ country_id })
                    else {
                        await Models.UserCountries.create({ 
                            country_id,
                            user_id: user.dataValues.user_id,
                        })
                    }
                }

                // updating bank
                if (bank_id) {
                    const bank = await Models.UserBankBranches.findOne({
                        where: {
                            user_id: user.dataValues.user_id
                        }
                    })
                    
                    if(bank) bank.update({ bank_id })
                    else {
                        await Models.UserBankBranches.create({ 
                            bank_id,
                            user_id: user.dataValues.user_id,
                        })
                    }
                }

                // updating branch
                if (branch_id) {
                    const branch = await Models.UserBankBranches.findOne({
                        where: {
                            user_id: user.dataValues.user_id
                        }
                    })
                    
                    if(branch) branch.update({ branch_id })
                    else {
                        await Models.UserBankBranches.create({ 
                            branch_id,
                            user_id: user.dataValues.user_id,
                        })
                    }
                }
				return resolve(user);
			}
			return reject(httpErrors.unauthorized());
		} catch (err) {
			console.log("error update employee info =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.getAttendanceList = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const attendanceList = await Models.Attendances.findAll({
				where: {
					company_id,
				},
				include: [
					{
						model: Models.Employees,
						include: [
							{
								model: Models.Users,
								attributes: ["username"],
							},
						],
						attributes: [
							"first_name_en",
							"second_name_en",
							"third_name_en",
							"first_name_ar",
							"second_name_ar",
							"third_name_ar",
						],
					},
				],
			});

			if (attendanceList) return resolve(attendanceList);
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log("ERROR one employee attendance list ", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.changeAttendanceRequestStatus = function () {
	return new Promise(async (resolve, reject) => {
		const { id, status } = this.data;

		if (!(id && status)) return reject(httpErrors.unauthorized());

		Models.Attendances.findOne({
			where: {
				id,
			},
		})
			.then(async (attendanceRequest) => {
				if (attendanceRequest) {
					attendanceRequest.update({ status });

					const userInfo = await Models.Employees.findOne({
						where: {
							id: attendanceRequest.dataValues.employee_id,
						},
						include: [
							{
								model: Models.Users,
							},
						],
					});

					const registrationToken = await getDeviceId(
						userInfo.dataValues.user.dataValues.id
					);
                    
          if(registrationToken) {
            const payload = {
                notification: {
                    title: "Attendance Request",
                    body: `Your attendance request has been ${status}`,
                },
            };
            sendPushNotification(registrationToken, payload);
          }

					return resolve(Messages["en"].SUCCESS_UPDATE);
				}
				return reject(httpErrors.notFound());
			})
			.catch((err) => {
				console.log("ERROR in change attendance request status", err);
				return reject(httpErrors.internalServerError());
			});
	});
};

Company.prototype.getLeaveRequestsList = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;
		console.log(company_id);

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const leaveRequestList = await Models.EmployeeLeaveRequests.findAll({
				where: {
					company_id,
				},
				include: [
					{
						model: Models.LeaveTypes,
					},
					{
						model: Models.Employees,
						include: [
							{
								model: Models.Users,
								attributes: ["username"],
							},
						],
						attributes: [
							"first_name_en",
							"second_name_en",
							"third_name_en",
							"first_name_ar",
							"second_name_ar",
							"third_name_ar",
						],
					},
				],
			});

			if (!leaveRequestList) reject(httpErrors.notFound());

			console.log(typeof daysBetweenDates);
			leaveRequestList.forEach((item) => {
				const days = daysBetweenDates(
					item.dataValues.start_date_time,
					item.dataValues.end_date_time
				);
				item.dataValues.days = days;
			});
			console.log(leaveRequestList);

			return resolve(leaveRequestList);
		} catch (err) {
			console.log("ERROR company leave requests list ", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.changeLeaveRequestStatus = function () {
	return new Promise(async (resolve, reject) => {
		const { id, status } = this.data;

		if (!(id && status)) return reject(httpErrors.unauthorized());

		Models.EmployeeLeaveRequests.findOne({
			where: {
				id,
			},
		})
			.then(async (leaveRequest) => {
				if (leaveRequest) {
          leaveRequest.update({ status });
          
          if(status == 'accepted') await decreaseAvailableLeave(leaveRequest)

					const userInfo = await Models.Employees.findOne({
						where: {
							id: leaveRequest.dataValues.employee_id,
						},
						include: [
							{
								model: Models.Users,
							},
						],
					});

					const registrationToken = await getDeviceId(
						userInfo.dataValues.user.dataValues.id
          );
          
          if(registrationToken) {
            const payload = {
              notification: {
                title: "Leave Request",
                body: `Your leave request has been ${status}`,
              },
            };
            sendPushNotification(registrationToken, payload);
          }

					return resolve(Messages["en"].SUCCESS_UPDATE);
				}
				return reject(httpErrors.notFound());
			})
			.catch((err) => {
				console.log("ERROR in change leave request status", err);
				return reject(httpErrors.internalServerError());
			});
	});
};

Company.prototype.showAvailableLeaves = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, employee_id } = this.data;

		if (!(employee_id && company_id)) return reject(httpErrors.unauthorized());

		try {
			const available_leaves = await Models.LeaveTypes.findAll({
				where: {
					company_id,
				},
			});

			const getDone = async () => {
				return Promise.all(
					available_leaves.map(async (m) => {
						const individual_leave = await Models.EmployeeAvailableLeaveNumbers.findOne(
							{
								where: {
                  leave_type_id: m.dataValues.id,
                  employee_id,
                  company_id
								},
							}
						);

						// yet individually not updated
						// so blindly copy it
						if (
							individual_leave &&
							!individual_leave.dataValues.is_individual
						) {
							individual_leave.update({
								available_leaves: m.dataValues.available_number,
							});
						} else if (!individual_leave) {
							await Models.EmployeeAvailableLeaveNumbers.create({
								employee_id,
								company_id,
								leave_type_id: m.dataValues.id,
								available_leaves: m.dataValues.available_number,
							});
						}
						return Promise.resolve("completed");
					})
				);
			};

			await getDone();

			const leaveBalance = await Models.Employees.findOne({
				where: {
					id: employee_id,
				},
				include: [
					{
						model: Models.EmployeeAvailableLeaveNumbers,
						include: [
							{
								model: Models.LeaveTypes,
							},
						],
						attributes: ["id", "available_leaves", "accepted_leave_number"],
					},
				],
      });
      
      console.log(leaveBalance)
      for(let i=0; leaveBalance && i<leaveBalance.dataValues.employee_available_leave_numbers.length; i++){
        const m = leaveBalance.dataValues.employee_available_leave_numbers[i]
        m.dataValues.available_leaves -= m.dataValues.accepted_leave_number
      }

			if (leaveBalance) return resolve(leaveBalance);

			return reject(httpErrors.notFound());
		} catch (err) {
			console.log("Available leaves error =======================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
	// return new Promise(async (resolve, reject) => {
	//   const { employee_id } = this.data;
	//   console.log('Available leaves =============>', employee_id)

	// 	if (!employee_id) return reject(httpErrors.unauthorized());

	// 	try {
	// const leaveBalance = await Models.Employees.findOne({
	// 	where: {
	// 		id: employee_id,
	// 	},
	// 	include: [
	// 		{
	//       model: Models.EmployeeAvailableLeaveNumbers,
	//       include: [
	//         {
	//           model: Models.LeaveTypes
	//         }
	//       ],
	//       attributes: ["id", "available_leaves"]
	// 		},
	// 	],
	// });

	// if (leaveBalance) return resolve(leaveBalance);

	// return reject(httpErrors.notFound());
	// 	} catch (err) {
	// 		console.log("Available leaves error =======================>", err);
	// 		return reject(httpErrors.internalServerError());
	// 	}
	// });
};

Company.prototype.leaveTypes = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;

		Models.LeaveTypes.findAll({
			where: {
				company_id,
			},
		})
			.then((response) => {
				return resolve(response);
			})
			.catch((err) => {
				console.log("ERROR in leave types", err);
				return reject(httpErrors.internalServerError());
			});
	});
};

Company.prototype.createLeaveType = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id, leave_name, type, available_number } = this.data;

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const leave = await Models.LeaveTypes.findOne({
				where: {
					id,
				},
			});

			// const registrationTokens = await getAllDevices(company_id);

			if (leave) {
				if (leave_name) leave.update({ name: leave_name });
				if (type) leave.update({ type });
        if (available_number) leave.update({ available_number });
        
				// const payload = {
				// 	notification: {
				// 		title: "Transaction Updation",
				// 		body: `${leave_name} is updated`,
				// 	},
				// };
				// sendPushNotification(registrationTokens, payload);

				return resolve(leave);
			}

			const response = await Models.LeaveTypes.create({
				company_id,
				name: leave_name,
        type,
        available_number
			});

			// const payload = {
			// 	notification: {
			// 		title: "New Transaction Created",
			// 		body: `${leave_name} is created`,
			// 	},
			// };
			// sendPushNotification(registrationTokens, payload);

			return resolve(response);
		} catch (err) {
			console.log("ERROR in creating leave types", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.deleteLeaveType = function () {
	return new Promise(async (resolve, reject) => {
		const { id } = this.data;
		try {
			const response = await Models.LeaveTypes.destroy({
				where: {
					id,
				},
			});

			if (response) return resolve("deleted");
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log("ERROR in deleting leave types", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.updateAvailableLeave = function () {
	return new Promise(async (resolve, reject) => {
		const {
			employee_id,
			company_id,
			leave_id,
			available_leave_number,
		} = this.data;
		try {
			const response = await Models.EmployeeAvailableLeaveNumbers.findOne({
				where: {
					employee_id,
					company_id,
					leave_type_id: leave_id,
				},
			});

			const general_leave = await Models.LeaveTypes.findOne({
				where: {
					id: leave_id,
				},
			});

			if (general_leave.dataValues.available_number < available_leave_number) {
				return reject(
					httpErrors.unauthorized(
						`Available leave can not be greater than ${general_leave.dataValues.available_number}`
					)
				);
			}

			if (response.dataValues.accepted_leave_number > available_leave_number) {
				return reject(
					httpErrors.unauthorized(
						`Available leave can not be less than ${response.dataValues.accepted_leave_number}`
					)
				);
			}

			if (response) {
				response.update({
					available_leaves: available_leave_number,
					is_individual: "1",
				});
				return resolve(response);
			}

			await Models.EmployeeAvailableLeaveNumbers.create({
				employee_id,
				company_id,
				leave_type_id: leave_id,
				available_leaves: available_leave_number,
			});
			return resolve("success");
		} catch (err) {
			console.log("ERROR in creating available leave number", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.getInfo = function () {
	return new Promise(async (resolve, reject) => {
		const { user_id } = this.data;

		console.log("ha ha ===============================================>");
		if (!user_id) return reject(httpErrors.unauthorized());

		try {
			const user = await Models.Users.findOne({
				where: {
					id: user_id,
				},
				include: [
					{
						model: Models.UserTypes,
						as: "user_in_user_type",
					},
					{
						model: Models.Companies,
						include: [
							{
								model: Models.CompanyBranches,
							},
							{
								model: Models.Departments,
								include: [
									{
										model: Models.Employees,
										include: [
											{
												model: Models.Users,
												attributes: ["id", "username"],
											},
										],
										attributes: ["id"],
									},
								],
							},
							{
								model: Models.Designations,
							},
						],
					},
					{
						model: Models.UserBankBranches,
						include: [
							{
								model: Models.Banks,
							},
							{
								model: Models.Branches,
							},
						],
					},
					{
						model: Models.UserCountries,
						as: "user_country_in_user",
						include: [
							{
								model: Models.Countries,
							},
						],
					},
				],
				attributes: {
					exclude: ["otp"],
				},
			});

			if (user) return resolve(user);
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log("ERROR in getting company info", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.addCompanyBranch = function () {
	return new Promise(async (resolve, reject) => {
		const {
			company_id,
			id,
			branch_name,
			street,
			area,
			city,
			latitude,
			longitude,
		} = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			if (id) {
				const response = await Models.CompanyBranches.update(
					{
						branch_name,
						street,
						area,
						city,
						latitude,
						longitude,
					},
					{
						where: {
							id,
						},
					}
				);

				if (response) return resolve(response);
				return reject(httpErrors.notFound());
			}

			const added_branch = Models.CompanyBranches.create({
				company_id,
				branch_name,
				street,
				area,
				city,
				latitude,
				longitude,
			});
			resolve(added_branch);
		} catch (err) {
			console.log(
				"error in creating company branch =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.deleteCompanyBranch = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const added_branch = Models.CompanyBranches.destroy({
				where: {
					id,
				},
			});
			resolve("deleted");
		} catch (err) {
			console.log(
				"error in deleting company branch =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.createDepartment = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id, name, supervisor_id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			if (id) {
				const updated_department = await Models.Departments.findOne({
					where: {
						id,
					},
				});
				if (updated_department) {
					if (name) updated_department.update({ name });
					if (supervisor_id) updated_department.update({ supervisor_id });
					return resolve("updated");
				}
				return reject(httpErrors.notFound());
			}

			const added_department = Models.Departments.create({ company_id, name });
			resolve(added_department);
		} catch (err) {
			console.log("error in adding department =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.deleteDepartment = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const deleted_department = Models.Departments.destroy({
				where: {
					id,
				},
			});
			if (deleted_department) return resolve(deleted_department);
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log(
				"error in deleting department =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.createDesignation = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id, name } = this.data;

		if (!(company_id && name)) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const updated_designation = await Models.Designations.update(
				{ name },
				{
					where: {
						id,
					},
				}
			);

			if (id)
				return updated_designation
					? resolve("updated")
					: reject(httpErrors.notFound());

			const added_designation = Models.Designations.create({
				company_id,
				name,
			});
			resolve(added_designation);
		} catch (err) {
			console.log("error in adding department =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.deleteDesignation = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const deleted_designation = Models.Designations.destroy({
				where: {
					id,
				},
			});
			if (deleted_designation) return resolve(deleted_designation);
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log(
				"error in deleting desgination =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.updateInfo = function () {
	return new Promise(async (resolve, reject) => {
		const {
			company_id,
			name_en,
			name_ar,
			contact_person_name_en,
			contact_person_name_ar,
            country_id,
            
            username,
            email,
            password1,
            password2,
			phone_no,
			is_active,

			social_security_number,
			image,

			license_start_date,
			license_end_date,
			users_limit,
			branches_limit,
		} = this.data;

        if (!company_id) return reject(httpErrors.unauthorized());
        
        if (password1 != password2)
            return reject(httpErrors.unauthorized("Password not matched"));

		try {
			const user = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});


			if (user) {
				if (image) user.update({ image });
				if (name_en) user.update({ name_en });
				if (name_ar) user.update({ name_ar });
				if (contact_person_name_en) user.update({ contact_person_name_en });
				if (contact_person_name_ar) user.update({ contact_person_name_ar });
				if (phone_no) user.update({ phone_no });
				
				if (license_start_date) user.update({ license_start_date });
				if (license_end_date) user.update({ license_end_date });
				if (users_limit) user.update({ users_limit });
                if (branches_limit) user.update({ branches_limit });
                
                // updating is_active or status of the user
                if(is_active) {
                    await Models.Users.update(
                        { is_active: (is_active == 1) ? "1" : "0" },
                        {
                            where: {
                                id: user.dataValues.user_id,
                            },
                        }
                    );
                }

                // updating password
                if(password1 && password2) {
                    const hashedPassword = bcrypt.hashSync(password1, 8);

                    await Models.Users.update({
                        password: hashedPassword
                    },
                    {
                        where: {
                            id: user.dataValues.user_id,
                        },
                    })
                }
                
                // updating country
                if (country_id) {
                    const country = await Models.UserCountries.findOne({
                        where: {
                            user_id: user.dataValues.user_id
                        }
                    })
                    
                    if(country) country.update({ country_id })
                    else {
                        await Models.UserCountries.create({ 
                            country_id,
                            user_id: user.dataValues.user_id,
                        })
                    }
                }
                
				return resolve(user);
			}
			return reject(httpErrors.unauthorized());
		} catch (err) {
			console.log("error update company info =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.deleteEmployeeAvailableleave = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const deletedItem = Models.EmployeeAvailableLeaveNumbers.destroy({
				where: {
					id,
				},
			});
			if (deletedItem) return resolve(deletedItem);
			return reject(httpErrors.notFound());
		} catch (err) {
			console.log("error in deleting =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.addEmployeeInBranch = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id, employee_id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const employee = await Models.EmployeeCompanyBranches.findOne({
				where: {
					employee_id,
				},
			});

			if (!employee) {
				await Models.EmployeeCompanyBranches.create({
					employee_id,
					company_branch_id: id,
				});
				return resolve("success");
			}

			console.log(employee);

			await Models.EmployeeCompanyBranches.update(
				{ company_branch_id: id },
				{
					where: {
						id: employee.dataValues.id,
					},
				}
			);
			return resolve("success");
		} catch (err) {
			console.log(
				"error in adding or updating =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.isPossibleToCreateEmployee = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			const total_employees = await Models.Employees.count({
				where: {
					company_id: company_id,
				},
			});

			if (total_employees >= company.dataValues.users_limit) {
				return reject(httpErrors.exceedLimit(`Your limit exceeded to create`));
			}
			return resolve("success");
		} catch (err) {
			console.log(
				"error in adding or updating =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.isPossibleToCreateBranch = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id, id } = this.data;

		if (!company_id) return reject(httpErrors.unauthorized());

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
				},
			});
			if (!company) return reject(httpErrors.unauthorized());

			if (id) return resolve("success");

			const total_branches = await Models.CompanyBranches.count({
				where: {
					company_id: company_id,
				},
			});

			if (total_branches >= company.dataValues.branches_limit) {
				return reject(httpErrors.exceedLimit(`Your limit exceeded to create`));
			}
			return resolve("success");
		} catch (err) {
			console.log(
				"error in adding or updating =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.notExpired = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;

		if (!company_id) return resolve("success");

		try {
			console.log("cdd", company_id);
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
					license_start_date: {
						[Op.lte]: getDate(new Date()),
					},
					license_end_date: {
						[Op.gte]: getDate(new Date()),
					},
				},
			});

			if (!company)
				return reject(
					httpErrors.expired(
						"You are expired, please subscribe again to get service"
					)
				);

			return resolve("success");
		} catch (err) {
			console.log(
				"error in adding or updating =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

Company.prototype.isActive = function () {
	return new Promise(async (resolve, reject) => {
		const { company_id } = this.data;

		if (!company_id) return resolve("success");

		try {
			const company = await Models.Companies.findOne({
				where: {
					id: company_id,
                },
                include: [
                    {
                        model: Models.Users,
                    },
                ],
            });

            if(company && company.dataValues.user.dataValues.is_active == 1) return resolve();

            return reject(
                httpErrors.deActivated(
                    "Your account is deactivated, please contact with your management"
                )
            );
        } 
        catch (err) {
			console.log(
				"error in adding or updating =========================>",
				err
			);
			return reject(httpErrors.internalServerError());
		}
	});
};

async function getDeviceId(id) {
	try {
		const user = await Models.Users.findOne({
			where: {
				id,
			},
		});
		return user.dataValues.device_id;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function getAllDevices(company_id) {
	try {
		const employees = await Models.Employees.findAll({
			where: {
				company_id,
			},
			include: [
				{
					model: Models.Users,
				},
			],
		});

		const registrationTokens = employees.map(
			(m) => m.dataValues.user.dataValues.device_id
		);
		return registrationTokens;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function decreaseAvailableLeave(leaveRequest){
  try{
    const leave_type = await Models.LeaveTypes.findOne({
      where: {
        id: leaveRequest.dataValues.leave_type_id
      }
    })

    console.log('leave type =============>', leave_type)
  
  
    const employee_available_leave = await Models.EmployeeAvailableLeaveNumbers.findOne({
      where: {
        leave_type_id: leaveRequest.dataValues.leave_type_id,
        employee_id: leaveRequest.dataValues.employee_id
      }
    })

    console.log('employee available leave ==================>', employee_available_leave)
  
    let accept = 0
  
    if(leave_type.dataValues.type == 'vacation'){
      accept = daysBetweenDates(
        leaveRequest.dataValues.start_date_time, 
        leaveRequest.dataValues.end_date_time
      )
    }
    else{
      accept = hoursBetweenDates(
        leaveRequest.dataValues.start_date_time, 
        leaveRequest.dataValues.end_date_time
      )
    }
  
    accept += employee_available_leave.dataValues.accepted_leave_number
    employee_available_leave.update({ accepted_leave_number: accept })
  }
  catch(err){
    console.log(err)
  }
}

module.exports = Company;
