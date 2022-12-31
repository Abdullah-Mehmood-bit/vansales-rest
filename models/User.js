const httpErrors = require('../http/error')
const Messages = require("../common_string")["messages"];
const winston = require("winston");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const Models = require("../models/dbmodel");
const jwt = require("jsonwebtoken");
const schema = require("../utils/schema");
const { Op } = require("sequelize");


const User = function (data) {
  console.log("info =======================>", data);
  this.data = data;
  this.errors = [];
};

User.prototype.uniqueUserName = function () {
  return new Promise(async (resolve, reject) => {
    const { username } = this.data;
    const { error } = schema.usernameSchema.validate(username)

    if (error) return reject(httpErrors.unauthorized('Invalid username'))
    
    try{
      const user = await Models.Users.findOne({
        where: {
          username
        }
      })

      if(user) return reject(httpErrors.unauthorized('This username already exists'))
      return resolve('success')
    }
    catch(err){
      return reject(httpErrors.internalServerError())
    }
  })
}


User.prototype.uniqueEmail = function () {
  return new Promise(async (resolve, reject) => {
    const { email } = this.data;
    const { error } = schema.emailSchema.validate(email)

    if (error) return reject(httpErrors.unauthorized('Invalid email'))
    
    try{
      const user = await Models.Users.findOne({
        where: {
          email
        }
      })

      if(user) return reject(httpErrors.unauthorized('This email already exists'))
      return resolve('success')
    }
    catch(err){
      return reject(httpErrors.internalServerError())
    }
  })
}


User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    const { username, password, device_id } = this.data;
    const { error } = schema.passwordSchema.validate(password);

    if (error) return reject(httpErrors.unauthorized('Invalid username or password'))

    try {
      const user = await Models.Users.findOne({
        where: {
          [Op.or]: [
            {
              email: username
            },
            {
              username: username 
            }
          ]
        },
        include: [
          {
            model: Models.UserTypes,
            as: "user_in_user_type"
          }
        ]
      });

      if(user && user.dataValues.online_status === 'online') return reject(httpErrors.unauthorized('This user is already logged in another device'))

      if (user && bcrypt.compareSync(password, user.dataValues.password)) {
        const userRole = user.dataValues.user_in_user_type.dataValues.name
        const role = user.dataValues.user_in_user_type.dataValues.id
        // normal and hashed
        const { id, username, email, password } = user.dataValues;
        const newuser = { id, username, email, password };
        
        const accessToken = jwt.sign(newuser, "secret");

        user.update({ device_id, online_status: 'online' })

        if(user.dataValues.user_type_id == 1){
            const employee = await Models.Employees.findOne({
                where:{
                    user_id: id
                }
            })

            const department = await Models.Departments.findOne({
                where: {
                    supervisor_id: employee.dataValues.id
                }
            })
            if(department){
                return resolve({ token: accessToken, userRole: '4', role: 4 });
            }
        }

        return resolve({ token: accessToken, userRole: ''+role, role: role });
      } 
      
      return reject(httpErrors.unauthorized('Invalid username or password'))
    } 
    catch (err) {
      console.log("error", "login error ================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};

User.prototype.logOut = function() {
  return new Promise( async (resolve, reject) => {
    const { email } = this.data
    const { error } = schema.emailSchema.validate(email);

    if (error) return reject(httpErrors.unauthorized())

    try{
      const user = await Models.Users.findOne({
        where: {
          email
        }
      })

      if(user){
        user.update({ online_status: 'offline' })
        return resolve('success')
      }
      return reject(httpErrors.notFound())
    }
    catch(err){
      return reject(httpErrors.internalServerError())
    }
  })
}

User.prototype.registered = function () {
  return new Promise(async (resolve, reject) => {
    const { email } = this.data;

    const { error } = schema.emailSchema.validate(email);

    if (error) return reject(httpErrors.unauthorized())

    try {
      const user = await Models.Users.findOne({
        where: { email }
      });

      if (user) return resolve("This email exists")

      return reject(httpErrors.notFound())
    } 
    catch (err) {
      console.log("error", "login error ================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};

User.prototype.otpSaved = function () {
  return new Promise(async (resolve, reject) => {

    // generating 6 digits otp
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false
    });
    console.log("Generated the otp ===========================>", otp);

    // making hash of the otp
    const hashedOtp = bcrypt.hashSync(otp, 8); 
    console.log("Hashed otp =====================>", hashedOtp);


    Models.Users.update(
      { otp: hashedOtp },
      {
        where: {
          email: this.data.email
        }
      }
    )
    .then(res => {
      console.log("Saved OTP ============>", res);
      resolve(otp);
    })
    .catch(err => {
      console.log("error", "login error ================>", err);
      return reject(httpErrors.internalServerError())
    });
  });
};


User.prototype.verifyOtp = function(){
  return new Promise(async (resolve, reject) => {
    const { email, otp } = this.data
    const { error } = schema.emailSchema.validate(email);

    if(error) return reject(httpErrors.unauthorized('This email is not registerd'))

    try{
      const user = await Models.Users.findOne({
        where: {
          email
        }
      })

      if (user && bcrypt.compareSync(otp, user.dataValues.otp)) {
        // otp and hashedOtp
        return resolve('valid otp')
      }
      return reject(httpErrors.notFound('Invalid OTP'))
    }
    catch(err){
      console.log(err)
      return reject(httpErrors.internalServerError())
    }
  })
}

User.prototype.resetPassword = function () {
  return new Promise(async (resolve, reject) => {
    const { password1, password2, otp, email } = this.data;
    const { error } = schema.passwordSchema.validate(password1);

    if (error) return reject(httpErrors.unauthorized(error.details[0].message));

    if (password1 != password2) return reject(httpErrors.unauthorized('Password not matched'))

    // making hash of the otp
    const hashedOtp = bcrypt.hashSync(otp, 8); 

    // making hash of the password
    const hashedPassword = bcrypt.hashSync(password1, 8); 

    console.log("Hashed otp =====================>", hashedOtp);
    console.log("Hashed password =====================>", hashedPassword);

    try {
      const user = await Models.Users.findOne({
        where: {
          email
        }
      });
      console.log("Finding the user to reset password==========>", user);

      if (user && bcrypt.compareSync(otp, user.dataValues.otp)) {
        // otp and hashedOtp
        await user.update({ password: hashedPassword });
        return resolve(Messages['en'].SUCCESS_UPDATE);
      }

      return reject(httpErrors.unauthorized())
    } 
    catch (err) {
      console.log("Password reset failed ================>", err);
      return reject(httpErrors.internalServerError())
    }
  });
};


User.prototype.getAllCountries = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const countries = await Models.Countries.findAll()
      return resolve(countries)
    } 
    catch (err) {
      console.log("Get all countries list failed ================>", err);
      return reject(httpErrors.internalServerError())
    }
  })
}


User.prototype.getAllBanks = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const banks = await Models.Banks.findAll()
      return resolve(banks)
    } 
    catch (err) {
      console.log("Get all banks list failed ================>", err);
      return reject(httpErrors.internalServerError())
    }
  })
}


