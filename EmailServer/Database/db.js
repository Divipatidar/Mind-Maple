const { User, Report } = require('../model/schema.js');

async function getUsersfromDB() {
    try {
        console.log('Fetching users from database...');
        const tenMinutesAgo = new Date();
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
        const data = await User.find({ totalmail: { $lt: 10 }, lastmail: { $lte: tenMinutesAgo } });
        console.log(`Users fetched: ${data.length}`);
        
        for (let doc of data) {
            const updateQuery = {
                $set: {
                    totalmail: doc.totalmail + 1,
                    lastmail: new Date()
                }
            };
            await User.updateOne({ _id: doc._id }, updateQuery);
            console.log(`Updated user ${doc._id}: totalmail=${doc.totalmail + 1}, lastmail=${new Date()}`);
        }
        return data;
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
}

async function getReportfromDB(id) {
    try {
        if (!id) {
            return null;
        }
        const data = await Report.find({ userId: id });
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getUsersfromDB,
    getReportfromDB
};
