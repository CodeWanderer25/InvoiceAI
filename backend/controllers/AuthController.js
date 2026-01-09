const jwt = require("jsonwebtoken") ;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//  Generate JWT
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, {
expiresIn: "7d",
});
};



exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2️ Find user 
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️ Success response
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    // req.user is already available from protect middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only if value is sent
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.businessName = req.body.businessName || user.businessName;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      businessName: updatedUser.businessName || "",
      address: updatedUser.address || "",
      phone: updatedUser.phone || "",
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMe = async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                businessName: user.businessName || '',
                address: user.address || '',
                phone: user.phone || ''
            })
            
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
}



 