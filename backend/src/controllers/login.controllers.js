import UserRegister from '../models/user.model.js';

// Verify CAPTCHA token with Google
const verifyCaptcha = async (captchaToken) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY || 'YOUR_RECAPTCHA_SECRET_KEY';
        
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${captchaToken}`
        });
        
        const data = await response.json();
        
        // Return true if score is above 0.5 (adjust threshold as needed)
        // Score range: 0.0 (likely bot) to 1.0 (likely human)
        return data.success && data.score > 0.5;
    } catch (error) {
        console.error('CAPTCHA verification error:', error);
        return false;
    }
};

const registerUser = async (req, res) => {
    try {
        const { registerRole, firstName, lastName,  email, password } = req.body;

        const existingUser = await UserRegister.findOne({ email });
        if(existingUser){
            return res.status(400).json({message: "User already exists with this email"});
        };

        const newUser = new UserRegister({
            registerRole,
            firstName,
            lastName,
            email,
            password
        })
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const loginUser = async (req,res) => {
    try {
        const { email, password, captchaToken } = req.body;

        // Verify CAPTCHA token
        if (!captchaToken) {
            return res.status(400).json({message: "CAPTCHA verification failed - token missing"});
        }

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({message: "CAPTCHA verification failed - please try again"});
        }

        const exists = await UserRegister.findOne({ email, password });
        if(!exists){
            return res.status(400).json({message: "Invalid email or password"});
        };

        res.status(200).json({message: "Login successful", user: exists});
    }
    catch (error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export { registerUser, loginUser };