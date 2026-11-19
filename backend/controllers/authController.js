const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email and password must be strings"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password)
             VALUES ($1, $2)
             RETURNING id, email`,
            [normalizedEmail, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email and password must be strings"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };