import passport from "passport"
import { Strategy } from "passport-local"

interface CallbackType {
  (error: any, user: any, message: any): void
}

const Authenticate = (
  User: any,
  email: string,
  password: string,
  done: CallbackType
) => {
  User.findOne({ email })
    .exec()
    .then(async (user: any): Promise<any> => {
      if (!user) {
        return done(undefined, false, {
          message: "ไม่พบ อีเมล์",
        })
      }
      user.authenticate(password, (authError: any, authenticated: any) => {
        if (authError) {
          return done(authError, false, {
            message: "กรุณากรอกอีเมล์หรือรหัสผ่านอีกครั้ง",
          })
        }
        if (!authenticated) {
          return done(authError, false, {
            message: "รหัสผ่านผิดพลาด",
          })
        }
        if (authenticated) {
          return done(undefined, user, null)
        }
      })
    })
    .catch((err: any) =>
      done(err, false, {
        message: "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งในภายหลัง",
      })
    )
}

export const setupLc = (User: any): void => {
  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email: string, password: string, done: CallbackType) {
        console.log("email :", email)
        console.log("password :", password)
        return Authenticate(User, email, password, done)
      }
    )
  )
}
