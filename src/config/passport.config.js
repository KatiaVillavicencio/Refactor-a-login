import passport from 'passport'
import local from 'passport-local'
import { createHash, isValidPassword } from '../utils.js'
import UserManager from "../dao/managers/UserManagerMongo.js"
import GitHubStrategy from "passport-github2"


const LocalStrategy = local.Strategy

const userMan = new UserManager()
const initializePassword = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
          const { first_name, last_name, email, age, rol } = req.body;
      
          try {
            let user = await userMan.findEmail({ email: username })
            if (user) {
              console.log("El usuario ya existe");
              return done(null, false);
            }
      
            const hashedPassword = await createHash(password);
      
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: hashedPassword,
              rol
            };
      
            let result = await userMan.addUser(newUser);
            return done(null, result);
          } catch (error) {
            return done("Error al obtener el usuario" + error);
          }
        }))

        
        passport.serializeUser((user, done) => {
            done(null, user._id)
        })
        passport.deserializeUser(async (id, done) => {
            let user = await userMan.getUserById(id)
            done(null, user)
        })
        passport.use('login', new LocalStrategy({usernameField: "email"}, async(username, password, done) => {
            try
            {
                const user = await userMan.findEmail({email:username})
                if(!user)
                {
                    console.log("Usuario no existe")
                    return done (null, false)
                }
                if(!isValidPassword(user, password)) return done (null, false)
                return done(null, user)
            }
            catch(error)
            {
                return done(error)
            }
        }))
        passport.use('github', new GitHubStrategy({
          clientID: "Iv1.0d046f3f2b8fbac7",
          clientSecret: "3ce027f62ccd8ff05a99b79861c44bf9c8d6dd3d",
          callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        }, async (accessToken, refreshToken, profile, done)=>{
          try
          {
            console.log (profile)
            let user = await userMan.findEmail({email:profile._json.email})
            if(!user)
            {
               let newUser = {
                first_name: profile._json.login,
                last_name:" ",
                age: 35,
                email:profile._json.email,
                password:"",
                rol:""
              }
              let result = await userMan.create(newUser)
              done(null, result)
            }
            else
            {
              done(null, user)
            }
          }catch(error)
          {
            return done(error)
          }
        }
        ))
}

export default initializePassword