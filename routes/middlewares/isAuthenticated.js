const Signup = require("../../models/Signup");

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization) {
    // si il y'a un token
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await Signup.findOne({ token: token }).select("account"); // Signup fait ref a ma collection Signup qui devrait etre User
    if (!user) {
      // if user est falsy c'est que le find n'a pas trouvé de user correspondant au token
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      req.user = user; // je cree un objet dans la requete et cet objet contient l'objet du user
      return next(); // important pour passer a la suite
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
