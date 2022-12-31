const httpErrors = require('../http/error')
const Messages = require("../common_string")["messages"];
const winston = require("winston");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const Models = require("../models/dbmodel");
const jwt = require("jsonwebtoken");
const schema = require("../utils/schema");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const env = "dev";
const config = require("../config.json")[env];

const sequelize = new Sequelize(config?.database, config?.user, config?.password, {
  logging: console.log,
  dialect: "mysql",
  define: {
    timestamps: false
  },
  sync: true
});


const Admin = function (data) {
  console.log("info =======================>", data);
  this.data = data;
  this.errors = [];
};


Admin.prototype.addCompany = function () {
  return new Promise( async (resolve, reject) => {
    const {
      admin_id,
      
      username,
			email,
			password1,
      password2,
      is_active,
      
			name_en,
      name_ar,
      contact_person_name_en,
      contact_person_name_ar,
			phone_no,
			bank_iban,
			image,
			social_security_number,
			work_start_time,
      work_end_time,
      license_start_date,
      license_end_date,
      users_limit,
      branches_limit,

			bank_id,
			branch_id,
			country_id,
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
      const admin = await Models.Users.findOne({
        where: {
          id: admin_id
        }
      })
      if(!admin) return reject(httpErrors.unauthorized())

			const user = await Models.Users.create({
				user_type_id: 2,
				username,
				email,
        password: hashedPassword,
        is_active
			});

			await Models.Companies.create({
				user_id: user.dataValues.id,
				name_en,
        name_ar,
        contact_person_name_en,
        contact_person_name_ar,
				phone_no,
				bank_iban,
				image,
				social_security_number,
				work_start_time,
        work_end_time,
        license_start_date,
        license_end_date,
        users_limit,
        branches_limit
			});

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
    } 
    catch (err) {
			winston.log("error", err);
			console.log(err);
			return reject(httpErrors.internalServerError());
		}
  })
}


Admin.prototype.allCompanyInfo = function () {
  return new Promise( async (resolve, reject) => {
    const { admin_id } = this.data;
    
		if (!admin_id) return reject(httpErrors.unauthorized());
    
		try {
      const admin = await Models.Users.findOne({
        where: {
          id: admin_id
        }
      })
      if(!admin) return reject(httpErrors.unauthorized())

			const users = await Models.Companies.findAll({
				include: [
					{
						model: Models.Users,
						include: [
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
					},
				],
			});

			if (users) return resolve(users);
			return reject(httpErrors.notFound());
		} catch (err) {
      console.log('Error in fetching all compayn info ==========>', err)
			return reject(httpErrors.internalServerError());
		}
  })
}


Admin.prototype.oneCompanyInfo = function () {
	return new Promise(async (resolve, reject) => {
		const { admin_id, username } = this.data;

		if (!(admin_id && username)) return reject(httpErrors.unauthorized());
    
		try {
      const admin = await Models.Users.findOne({
        where: {
          id: admin_id
        }
      })
      if(!admin) return reject(httpErrors.unauthorized())

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
						model: Models.Companies,
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
			console.log("error company info =========================>", err);
			return reject(httpErrors.internalServerError());
		}
	});
};


Admin.prototype.updateCompanyInfo = function () {
	return new Promise(async (resolve, reject) => {
		const { 
      admin_id, 
      company_id,
      name_en,
      name_ar,
      contact_person_name_en,
      contact_person_name_ar,
      phone_no,
      email,
      country_id,
      social_security_number,
      image 
    } = this.data;

		if (!(admin_id, company_id)) return reject(httpErrors.unauthorized());

		try {
      const admin = await Models.Users.findOne({
        where: {
          id: admin_id
        }
      })
      if(!admin) return reject(httpErrors.unauthorized())

			const user = await Models.Companies.findOne({
				where: {
					id: company_id
				},
      });
      
			if (user) {
        if (image) user.update({ image });
        if(name_en) user.update({ name_en })
        if(name_ar) user.update({ name_ar })
        if(contact_person_name_en) user.update({ contact_person_name_en })
        if(contact_person_name_ar) user.update({ contact_person_name_ar })
        if(phone_no) user.update({ phone_no })
        if(social_security_number) user.update({ social_security_number })
        
        const userInfo = await Models.Companies.findOne({
          where: {
            id: company_id
          },
          include: [
            {
              model: Models.Users
            }
          ]
        })

        if(userInfo){
          const userId = userInfo.dataValues.user.dataValues.id
          if(country_id){
            await Models.UserCountries.update({ country_id }, {
              where: {
                user_id: userId
              }
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

module.exports = Admin;
