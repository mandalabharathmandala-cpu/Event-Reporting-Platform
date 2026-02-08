import UserRegister from '../models/user.model.js';

// Verify CAPTCHA token with Google
const verifyCaptcha = async (captchaToken) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY || 'YOUR_RECAPTCHA_SECRET_KEY';
        
        // Prevent verification if secret key not set
        if (secretKey === 'YOUR_RECAPTCHA_SECRET_KEY') {
            console.warn('Warning: RECAPTCHA_SECRET_KEY not configured in environment variables');
            // For development, allow but log warning
        }
        
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

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
    return password && password.length >= 6;
};

const registerUser = async (req, res) => {
    try {
        const { registerRole, firstName, lastName, email, password } = req.body;

        // Validate required fields
        if (!registerRole || !firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                fields: ["registerRole", "firstName", "lastName", "email", "password"]
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Validate role
        if (!["participant", "admin"].includes(registerRole)) {
            return res.status(400).json({ message: "Invalid role. Must be 'participant' or 'admin'" });
        }

        // Check if user already exists
        const existingUser = await UserRegister.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Create new user
        const newUser = new UserRegister({
            registerRole,
            firstName,
            lastName,
            email,
            password // Note: In production, use bcrypt for password hashing
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `A user with this ${field} already exists` });
        }
        
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Verify CAPTCHA token
        if (!captchaToken) {
            return res.status(400).json({ message: "CAPTCHA verification failed - token missing" });
        }

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ message: "CAPTCHA verification failed - please try again" });
        }

        // Find user by email and password
        const user = await UserRegister.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Don't send password in response
        const userResponse = {
            _id: user._id,
            registerRole: user.registerRole,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };

        res.status(200).json({ 
            message: "Login successful", 
            user: userResponse 
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export { registerUser, loginUser };