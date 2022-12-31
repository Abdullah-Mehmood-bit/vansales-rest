const sendPushNotification = require('../service/send_push_notification')
const httpErrors = require('../http/error')
const Messages = require("../common_string")["messages"];
const winston = require("winston");
const moment = require("moment");
const Models = require("../models/dbmodel");
const { daysBetweenDates } = require("../utils/daysBetweenDates")
const { hoursBetweenDates } = require("../utils/hoursBetweenDates")
const { distance } = require("../utils/distance")
const { Op } = require("sequelize");
const getDate = require('../utils/getDate')
const { utcDate } = require('../utils/compare-date')


const Employee = function (data) {
  console.log("info", data);
  this.data = data;
  this.errors = [];
};


Employee.prototype.getInfo = function () {
  return new Promise(async (resolve, reject) => {
    const { user_id } = this.data;

    if (!user_id) return reject(httpErrors.unauthorized())

    try {
      const user = await Models.Users.findOne({
        where: {
          id: user_id
        },
        include: [
          {
            model: Models.UserTypes,
            as: "user_in_user_type"
          },
          {
            model: Models.Employees,
            as: "employee_info",
            include: [
              { 
                model: Models.Companies,
                include: [
                  {
                    model: Models.CompanyBranches
                  }
                ]
              },
              {
                model: Models.EmployeeCompanyBranches,
                include: [
                  {
                    model: Models.CompanyBranches
                  }
                ]
              },
              {
                model: Models.EmployeeDepartments,
                include: [
                  {
                    model: Models.Departments,
                    include: [
                      {
                        model: Models.Employees
                      }
                    ]
                  }
                ]
              },
              {
                model: Models.EmployeeDesignations,
                include: [
                  {
                    model: Models.Designations,
                  }
                ]
              }
            ]
          },
          {
            model: Models.UserBankBranches,
            include: [
              {
                model: Models.Banks,
              },
              {
                model: Models.Branches
              }
            ]
          },
          {
            model: Models.UserCountries,
            as: "user_country_in_user",
            include: [
              {
                model: Models.Countries
              }
            ]
          }
        ],
        attributes: {
          exclude: [
            "otp",
            "password",
          ]
        }
      });

      winston.log("info", "info in validation" , user)
      console.log("Employee result ============>", user);

      if (user) return resolve(user)
      return reject(httpErrors.notFound())
    } 
    catch (err) {
      winston.log("error", err)
      winston.log("error", "getting errors, why?")
      console.log("error employee info =========================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};

Employee.prototype.checkIn = function () {
  return new Promise(async (resolve, reject) => {
    const { 
      company_id, 
      supervisor_user_id,
      employee_user_id,
      employee_id, 
      punch_in,
      latitude, 
      longitude 
    } = this.data;

    const attendance_date = moment().format('YYYY-MM-DD');
    
    let status = 'accepted'

    if(!supervisor_user_id) return reject(httpErrors.unauthorized('Supervisor is not assigned for you yet'))
    if(!punch_in) return reject(httpErrors.unauthorized('Check in time is required'))

    if (!(company_id &&
      supervisor_user_id &&
      employee_user_id &&
      employee_id && 
      latitude && 
      longitude
    )) return reject(httpErrors.unauthorized())
 

    try {
      const isValidEmployee = await Models.Employees.findOne({
        where: {
          id: employee_id,
          company_id: company_id
        },
        include: [
            {
              model: Models.Users
            }
        ]
      })

      if(!isValidEmployee) return reject(httpErrors.unauthorized())

      const result = await Models.Attendances.findAll({
        where:{
          employee_id,
          company_id
        }
      })
      
      const isSuccessfullyAttendedToday = result.filter( attendance => {
        return attendance.dataValues.attendance_date === attendance_date
      })

      if(isSuccessfullyAttendedToday.length) return resolve('Already checked in today')


      const company_branches = await Models.CompanyBranches.findAll({
        where:{
          company_id
        }
      })

      const isOffice = company_branches.filter( branch => {
        const dist = distance(latitude, longitude, branch.dataValues.latitude, branch.dataValues.longitude)
        return dist < 100
      })

      // is out of office
      if(!isOffice.length) status = 'pending'

      await Models.Attendances.create({
        employee_id,
        company_id,
        attendance_date,
        punch_in,
        latitude,
        longitude,
        status
      });

      if(isOffice.length) return resolve('Successfully checked in today')

      const registrationToken = await getDeviceId(supervisor_user_id)

      // otherwise it needs permission

      if(registrationToken) {
        const payload = {
          notification: {
            title: "Check In Request",
            body: `${isValidEmployee.dataValues.user.dataValues.username} has requested for check in`
          }
        }
        sendPushNotification(registrationToken, payload)
      }
      return resolve('Requested for attendance application')
    } 
    catch (err) {
      console.log("error employee attendance ======================>", err)
      return reject(httpErrors.internalServerError())
    }
  });
};

Employee.prototype.checkOut = function () {
  return new Promise(async (resolve, reject) => {

    const { 
      company_id, 
      supervisor_user_id,
      employee_user_id,
      employee_id, 
      punch_out,
      latitude, 
      longitude 
    } = this.data;

    let status = 'accepted'

    if(!supervisor_user_id) return reject(httpErrors.unauthorized('Supervisor is not assigned for you yet'))
    if(!punch_out) return reject(httpErrors.unauthorized('Check out time is required'))

    if (!(company_id && 
      supervisor_user_id &&
      employee_user_id &&
      employee_id && 
      latitude && 
      longitude
    )) return reject(httpErrors.unauthorized())

    try {
      const isValidEmployee = await Models.Employees.findOne({
        where: {
          id: employee_id
        },
        include: [
            {
              model: Models.Users
            }
        ]
      })

      if(!isValidEmployee) return reject(httpErrors.unauthorized())


      const company_branches = await Models.CompanyBranches.findAll({
        where:{
          company_id
        }
      })

      const isOffice = company_branches.filter( branch => {
        const dist = distance(latitude, longitude, branch.dataValues.latitude, branch.dataValues.longitude)
        return dist < 100
      })
      
      // is out of office
      if(!isOffice.length) status = 'pending'

      const attendance = await Models.Attendances.findOne({
        where: {
          employee_id
        },
        order: [["id", "DESC"]]
      });

      if(attendance) {
        attendance.update({ punch_out, status });

        if(isOffice.length) return resolve('Successfully checked out today')

        const registrationToken = await getDeviceId(supervisor_user_id)

        if(registrationToken) {
          const payload = {
            notification: {
              title: "Check Out Request",
              body: `${isValidEmployee.dataValues.user.dataValues.username} has requested for check out`
            }
          }
          sendPushNotification(registrationToken, payload)
        }

        return resolve('Requested for attendance application')
      }

      return reject(httpErrors.notFound())
    } 
    catch (err) {
      console.log("error check out =========================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};

Employee.prototype.createLeaveRequest = function () {
  return new Promise(async (resolve, reject) => {
    const {
      company_id,
      supervisor_user_id,
      employee_user_id,
      employee_id,
      leave_type_id,
      start_date_time,
      end_date_time,
      note,
      image
    } = this.data;

    if(!supervisor_user_id) return reject(httpErrors.unauthorized('Supervisor is not assigned for you yet'))

    if ( !(
      company_id && 
      supervisor_user_id &&
      employee_user_id &&
      employee_id &&
      leave_type_id && 
      start_date_time && 
      end_date_time
    )) return reject(httpErrors.unauthorized())


    try {
      const isValidEmployee = await Models.Employees.findOne({
        where: {
          id: employee_id,
          company_id
        },
        include: [
            {
              model: Models.Users
            }
        ]
      })

      if(!isValidEmployee) return reject(httpErrors.unauthorized())


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


      

      const leaveType = await Models.LeaveTypes.findOne({
        where:{
          id: leave_type_id
        }
      })

      if(!leaveType) return reject(httpErrors.notFound('leave is not found or deleted'))

      const employeeAvailableLeave = await Models.EmployeeAvailableLeaveNumbers.findOne({
        where:{
          leave_type_id
        }
      })

      if(!validLeaveRequest(start_date_time, end_date_time, leaveType, employeeAvailableLeave)){
        return reject(httpErrors.unauthorized('You applied more than available for you'))
      }

      const leave_request = await Models.EmployeeLeaveRequests.create({
        employee_id,
        company_id,
        leave_type_id,
        start_date_time,
        end_date_time,
        note,
        image
      });

      const registrationToken = await getDeviceId(supervisor_user_id)

      if(registrationToken) {
        const payload = {
          notification: {
            title: "Leave Request",
            body: `${isValidEmployee.dataValues.user.dataValues.username} has requested for leave request`
          }
        }
        sendPushNotification(registrationToken, payload)
      }

      return resolve(Messages['en'].SUCCESS_INSERT)
    } 
    catch (err) {
      console.log("Leave request error =========================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};

Employee.prototype.showAvailableLeaves = function () {
  return new Promise(async (resolve, reject) => {
    const { company_id, employee_id } = this.data;

    if ( !(employee_id && company_id) ) return reject(httpErrors.unauthorized())

    try {
      const available_leaves = await Models.LeaveTypes.findAll({
        where:{
          company_id
        }
      })

      console.log('available leaves of company ==================>', available_leaves)

      const getDone = async () => {
        return Promise.all(available_leaves.map( async m => {
          console.log('single available leave ==================>', m, ' ', m.dataValues.id)
          const individual_leave =  await Models.EmployeeAvailableLeaveNumbers.findOne({
            where:{
              leave_type_id: m.dataValues.id,
              employee_id,
              company_id
            }
          })

          console.log('corresponding available leave =============>', individual_leave)
  
          // yet individually not updated
          // so blindly copy it
          if(individual_leave && !individual_leave.dataValues.is_individual) {
            individual_leave.update({ available_leaves: m.dataValues.available_number })
          }
          else if(!individual_leave){
            await Models.EmployeeAvailableLeaveNumbers.create({
              employee_id,
              company_id,
              leave_type_id: m.dataValues.id,
              available_leaves: m.dataValues.available_number
            })
          }
          return Promise.resolve('completed')
        }))
      }

      await getDone()

      const leaveBalance = await Models.Employees.findOne({
        where: {
          id: employee_id
        },
        include: [
          {
            model: Models.LeaveTypes
          }
        ]
      });

      // console.log(leaveBalance)
      for(let i=0; leaveBalance && i<leaveBalance.dataValues.leave_types.length; i++){
        const m = leaveBalance.dataValues.leave_types[i]
        const available_leave = await Models.EmployeeAvailableLeaveNumbers.findOne({
          where:{
            leave_type_id: m.dataValues.id,
            employee_id
          }
        })

        m.dataValues.available_number = available_leave.dataValues.available_leaves - available_leave.dataValues.accepted_leave_number
      }
    //   console.log(leaveBalance)
      if(leaveBalance) return resolve(leaveBalance);

      return reject(httpErrors.notFound())
    } 
    catch (err) {
      console.log("Available leaves error =======================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};

Employee.prototype.getAttendanceList = function () {
  return new Promise( async (resolve, reject) => {
    const { employee_id } = this.data

    if(!employee_id) return reject(httpErrors.unauthorized())

    try{
      const attendanceList = await Models.Attendances.findAll({
        where: {
          employee_id
        }
      })

      if(attendanceList) return resolve(attendanceList)
      return reject(httpErrors.notFound())
    }
    catch(err){
      console.log("ERROR one employee attendance list ", err)
      return reject(httpErrors.internalServerError())
    }
  })
}


Employee.prototype.getLeaveRequestsList = function () {
  return new Promise( async (resolve, reject) => {
    const { employee_id } = this.data

    if(!employee_id) return reject(httpErrors.unauthorized())

    try{
      const leaveRequestList = await Models.EmployeeLeaveRequests.findAll({
        where: {
          employee_id
        },
        include: [
          {
            model: Models.LeaveTypes
          }
        ]
      })

      if(!leaveRequestList) reject(httpErrors.notFound())

      leaveRequestList.forEach( item => {
        const days = daysBetweenDates(item.dataValues.start_date_time, item.dataValues.end_date_time)
        item.dataValues.days = days
      })

      return resolve(leaveRequestList)
      
    }
    catch(err){
      console.log("ERROR one employee leave requests list ", err)
      return reject(httpErrors.internalServerError())
    }
  })
}

Employee.prototype.cancelLeaveRequest = function() {
  return new Promise( async (resolve, reject) => {
    const id = this.data.leave_id

    if(!id) return reject(httpErrors.unauthorized())


    Models.EmployeeLeaveRequests.destroy({
      where: {
        id
      }
    })
    .then(response => {
      if(response) return resolve(Messages['en'].SUCCESS_DELETE)
      return reject(httpErrors.notFound())
    })
    .catch( err => {
      console.log("ERROR in cancel leave request", err)
      return reject(httpErrors.internalServerError())
    })
  })
}

Employee.prototype.leaveTypes = function() {
  return new Promise( async (resolve, reject) => {
    const { company_id } = this.data

    Models.LeaveTypes.findAll({
      where: {
        company_id
      },
      attributes: {
        exclude: [
          "available_number",,
        ]
      }
    })
    .then( response => {
      return resolve(response)
    })
    .catch( err => {
      console.log("ERROR in leave types", err)
      return reject(httpErrors.internalServerError())
    })
  })
}


Employee.prototype.getCompanyAllBranches = function() {
  return new Promise( async (resolve, reject) => {
    const { company_id } = this.data

    if(!company_id) return reject(httpErrors.unauthorized('Invalid company id'))

    try{
      const company_branches = await Models.Companies.findOne({
        where: {
          id: company_id
        },
        include: [
          {
            model: Models.CompanyBranches
          }
        ]
      })

      return resolve(company_branches)
    }
    catch(err){
      console.log(err)
      return reject(httpErrors.internalServerError)
    }
  })
}

Employee.prototype.notExpired = function () {
	return new Promise(async (resolve, reject) => {
    const { company_id } = this.data;

    if (!(company_id)) return reject(httpErrors.unauthorized())

		try {
      console.log('cdd', company_id)
      const company = await Models.Companies.findOne({
        where: {
          id: company_id,
          license_start_date: {
            [Op.lte]: getDate(new Date())
          },
          license_end_date: {
            [Op.gte]: getDate(new Date())
          },
        }
      })
      
      if(!company) return reject(httpErrors.expired('You are expired, please subscribe again to get service'))
      
      return resolve('success')
    } 
    catch (err) {
			console.log("error in adding or updating =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};

Employee.prototype.isActive = function () {
	return new Promise(async (resolve, reject) => {
		const { employee_id } = this.data;

		if (!employee_id) return resolve("success");

		try {
			const employee = await Models.Employees.findOne({
				where: {
					id: employee_id,
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

Employee.prototype.changeAttendanceRequestStatus = function () {
	return new Promise(async (resolve, reject) => {
		const {
      supervisor_user_id,
      employee_user_id, 
      id, 
      status 
    } = this.data;

    if (!(
      supervisor_user_id && 
      employee_user_id &&
      id && 
      status
    )) return reject(httpErrors.unauthorized());

		Models.Attendances.findOne({
			where: {
				id,
			},
		})
    .then( async attendanceRequest => {
      if (attendanceRequest) {
        attendanceRequest.update({ status });

        const registrationToken = await getDeviceId(employee_user_id)

        if(registrationToken){
          const payload = {
            notification: {
              title: "Attendance Request",
              body: `Your attendance request has been ${status}`
            }
          }
          sendPushNotification(registrationToken, payload)
        }
        
        return resolve(Messages["en"].SUCCESS_UPDATE);
      }
      return reject(httpErrors.notFound());
    })
    .catch((err) => {
      console.log("ERROR in change attendance request status", err);
      return reject(httpErrors.internalServerError());
    })
	});
};

Employee.prototype.changeLeaveRequestStatus = function () {
	return new Promise(async (resolve, reject) => {
	  const { 
      supervisor_user_id,
      employee_user_id, 
      id, 
      status 
    } = this.data;

		if (!(
      supervisor_user_id &&
      employee_user_id &&
      id && 
      status
    )) return reject(httpErrors.unauthorized());

		Models.EmployeeLeaveRequests.findOne({
			where: {
				id,
			},
		})
    .then( async leaveRequest => {
      if (leaveRequest) {
        leaveRequest.update({ status });

        if(status == 'accepted') await decreaseAvailableLeave(leaveRequest)

        const registrationToken = await getDeviceId(employee_user_id)

        if(registrationToken) {
          const payload = {
            notification: {
              title: "Leave Request",
              body: `Your leave request has been ${status}`
            }
          }
          sendPushNotification(registrationToken, payload)
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

async function getDeviceId( id){
    try{
      const user = await Models.Users.findOne({
        where:{
          id
        }
      })
      return user.dataValues.device_id
    }
    catch(err){
      console.log(err)
      return null
    }
}

function validLeaveRequest(start_date_time, end_date_time, leave_type, employee_available_leave){
  if(leave_type.dataValues.type == 'vacation'){
    const daysApplied = daysBetweenDates(start_date_time, end_date_time)

    if(employee_available_leave){
      const already_accepted = employee_available_leave.dataValues.accepted_leave_number
      const available_number = employee_available_leave.dataValues.available_leaves
      if(already_accepted + daysApplied > available_number) return 0
    }
    
    // employee_available_leave is not created 
    const already_accepted = 0
    const available_number = leave_type.dataValues.available_number

    if(already_accepted + daysApplied > available_number) return 0

    return 1
  }
  else{
    const hoursApplied = hoursBetweenDates(start_date_time, end_date_time)

    if(employee_available_leave){
      const already_accepted = employee_available_leave.dataValues.accepted_leave_number
      const available_number = employee_available_leave.dataValues.available_leaves
      if(already_accepted + hoursApplied > available_number) return 0
    }
    
    // employee_available_leave is not created 
    const already_accepted = 0
    const available_number = leave_type.dataValues.available_number
  
    if(already_accepted + hoursApplied > available_number) return 0
  
    return 1
  }
}

async function decreaseAvailableLeave(leaveRequest){
  try{
    const leave_type = await Models.LeaveTypes.findOne({
      where: {
        id: leaveRequest.dataValues.leave_type_id
      }
    })
  
  
    const employee_available_leave = await Models.EmployeeAvailableLeaveNumbers.findOne({
      where: {
        leave_type_id: leaveRequest.dataValues.leave_type_id,
        employee_id: leaveRequest.dataValues.employee_id
      }
    })
  
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


module.exports = Employee;
