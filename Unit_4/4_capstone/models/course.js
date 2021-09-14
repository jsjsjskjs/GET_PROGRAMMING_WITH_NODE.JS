const mongoose = require('mongoose'),
{Schema} = mongoose,
courseSchema = new Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true
    },
    maxStudents:{
        type:Number,
        default:0, //초기값 0으로 설정
        min:[0, "Course cannot have a negative number of students!"] //음수가 올 수 없도록 설정
    },
    cost:{
        type:Number,
        default:0,
        min: [0, "Course cannot have a negative cost!"]
    },
},{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Course', courseSchema);