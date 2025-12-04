const { startOfDay, differenceInDays, addHours, addMinutes } = require('date-fns');
const cron = require('node-cron');
const user =  require("../models/user");

// Convert Date -> IST Date OBJECT (not string)
function toIST(date) {
  return new Date(
    date.toLocaleString(
    "en-IN", 
    { timeZone: "Asia/Kolkata" }
    )
    );
}

function startStreakBadge(){
    cron.schedule('* * * * *' , async ()=>{

     const now = new Date();  
     const todayIST = startOfDay(toIST(now));

    const users = await user.find({});

    for(const u of users){
        console.log("🔥 Cron running! ", new Date().toLocaleString());
        console.log("user id : ",u._id);
        if (!u.lastLoginAt) {
            u.streakCount = 1;
            u.lastLoginAt = now;
            await u.save();
            continue;
        }
        
        const lastIST = startOfDay(toIST(u.lastLoginAt));
        const diff    = differenceInDays(todayIST, lastIST);

        if(diff === 0){
            u.streakCount+=1
        }else if(diff === 1){
            u.streakCount+=1;
        }
        else if(diff > 1){
            u.streakCount = 0
        }

        // u.lastLoginAt = now;
        await u.save();
    }
},
{ timezone: "Asia/Kolkata" }   // <-- REQUIRED
)
}

module.exports = { startStreakBadge };


    