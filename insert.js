const dbConnect = require('./mongodb');

const insert = async () => {
    const db = await dbConnect();
    const result = db.insert({
        name: 'dr. '
    })
}

insert();

