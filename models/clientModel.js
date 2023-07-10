import mongoose , {Schema } from 'mongoose'
import  bcrypt  from  'bcrypt';


var clientSchema= new Schema({
  firstName:{
    type:String,
    required:true,
    minLength:3,
    maxLength:30
},
lastName:{
  type:String,
  required:true,
  minLength:3,
  maxLength:30
},

    userName:{
        type:String,
        required:true,
        // unique:true,
        minLength:3,
        maxLength:30
    },
    password:{
      type:String,
      required:true,
      minLength:8,
      maxLength:16,
    //   validate: {
    //     validator: function (v) {
    //         return /^[a-zA-Z]{1,9}[0-9]{1,9}$/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid Password`
    // }
  },
    phone:{
      type:Number,
      required:true,
      unique:true,
      minLength:5,
      maxLength:20
  },

  email:{
    type:String,
    required:true,
    unique:true,
    minLength:3,
    maxLength:30,
  //   validate: {
  //     validator: function (v) {
  //         return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
  //     },
  //     message: props => `${props.value} is not a valid Email`
  // }
},
address:{
  type:String,
  required:true,
  minLength:4
},
isVerified:{
  type:Boolean,
 default:false
},
avatar:{
  type:String
  
 },
 description: {
  type: String,
},
isActive:{
  type:Boolean,
  default:true
},
  totalMoney: {
    type: Number,
    default: 0
  }
})



clientSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 12)
  next()
})


const setImageURL = (doc) => {
  if (doc.avatar) {
    doc.avatar = `${process.env.BASE_URL}/${doc.avatar}`;
  }
};

clientSchema.post("init", (doc) => {
  setImageURL(doc);
});

clientSchema.post("save", (doc) => {
  setImageURL(doc);
});



export default mongoose.model('client', clientSchema)


