const mongoose = require('mongoose'),
{Schema} = mongoose,

userSchema = new Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
      },
      zipCode: {
        type: Number,
        min: [1000, "Zip code too short"],
        max: 99999
      },
      password: {
        type: String,
        required: true
      },
      courses: [{ type: Schema.Types.ObjectId, ref: "Course"}],
      subscribedAccount: {
          type: Schema.Types.ObjectId,
          ref: "Subscriber"
      }
    },
    {
        timestamps: true // timestamps 속성을 추가해 createAt, updateAt 시간기록
    }
)

//이름과 성이 한 줄로 유용할 수 있다는 것을 감안해서 Mongoose의 가상 속성(Virtual attribute)을 이용해 각 인스턴스의 해당 데이터 저장을 할 수 있다.
//가상 속성은 정규 스키마 속성과 유사하지만 데이터베이스에 저장되지는 않는다.
//이를 생성하려면 virtual 메소드를 스키마에서 사용하고 속성과 사용하고 싶은 가상 속성의 이름을 전달한다.
//이 가상 속성은 데이터베이스에 저장되지 않지만 사용자 모델에서 user.zipCode와 같이 다른 속성과 마찬가지로 동작한다.
//user.fullName으로 검색 할 수 있다.
userSchema.virtual('fullName').get(() => `${this.name.first} ${this.name.last}`)

module.exports = mongoose.model("User", userSchema)