const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// mongodb connection
mongoose.connect('mongodb+srv://gautamkumar732380:Fzd2G0H6XOAFqCsZ@cluster0.sfezr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Models

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    isPropertyDealer: { type: Boolean, default: false },
});
const User = mongoose.model('User', UserSchema);

const PropertySchema = new mongoose.Schema({
    title: String,
    location: String,
    price: Number,
    description: String,
    houseType: String,
    image: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});
const Property = mongoose.model('Property', PropertySchema);

// jwt secret

const JWT_SECRET = 'a776606ff336ff1445bd72c66071504e7402c102bfc385c5e0f20018e5da57aa76fb73d4ae62edaa169bf9e42b2833b126006c5463d6fc34cc5985e0bf8c3e56';

// helper function to authenticate user

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

// Routes

// Register user

app.post('/register', async (req, res) => {
    const { name, email, password, isPropertyDealer } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, isPropertyDealer })

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
})

// Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Include isPropertyDealer in the JWT payload
        const token = jwt.sign(
            { id: user._id, isPropertyDealer: user.isPropertyDealer },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});


app.post('/add-properties', authenticate, async (req, res) => {

    const dealer = await User.findById(req.user.id);

    if (!dealer.isPropertyDealer) {
        return res.status(403).json({ message: 'Only dealer should be able to add properties' });
    }
    const { title, location, price, description, image, houseType } = req.body;

    try {
        const property = new Property({
            title,
            location,
            price,
            description,
            image,
            houseType,
            createdBy: req.user.id,
        });
        await property.save();
        res.status(201).json({ message: 'Property added successfully', property });
    } catch (err) {
        res.status(400).json({ message: 'Error adding property', error: err.message });
    }
});

app.get('/properties', async (req, res) => {
    try {
        const { sortBy, order } = req.query; // e.g., sortBy="price", order="asc"

        const sortCriteria = {};
        if (sortBy && order) {
            sortCriteria[sortBy] = order === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending
        }

        const properties = await Property.find()
            .sort(sortCriteria)
            .populate('createdBy', 'name email'); // Populate user details (optional)

        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching properties', error: err.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 