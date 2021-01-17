const {
  model,
  Schema
} = require("mongoose");
const validator = require("mongoose-validator");
const bcrypt = require("bcrypt");


const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    lowercase: true,
    required: true,

  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /0\d{2}\d{4}\d{4}/.test(v);
      },
      message: 'Phone number is not valid, allows only 11 digits'
    },
    required: [true, 'User phone number required']
  },

  dob: {
    type: Date,
    validate: {
      validator: function (v) {
        v.setFullYear(v.getFullYear() + 18)
        const currentTime = new Date();
        currentTime.setHours(0, 0, 0, 0);
        return v.getTime() <= currentTime.getTime();
      },
      message: props => 'You must be 18 years old.'
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7
  },
  role: {
    type: String,
    required: true,
    trim: true,
    default: 'user'
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [
      validator({
        validator: 'isEmail',
        message: 'Oops..please enter valid email'
      })
    ],
    required: true
  },
  resetLink:{
    data: String,
    default:''
  },
  refreshTokens: [{
    token: {
      type: String,
      required: true,
    },
  },],
  

},

  {
    timestamps: true
  }
);

userSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({
    email
  })
  console.log(user)
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const err = new Error("Unable to login")
    err.httpStatusCode = 401
    throw err
  }

  return user
}
userSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
})
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
})
const UserModel = model("user", userSchema);

module.exports = UserModel;