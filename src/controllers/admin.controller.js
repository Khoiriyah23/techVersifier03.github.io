const bcrypt = require("bcrypt")
const Admin = require("../models/admin.model");
const Product = require("../models/product.model");


const signUpPage = (req, res) => {
    res.render("admin_signup.ejs", {error:req.flash("error"), form: req.flash("formData")});
}

const addAdmin = (req, res) => {

    Admin.findOne({email: req.body.email})
    .then(admin => {
        if (admin) {
            req.flash("error", "An admin with the same email address is already exist");
        req.flash("formData", req.body);
        return res.redirect("/admin/signup")
        }

        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const adminData = {
           firstName:  req.body.fname,
           lastName: req.body.lname,
           email: req.body.email,
            password: hashPassword,
        }
    
        Admin.create(adminData)
        .then((admin) => {
            res.redirect("/admin/login")
        })
        .catch((err) => {
            req.flash("error", err._message);
            req.flash("formData", req.body);
            res.redirect("/admin/signup")
        })
    })
    .catch(error => {
        req.flash("error", err._message);
        req.flash("formData", req.body);
        return res.redirect("/admin/signup")
    })
    
}


const logInPage = (req, res) => {
    res.render("admin_login", {error: req.flash("error"), form: req.flash("formData")});
}

const login = (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        req.flash("error", "Email and Password are required");
        req.flash("formData", req.body)
        return res.redirect("/admin/login")
    }

    Admin.findOne({email})
    .then((admin) => {
        if(!admin) {
            req.flash("error", "Admin Account with the given email doesn't exist");
            req.flash("formData", req.body)
            return res.redirect("/admin/login")
        }else if (!bcrypt.compareSync(password, admin.password)) {
            req.flash("error", "Incorrect Password");
            req.flash("formData", req.body)
            return res.redirect("/admin/login")
        }
        req.session.adminId = admin._id;
        res.redirect("/admin/profile")
    })
    .catch(error => {
        req.flash("error", "error._message");
        req.flash("formData", req.body)
        return res.redirect("/admin/login")
    })
}

const profilePage = (req, res) => {
    Admin.findOne({_id: req.session.adminId})
    .then((admin) => {
        Product.find({admin: req.session.adminId})
        .then((products) => {
            res.render("admin_profile", {profile: admin, products})

        })
        .catch(error => {
            req.flash("error", error._message);
            return res.redirect("/admin/login")
    
        })
    })
    .catch(error => {
        req.flash("error", error._message);
        return res.redirect("/admin/login")

    })
}
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
}
module.exports = {
    signUpPage,
    logInPage,
    addAdmin,
    login,
    profilePage,
    logout
}