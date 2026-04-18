const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/user.models");
const UserActivity = require("../models/userActivity.models");

const normalizeEmail = (value) => {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
};

const looksLikeBcryptHash = (value) => {
    return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
};


const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"});
}

exports.register = async (req,res) => {
    try{
        const {username,email,password} = req.body;
        const normalizedEmail = normalizeEmail(email);
        const normalizedUsername = typeof username === "string" ? username.trim() : "";

        if (!normalizedUsername || !normalizedEmail || !password) {
            return res.status(400).json({ message: "username, email, and password are required" });
        }

        const userExist = await User.findOne({email: normalizedEmail});

        if(userExist){
            return res.status(409).json({message:"User already exist"});
        }

        const hashPassword = await bcrypt.hash(password,10);
        
        const user = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password:hashPassword
        })

        res.status(201).json({
            id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken(user._id)
        })

    }catch(err){
        if (err && err.code === 11000) {
            const keyValue = err.keyValue && typeof err.keyValue === "object" ? err.keyValue : null;
            const field = keyValue ? Object.keys(keyValue)[0] : null;
            const message = field ? `${field} already exists` : "User already exists";
            return res.status(400).json({ message });
        }
        console.error("Register error:", err);
        res.status(500).json({
            message: err.message,
            ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
        });
    }
};


exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await User.findOne({email: normalizedEmail});

        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }

        if (typeof user.password !== "string" || user.password.length === 0) {
            return res.status(401).json({message:"Invalid email or password"});
        }

        let IsMatch = false;
        if (looksLikeBcryptHash(user.password)) {
            IsMatch = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plaintext fallback: allow login once, then upgrade hash.
            IsMatch = password === user.password;
            if (IsMatch) {
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
        }

        if(!IsMatch){
            return res.status(401).json({message:"Invalid email or password"});
        }

        res.json({
            id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken(user._id)
        });

    }catch(err){
        console.error("Login error:", err);
        res.status(500).json({
            message: err.message,
            ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
        });
    }
};

exports.me = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("_id username email").lean();
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch {
        return res.status(500).json({ message: "Unable to verify session" });
    }
};

exports.dashboard = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId)
            .select("_id username email createdAt updatedAt")
            .lean();

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userObjectId = new mongoose.Types.ObjectId(String(userId));

        const [
            totalActivities,
            cacheHitActivities,
            distinctRepoSlugs,
            recentActivities,
            byActionAgg,
            cachedRepositoriesAgg,
        ] = await Promise.all([
            UserActivity.countDocuments({ userId }),
            UserActivity.countDocuments({ userId, fromCache: true }),
            UserActivity.distinct("repoSlug", { userId, repoSlug: { $ne: null } }),
            UserActivity.find({ userId })
                .sort({ createdAt: -1 })
                .limit(15)
                .select("action endpoint repoUrl repoSlug statusCode fromCache durationMs createdAt")
                .lean(),
            UserActivity.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: "$action", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            UserActivity.aggregate([
                { $match: { userId: userObjectId, fromCache: true, repoSlug: { $ne: null } } },
                {
                    $group: {
                        _id: "$repoSlug",
                        cacheHits: { $sum: 1 },
                        lastAccessedAt: { $max: "$createdAt" },
                        lastAction: { $last: "$action" },
                    },
                },
                { $sort: { lastAccessedAt: -1 } },
                { $limit: 20 },
            ]),
        ]);

        const recentRepoSet = new Set();
        const recentRepositories = [];
        for (const activity of recentActivities) {
            const slug = activity && typeof activity.repoSlug === "string" ? activity.repoSlug : null;
            if (!slug || recentRepoSet.has(slug)) continue;
            recentRepoSet.add(slug);
            recentRepositories.push({
                repoSlug: slug,
                lastAction: activity.action || "REPO_ACTION",
                lastStatusCode: typeof activity.statusCode === "number" ? activity.statusCode : 0,
                lastAccessedAt: activity.createdAt || null,
                fromCache: Boolean(activity.fromCache),
            });
            if (recentRepositories.length >= 20) break;
        }

        const payload = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            cumulative: {
                totalActivities,
                totalRepositories: Array.isArray(distinctRepoSlugs) ? distinctRepoSlugs.length : 0,
                cachedActivities: cacheHitActivities,
                mostUsedActions: Array.isArray(byActionAgg)
                    ? byActionAgg.slice(0, 8).map((row) => ({ action: row._id, count: row.count }))
                    : [],
            },
            recentActivities: Array.isArray(recentActivities)
                ? recentActivities.map((activity) => ({
                    action: activity.action || "REPO_ACTION",
                    endpoint: activity.endpoint || "",
                    repoUrl: activity.repoUrl || null,
                    repoSlug: activity.repoSlug || null,
                    statusCode: typeof activity.statusCode === "number" ? activity.statusCode : 0,
                    fromCache: Boolean(activity.fromCache),
                    durationMs: typeof activity.durationMs === "number" ? activity.durationMs : 0,
                    createdAt: activity.createdAt || null,
                }))
                : [],
            recentRepositories,
            cachedRepositories: Array.isArray(cachedRepositoriesAgg)
                ? cachedRepositoriesAgg.map((row) => ({
                    repoSlug: row._id,
                    cacheHits: row.cacheHits,
                    lastAction: row.lastAction || "REPO_ACTION",
                    lastAccessedAt: row.lastAccessedAt || null,
                }))
                : [],
        };

        return res.json(payload);
    } catch (err) {
        return res.status(500).json({
            message: "Unable to load user dashboard.",
            ...(process.env.NODE_ENV !== "production" ? { error: err && err.message ? err.message : "unknown" } : {}),
        });
    }
};