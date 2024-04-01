import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"

const videoSchema = new Schema({

      videoFile:{
        type : String,   //clouddinary url
        required : true
      },
      thumbnail :{
        type : String,
        required:true
      },
      title :{
        type : String,
        required:true
      },
      discription :{
        type : String,
        required:true
      },
      duration:{
        type : Number, // cloudinary 
        required:true
      },
      views:{
        type : Number,
        default:0
      },
      isPublished:{
        type :Boolean,
        default:true
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      },
      comments:[{
            type :Schema.Types.ObjectId,
            ref :"comments"
      }],
      like_dislike:[{
        type:Schema.Types.ObjectId,
        ref:"likes"
      }]

},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema);