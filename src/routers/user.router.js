import UserManager from "../dao/managers/UserManagerMongo.js" 
import { Router } from "express"
import passport from "passport"

const userRouter = Router()
const user = new UserManager()


userRouter.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}), async(req, res) => {
    try 
    {
        const { first_name, last_name, email, age, password, rol }= req.body
        if (!first_name || !last_name || !email ||!age) 
        return res.status (400). send ({status:400, error: "faltan datos"})
        res.redirect("/login")
    } catch (error) 
    {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
})

userRouter.post ("failregister", async(req,res)=>{
    console.log ("Registro fallido")
    res.send({error: "failed"})
})

userRouter.post("/login", passport.authenticate("login", {failureRedirect: "/faillogin"}), async (req, res) => {
    try 
    {
        if (!req.user) return res.status(400).send ({status: "error", error: "credenciales inválidas"})
          
            if(req.user.rol === 'admin'){
                req.session.emailUsuario = req.user.email
                req.session.nomUsuario = eq.user.first_name
                req.session.apeUsuario = eq.user.last_name
                req.session.rolUsuario = eq.user.rol
                res.redirect("/profile")
            }
            else{
                req.session.emailUsuario = req.user.email
                req.session.rolUsuario = req.user.rol
                res.redirect("/api/products" )
            }

    } 
    catch (error) 
    {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
})
userRouter.get ("faillogin",async(req,res)=>{
    res.send ({error: "Failed login"})
})

userRouter.get("/logout", async (req, res) => {
    req.session.destroy((error) =>{
        if(error)
        {
            return res.json({ status: 'Logout Error', body: error})
        }
        res.redirect('../../login')
    })    
})

//logica Github//

userRouter.get ("/github", passport.authenticate("github", {scope:["user:email"]}),async (req, res) =>{} )
userRouter.get ("/githubcallback", passport.authenticate ("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user
    req.session.emailUsuario = req.session.user.email
    req.session.rolUsuario = req.session.user.rol
    res.redirect("/api/products" )
})


export default userRouter