User.prototype.getAllBranches = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const branches = await Models.Branches.findAll()
      return resolve(branches)
    } 
    catch (err) {
      console.log("Get all branches list failed ================>", err);
      return reject(httpErrors.internalServerError())
    }
  })
}

User.prototype.active = function () {
    return new Promise(async (resolve, reject) => {
      const { username } = this.data;
  
      if (!username) return reject(httpErrors.unauthorized('Invalid username or password'))
  
      try {
        const user = await Models.Users.findOne({
          where: {
            [Op.or]: [
              {
                email: username
              },
              {
                username: username 
              }
            ]
          },
          include: [
            {
              model: Models.UserTypes,
              as: "user_in_user_type"
            }
          ]
        });
  
        if(user && user.dataValues.is_active == 1) return resolve();
        return reject(
          httpErrors.deActivated(
              "Your account is deactivated, please contact with your management"
          )
        );
      } 
      catch (err) {
        console.log("error", err);
        return reject(httpErrors.internalServerError())
      }
    });

	// return new Promise(async (resolve, reject) => {
	// 	const { employee_id } = this.data;

	// 	if (!employee_id) return resolve("success");

	// 	try {
	// 		const employee = await Models.Employees.findOne({
	// 			where: {
	// 				id: employee_id,
    //             },
    //             include: [
    //                 {
    //                     model: Models.Users,
    //                 },
    //             ],
	// 		});

    //         if(company && company.dataValues.user.dataValues.is_active == 1) return resolve();

            // return reject(
            //     httpErrors.deActivated(
            //         "Your account is deactivated, please contact with your management"
            //     )
            // );
    //     } 
    //     catch (err) {
	// 		console.log(
	// 			"error in adding or updating =========================>",
	// 			err
	// 		);
	// 		return reject(httpErrors.internalServerError());
	// 	}
	// });
};


module.exports = User
