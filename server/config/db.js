const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://Vartan:9AL6DQp00HKnL2bX@cluster0.vzmdcqr.mongodb.net/dev");
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch(err) {
        console.error(err);
    }
}

module.exports = connectDB;