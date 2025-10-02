const User = require("../schema/userSchema");

const verifyAdmin = async(req, res, next) => {
    const email = req.decoded?.email;
    const user = await User.findOne({ email });
    const isAdmin = user?.role === 'admin';
    // console.log(isAdmin)
    if (!isAdmin) {
        // console.log('not admin');
        return res.status(403).send({ message: "forbidden access" });
    }
    next();
}

module.exports = verifyAdmin;