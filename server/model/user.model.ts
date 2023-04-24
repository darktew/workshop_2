import mongoose, { Document, Schema } from "mongoose"
import crypto from "crypto"

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  name: string
  salt: string
  token: string
  rtoken: string
  createdBy: String
  updatedBy: String
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  profile: any
  signtoken: any
  authenticate(
    password: string,
    arg1?: (authError: any, authenticated: any) => void
  ): any
  encryptPassword: (
    password: string,
    callback?: (err: any, pwdGen: string) => boolean
  ) => any
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  salt: String,
  rtoken: String,
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
  },
})

// Public profile information
UserSchema.virtual("profile").get(function (this: IUser): any {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
})

// Non-sensitive info we'll be putting in the token
UserSchema.virtual("signtoken").get(function (this: IUser): any {
  return {
    _id: this._id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
})

// Validate empty email
UserSchema.path("email").validate(function (
  this: IUser,
  email: string
): number | boolean {
  return email.length
},
"E-mail cannot be blank")

// Validate empty password
UserSchema.path("password").validate(function (
  this: IUser,
  password: string
): number | boolean {
  return password.length
},
"Password cannot be blank")

// Validate email is not taken
UserSchema.path("email").validate(function (this: any, value: string): boolean {
  return this.constructor
    .findOne({ email: value })
    .exec()
    .then((user: IUser) => {
      if (user) {
        if (this.id === user.id && !this.deletedAt) {
          return true
        }
        return false
      }
      return true
    })
    .catch(function (err: any) {
      throw err
    })
}, "อีเมล์นี้มีอยู่ในระบบอยู่แล้วกรุณาลองใหม่อีกครั้ง")

const validatePresenceOf = function (value: string): number | "" {
  return value && value.length
}

/**
 * Pre-save hook
 */
UserSchema.pre<IUser & Document>("save", function (this: any, next: any): any {
  const now = new Date()

  if (!this.createdAt) {
    this.createdAt = now
  } else {
    this.updatedAt = now
  }

  if (!this.name && this.email) {
    this.name = this.email
  }

  // Handle new/update passwords
  if (!this.isModified("password")) {
    return next()
  }

  if (!validatePresenceOf(this.password)) {
    return next(new Error("Invalid password"))
  }
  // Make salt with a callback
  this.makeSalt((saltErr: any, salt: string) => {
    if (saltErr) {
      return next(saltErr)
    }
    this.salt = salt
    this.encryptPassword(
      this.password,
      (encryptErr: any, hashedPassword: any) => {
        if (encryptErr) {
          return next(encryptErr)
        }
        this.password = hashedPassword
        return next()
      }
    )
  })
})

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(
    password: any,
    callback: (err: any, status?: boolean) => boolean
  ): any {
    if (!callback) {
      return this.password === this.encryptPassword(password)
    }

    this.encryptPassword(password, (err: any, pwdGen: string) => {
      if (err) {
        return callback(err)
      }
      if (this.password === pwdGen) {
        return callback(undefined, true)
      } else {
        return callback(undefined, false)
      }
    })
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(saltErr: any, salt: string): any {
    let byteSize: number | undefined
    let callback: (err: any, salt?: string) => string
    const defaultByteSize = 16

    if (typeof saltErr === "function") {
      callback = saltErr
      byteSize = defaultByteSize
    } else if (typeof salt === "function") {
      callback = salt
    } else {
      throw new Error("Missing Callback")
    }

    if (!byteSize) {
      byteSize = defaultByteSize
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err)
      } else {
        return callback(undefined, salt.toString("base64"))
      }
    })
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(
    password: string,
    callback: (err: any, value?: string) => string
  ): any {
    if (!password || !this.salt) {
      if (!callback) {
        return undefined
      } else {
        return callback("Missing password or salt")
      }
    }

    const defaultIterations = 10000
    const defaultKeyLength = 64
    const salt = Buffer.from(this.salt, "base64")

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, "sha1")
        .toString("base64")
    }

    return crypto.pbkdf2(
      password,
      salt,
      defaultIterations,
      defaultKeyLength,
      "sha1",
      (err, key) => {
        if (err) {
          return callback(err)
        } else {
          return callback(undefined, key.toString("base64"))
        }
      }
    )
  },
}

const User = mongoose.model("user", UserSchema)

export default User
